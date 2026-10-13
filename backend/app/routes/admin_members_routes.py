import secrets
from flask import Blueprint, request, jsonify
from backend.app.models import db, Member, AuditLog
from backend.app.services.jwt_auth import roles_required
from backend.app.services.financial_service import FinancialService

admin_members_bp = Blueprint('admin_members', __name__, url_prefix='/api/admin/members')

@admin_members_bp.route('', methods=['GET'])
@admin_members_bp.route('/', methods=['GET'])
@roles_required('master_admin', 'secretary', 'treasurer')
def list_members():
    q = request.args.get('q', '').strip()
    status_filter = request.args.get('status', '').strip()
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 50))

    query = Member.query
    if q:
        query = query.filter(
            (Member.full_name.ilike(f'%{q}%')) |
            (Member.member_id.ilike(f'%{q}%')) |
            (Member.phone.ilike(f'%{q}%')) |
            (Member.email.ilike(f'%{q}%'))
        )
    if status_filter:
        query = query.filter_by(status=status_filter)

    query = query.order_by(Member.created_at.desc())
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    members_data = []
    for m in pagination.items:
        m_dict = m.to_dict()
        # Attach fast computed balances
        m_dict['financialSummary'] = FinancialService.calculate_member_financials(m.id)
        members_data.append(m_dict)

    return jsonify({
        'success': True,
        'data': {
            'members': members_data,
            'total': pagination.total,
            'page': pagination.page,
            'pages': pagination.pages
        }
    }), 200

@admin_members_bp.route('', methods=['POST'])
@admin_members_bp.route('/', methods=['POST'])
@roles_required('master_admin', 'secretary', 'treasurer')
def create_member():
    data = request.get_json() or {}
    full_name = data.get('fullName', '').strip()
    member_id = data.get('memberId', '').strip()
    email = data.get('email', '').strip() or None
    phone = data.get('phone', '').strip() or None
    branch = data.get('branch', 'Victoria Island Regional Office').strip()
    nin = data.get('nin', '').strip() or None
    address = data.get('address', '').strip() or None
    occupation = data.get('occupation', '').strip() or None
    next_of_kin = data.get('nextOfKin')
    bank_details = data.get('bankDetails') or {}

    if not full_name:
        return jsonify({'success': False, 'message': 'Full name is required.'}), 400

    # Auto-generate memberId if not provided e.g. "MCS-2026-XXXX"
    if not member_id:
        count = Member.query.count() + 1
        member_id = f"MCS-2026-{1000 + count}"

    # Check for duplicate member ID
    existing = Member.query.filter_by(member_id=member_id).first()
    if existing:
        return jsonify({'success': False, 'message': f"Membership ID '{member_id}' is already registered."}), 400

    # Check duplicate email if supplied
    if email:
        existing_email = Member.query.filter_by(email=email).first()
        if existing_email:
            return jsonify({'success': False, 'message': f"Email '{email}' is already associated with member {existing_email.member_id}."}), 400

    member = Member(
        member_id=member_id,
        full_name=full_name,
        email=email,
        phone=phone,
        branch=branch,
        nin=nin,
        address=address,
        occupation=occupation,
        status='active',
        kyc_verified=True,
        bank_name=bank_details.get('bankName'),
        account_number=bank_details.get('accountNumber'),
        account_name=bank_details.get('accountName')
    )
    if next_of_kin:
        member.next_of_kin = next_of_kin

    db.session.add(member)
    db.session.flush()

    # Record opening balances brought forward (b/f)
    savings_bf = float(data.get('savingsBf', 0) or 0)
    shares_bf = float(data.get('sharesBf', 0) or 0)
    loans_bf = float(data.get('loansBf', 0) or 0)
    loan_interest_bf = float(data.get('loanInterestBf', 0) or 0)
    coop_deduction_bf = float(data.get('coopDeductionBf', 0) or 0)

    from backend.app.services.financial_service import naira_to_kobo
    from backend.app.models.loan import Loan
    from datetime import datetime

    if savings_bf > 0:
        FinancialService.record_payment(
            member_id=member.id,
            category='savings',
            txn_type='deposit',
            gross_amount_kobo=naira_to_kobo(savings_bf),
            payment_method='internal_journal',
            description=f'Opening savings balance brought forward (b/f) ({member_id})',
            recorded_by_user_id=request.current_user.id,
            is_verified=True
        )

    if shares_bf > 0:
        FinancialService.record_payment(
            member_id=member.id,
            category='shares',
            txn_type='share_purchase',
            gross_amount_kobo=naira_to_kobo(shares_bf),
            payment_method='internal_journal',
            description=f'Opening share capital brought forward (b/f) ({member_id})',
            recorded_by_user_id=request.current_user.id,
            is_verified=True
        )

    if loans_bf > 0:
        total_loan_owed_kobo = naira_to_kobo(loans_bf + loan_interest_bf)
        loan_rec = Loan(
            loan_reference=f"LN-BF-{member_id}-{int(datetime.utcnow().timestamp())}",
            member_id=member.id,
            principal_kobo=naira_to_kobo(loans_bf),
            outstanding_kobo=total_loan_owed_kobo,
            interest_rate_pct=5.0,
            duration_months=12,
            monthly_repayment_kobo=total_loan_owed_kobo // 12 if total_loan_owed_kobo > 0 else 0,
            purpose='Legacy loan balance brought forward (b/f)',
            status='active'
        )
        db.session.add(loan_rec)

        FinancialService.record_payment(
            member_id=member.id,
            category='loans',
            txn_type='disbursement',
            gross_amount_kobo=naira_to_kobo(loans_bf),
            payment_method='internal_journal',
            description=f'Opening loan principal balance brought forward (b/f) ({member_id})',
            recorded_by_user_id=request.current_user.id,
            is_verified=True
        )

    if loan_interest_bf > 0:
        FinancialService.record_payment(
            member_id=member.id,
            category='loans',
            txn_type='deduction',
            gross_amount_kobo=naira_to_kobo(loan_interest_bf),
            payment_method='internal_journal',
            description=f'Opening loan interest accrued brought forward (b/f) ({member_id})',
            recorded_by_user_id=request.current_user.id,
            is_verified=True
        )

    if coop_deduction_bf > 0:
        FinancialService.record_payment(
            member_id=member.id,
            category='fees',
            txn_type='deduction',
            gross_amount_kobo=naira_to_kobo(coop_deduction_bf),
            payment_method='internal_journal',
            description=f'Opening cooperative statutory deduction brought forward (b/f) ({member_id})',
            recorded_by_user_id=request.current_user.id,
            is_verified=True
        )

    # Audit log
    audit = AuditLog(
        user_id=request.current_user.id,
        action='MEMBER_REGISTERED',
        target_type='member',
        target_id=member_id,
        details={'fullName': full_name, 'memberId': member_id, 'branch': branch}
    )
    db.session.add(audit)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': f"Member {full_name} ({member_id}) registered successfully with opening ledger balances.",
        'data': member.to_dict()
    }), 201

@admin_members_bp.route('/<int:id>', methods=['GET'])
@roles_required('master_admin', 'secretary', 'treasurer')
def get_member(id):
    member = db.get_or_404(Member, id)
    m_dict = member.to_dict()
    m_dict['financialSummary'] = FinancialService.calculate_member_financials(member.id)
    m_dict['recentTransactions'] = [t.to_dict() for t in member.transactions[:25]]
    return jsonify({'success': True, 'data': m_dict}), 200

@admin_members_bp.route('/<int:id>', methods=['PATCH'])
@roles_required('master_admin', 'secretary')
def update_member(id):
    member = Member.query.get_or_404(id)
    data = request.get_json() or {}

    if 'fullName' in data:
        member.full_name = data['fullName'].strip()
    if 'email' in data:
        member.email = data['email'].strip() or None
    if 'phone' in data:
        member.phone = data['phone'].strip() or None
    if 'branch' in data:
        member.branch = data['branch'].strip()
    if 'status' in data:
        member.status = data['status'].strip()
    if 'address' in data:
        member.address = data['address'].strip()
    if 'occupation' in data:
        member.occupation = data['occupation'].strip()
    if 'nextOfKin' in data:
        member.next_of_kin = data['nextOfKin']

    audit = AuditLog(
        user_id=request.current_user.id,
        action='MEMBER_UPDATED',
        target_type='member',
        target_id=member.member_id,
        details={'updatedFields': list(data.keys())}
    )
    db.session.add(audit)
    db.session.commit()

    return jsonify({'success': True, 'message': 'Member details updated.', 'data': member.to_dict()}), 200
