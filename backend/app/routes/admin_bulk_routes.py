"""
Bulk operations routes: member import, system metrics, membership applications.
These endpoints back the admin dashboard widgets that were previously mock-based.
"""
from datetime import datetime, date
from flask import Blueprint, request, jsonify
from backend.app.models import db, Member, User, Transaction, Loan, Investment, AuditLog, ClaimToken
from backend.app.services.jwt_auth import roles_required
from backend.app.services.financial_service import FinancialService, naira_to_kobo

admin_bulk_bp = Blueprint('admin_bulk', __name__, url_prefix='/api/admin')


# ───────────────────────────── System Metrics ─────────────────────────────
@admin_bulk_bp.route('/metrics', methods=['GET'])
@roles_required('master_admin', 'treasurer', 'secretary')
def get_system_metrics():
    total_members = Member.query.filter_by(status='active').count()
    total_all_members = Member.query.count()

    # Today's intake
    today_start = datetime.combine(date.today(), datetime.min.time())
    today_txns = Transaction.query.filter(
        Transaction.created_at >= today_start,
        Transaction.status == 'confirmed'
    ).all()
    daily_intake_kobo = sum(t.gross_amount_kobo for t in today_txns if t.gross_amount_kobo > 0)

    # Pending verifications
    pending_count = Transaction.query.filter_by(status='pending_verification').count()

    # Loans
    active_loans = Loan.query.filter_by(status='active').count()
    pending_loans = Loan.query.filter_by(status='pending').count()

    # Financial totals
    confirmed = Transaction.query.filter_by(status='confirmed').all()
    total_savings_kobo = sum(t.net_amount_kobo for t in confirmed if t.category == 'savings' and t.net_amount_kobo > 0)
    total_shares_kobo = sum(t.net_amount_kobo for t in confirmed if t.category == 'shares' and t.net_amount_kobo > 0)

    return jsonify({
        'success': True,
        'data': {
            'totalMembers': total_all_members,
            'activeMembers': total_members,
            'dailyIntakeNaira': round(daily_intake_kobo / 100.0, 2),
            'pendingDepositsCount': pending_count,
            'pendingLoanVettingsCount': pending_loans,
            'pendingDisbursementsCount': 0,
            'activeLoansCount': active_loans,
            'totalSavingsNaira': round(total_savings_kobo / 100.0, 2),
            'totalShareCapitalNaira': round(total_shares_kobo / 100.0, 2),
            'totalDividendsPaid': 0
        }
    }), 200


# ───────────────────────────── Bulk Member Import ─────────────────────────────
@admin_bulk_bp.route('/members/bulk-import', methods=['POST'])
@roles_required('master_admin', 'secretary')
def bulk_import_members():
    data = request.get_json() or {}
    rows = data.get('rows', [])

    if not rows or not isinstance(rows, list):
        return jsonify({'success': False, 'message': 'A non-empty "rows" array is required.'}), 400

    new_count = 0
    updated_count = 0
    duplicate_count = 0
    errors = []
    total_savings_bf = 0

    seen_in_batch = set()

    for idx, row in enumerate(rows):
        full_name = (row.get('fullName') or '').strip()
        phone = (row.get('phone') or '').strip()
        member_id_raw = (row.get('memberId') or '').strip().upper()
        email_raw = (row.get('email') or '').strip() or None
        address = (row.get('address') or '').strip() or None
        occupation = (row.get('occupation') or '').strip() or None
        savings_bf = float(row.get('savingsBf', row.get('totalSavings', 0)) or 0)
        shares_bf = float(row.get('sharesBf', row.get('shareCapital', 0)) or 0)
        loans_bf = float(row.get('loansBf', row.get('loanPrincipalBf', row.get('loanBf', 0))) or 0)
        loan_interest_bf = float(row.get('loanInterestBf', 0) or 0)
        coop_deduction_bf = float(row.get('coopDeductionBf', row.get('cooperativeDeductionBf', 0)) or 0)

        if not full_name:
            errors.append(f"Row {idx + 1}: Missing fullName")
            continue

        # Auto-generate member ID if missing
        if not member_id_raw:
            count = Member.query.count() + new_count + 1
            member_id_raw = f"MCS-2026-{1000 + count}"

        # Skip batch duplicates
        if member_id_raw in seen_in_batch:
            duplicate_count += 1
            continue
        seen_in_batch.add(member_id_raw)

        total_savings_bf += savings_bf

        # Check if already exists
        existing = Member.query.filter_by(member_id=member_id_raw).first()
        if existing:
            # Update existing record
            if full_name:
                existing.full_name = full_name
            if phone:
                existing.phone = phone
            if address:
                existing.address = address
            if occupation:
                existing.occupation = occupation
            updated_count += 1
        else:
            member = Member(
                member_id=member_id_raw,
                full_name=full_name,
                email=email_raw,
                phone=phone,
                address=address,
                occupation=occupation,
                branch='Head Secretariat Ikeja',
                status='active',
                kyc_verified=True
            )
            db.session.add(member)
            db.session.flush()

            # 1. Record Savings Balance Brought Forward
            if savings_bf > 0:
                FinancialService.record_payment(
                    member_id=member.id,
                    category='savings',
                    txn_type='deposit',
                    gross_amount_kobo=naira_to_kobo(savings_bf),
                    payment_method='internal_journal',
                    description=f'Savings balance brought forward (b/f) ({member_id_raw})',
                    recorded_by_user_id=request.current_user.id,
                    is_verified=True
                )

            # 2. Record Share Capital Brought Forward
            if shares_bf > 0:
                FinancialService.record_payment(
                    member_id=member.id,
                    category='shares',
                    txn_type='share_purchase',
                    gross_amount_kobo=naira_to_kobo(shares_bf),
                    payment_method='internal_journal',
                    description=f'Share capital brought forward (b/f) ({member_id_raw})',
                    recorded_by_user_id=request.current_user.id,
                    is_verified=True
                )

            # 3. Record Loan Principal Brought Forward & Active Loan Object
            if loans_bf > 0:
                total_loan_owed_kobo = naira_to_kobo(loans_bf + loan_interest_bf)
                loan_rec = Loan(
                    loan_reference=f"LN-BF-{member_id_raw}-{int(datetime.utcnow().timestamp())}",
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
                    description=f'Loan principal balance brought forward (b/f) ({member_id_raw})',
                    recorded_by_user_id=request.current_user.id,
                    is_verified=True
                )

            # 4. Record Loan Interest Brought Forward
            if loan_interest_bf > 0:
                FinancialService.record_payment(
                    member_id=member.id,
                    category='loans',
                    txn_type='deduction',
                    gross_amount_kobo=naira_to_kobo(loan_interest_bf),
                    payment_method='internal_journal',
                    description=f'Loan interest accrued brought forward (b/f) ({member_id_raw})',
                    recorded_by_user_id=request.current_user.id,
                    is_verified=True
                )

            # 5. Record Cooperative Statutory Deduction Brought Forward
            if coop_deduction_bf > 0:
                FinancialService.record_payment(
                    member_id=member.id,
                    category='fees',
                    txn_type='deduction',
                    gross_amount_kobo=naira_to_kobo(coop_deduction_bf),
                    payment_method='internal_journal',
                    description=f'Cooperative statutory deduction brought forward (b/f) ({member_id_raw})',
                    recorded_by_user_id=request.current_user.id,
                    is_verified=True
                )

            new_count += 1

    # Audit
    audit = AuditLog(
        user_id=request.current_user.id,
        action='BULK_MEMBER_IMPORT',
        target_type='system',
        target_id='bulk_import',
        details={
            'totalParsed': len(rows),
            'newImported': new_count,
            'updated': updated_count,
            'duplicates': duplicate_count,
            'errors': len(errors),
            'totalSavingsBroughtForward': total_savings_bf
        }
    )
    db.session.add(audit)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': f'Bulk import complete: {new_count} new, {updated_count} updated, {duplicate_count} duplicates skipped.',
        'data': {
            'totalParsed': len(rows),
            'totalImported': new_count,
            'updatedCount': updated_count,
            'duplicateCount': duplicate_count,
            'totalSavingsBroughtForward': total_savings_bf,
            'errors': errors[:10]  # Limit error output
        }
    }), 201


# ───────────────────────── Walk-In Registration ──────────────────────────
@admin_bulk_bp.route('/members/walk-in', methods=['POST'])
@roles_required('master_admin', 'secretary')
def register_walk_in_member():
    data = request.get_json() or {}
    full_name = (data.get('fullName') or '').strip()
    phone = (data.get('phone') or '').strip()
    email = (data.get('email') or '').strip() or None
    address = (data.get('address') or '').strip() or None
    occupation = (data.get('occupation') or '').strip() or None
    branch = (data.get('branch') or 'Head Secretariat Ikeja').strip()
    nin = (data.get('nin') or data.get('idNumber') or '').strip() or None
    next_of_kin = data.get('nextOfKin')

    if not full_name or not phone:
        return jsonify({'success': False, 'message': 'Full name and phone number are required.'}), 400

    # Auto-generate member ID
    count = Member.query.count() + 1
    member_id = f"MCS-2026-{1000 + count}"

    # Ensure unique
    while Member.query.filter_by(member_id=member_id).first():
        count += 1
        member_id = f"MCS-2026-{1000 + count}"

    member = Member(
        member_id=member_id,
        full_name=full_name,
        email=email,
        phone=phone,
        branch=branch,
        address=address,
        occupation=occupation,
        nin=nin,
        status='active',
        kyc_verified=True
    )
    if next_of_kin:
        member.next_of_kin = next_of_kin

    db.session.add(member)

    audit = AuditLog(
        user_id=request.current_user.id,
        action='WALK_IN_REGISTRATION',
        target_type='member',
        target_id=member_id,
        details={'fullName': full_name, 'phone': phone, 'branch': branch}
    )
    db.session.add(audit)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': f'Walk-in member {full_name} registered. ID: {member_id}',
        'data': member.to_dict()
    }), 201


# ──────────────────── Generate Claim Code for Member ─────────────────────
@admin_bulk_bp.route('/members/<int:id>/generate-claim-code', methods=['POST'])
@roles_required('master_admin', 'secretary', 'treasurer')
def generate_claim_for_member(id):
    member = db.get_or_404(Member, id)
    from backend.app.services.auth_service import AuthService
    try:
        code = AuthService.generate_member_claim_code(request.current_user, member.member_id)
        return jsonify({
            'success': True,
            'message': f'Claim code generated for {member.full_name}.',
            'data': {'claimCode': code, 'memberId': member.member_id, 'expiresInHours': 72}
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 400
