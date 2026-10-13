from datetime import datetime
from flask import Blueprint, request, jsonify
from backend.app.models import db, Transaction, Member, AuditLog
from backend.app.services.jwt_auth import roles_required
from backend.app.services.financial_service import FinancialService, naira_to_kobo

admin_transactions_bp = Blueprint('admin_transactions', __name__, url_prefix='/api/admin/transactions')

@admin_transactions_bp.route('', methods=['GET'])
@admin_transactions_bp.route('/', methods=['GET'])
@roles_required('master_admin', 'treasurer', 'secretary')
def list_transactions():
    q = request.args.get('q', '').strip()
    status_filter = request.args.get('status', '').strip()
    payment_method = request.args.get('paymentMethod', '').strip()
    category = request.args.get('category', '').strip()
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 50))

    query = Transaction.query
    if category:
        query = query.filter_by(category=category)
    if status_filter:
        query = query.filter_by(status=status_filter)
    if payment_method:
        query = query.filter_by(payment_method=payment_method)
    if q:
        query = query.join(Member).filter(
            (Transaction.reference.ilike(f'%{q}%')) |
            (Transaction.description.ilike(f'%{q}%')) |
            (Member.full_name.ilike(f'%{q}%')) |
            (Member.member_id.ilike(f'%{q}%'))
        )

    query = query.order_by(Transaction.created_at.desc())
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'success': True,
        'data': {
            'transactions': [t.to_dict() for t in pagination.items],
            'total': pagination.total,
            'page': pagination.page,
            'pages': pagination.pages
        }
    }), 200

@admin_transactions_bp.route('', methods=['POST'])
@admin_transactions_bp.route('/', methods=['POST'])
@roles_required('master_admin', 'treasurer')
def record_transaction():
    data = request.get_json() or {}
    member_ident = data.get('memberId') or data.get('membershipId')
    amount = data.get('amount')
    amount_kobo = data.get('amountKobo')
    category = data.get('category', 'savings').strip().lower()
    txn_type = data.get('txnType', 'deposit').strip().lower()
    payment_method = data.get('paymentMethod', 'cash').strip().lower()
    description = data.get('description', '').strip()
    bank_reference = data.get('bankReference')
    is_verified = data.get('isVerified', True)

    if not member_ident:
        return jsonify({'success': False, 'message': 'Member identification is required.'}), 400

    if not description:
        return jsonify({'success': False, 'message': 'A manually entered transaction description is required.'}), 400

    # Determine amount in kobo
    if amount_kobo is not None:
        try:
            kobo_val = int(amount_kobo)
        except (ValueError, TypeError):
            return jsonify({'success': False, 'message': 'Invalid amountKobo value.'}), 400
    elif amount is not None:
        try:
            kobo_val = naira_to_kobo(float(amount))
        except (ValueError, TypeError):
            return jsonify({'success': False, 'message': 'Invalid amount value.'}), 400
    else:
        return jsonify({'success': False, 'message': 'Amount is required.'}), 400

    if kobo_val <= 0:
        return jsonify({'success': False, 'message': 'Amount must be greater than zero.'}), 400

    # Resolve member by id or member_id string
    if isinstance(member_ident, int) or (isinstance(member_ident, str) and member_ident.isdigit()):
        member = db.session.get(Member, int(member_ident))
    else:
        member = Member.query.filter_by(member_id=str(member_ident).strip().upper()).first()

    if not member:
        return jsonify({'success': False, 'message': f"Member '{member_ident}' not found."}), 404

    # If payment method is bank transfer and not confirmed immediately by treasurer, set pending
    if payment_method == 'bank_transfer' and not data.get('instantConfirm'):
        is_verified = False

    try:
        txn = FinancialService.record_payment(
            member_id=member.id,
            category=category,
            txn_type=txn_type,
            gross_amount_kobo=kobo_val,
            payment_method=payment_method,
            description=description,
            recorded_by_user_id=request.current_user.id,
            bank_reference=bank_reference,
            is_verified=is_verified
        )
        return jsonify({
            'success': True,
            'message': f"Payment recorded successfully. Ref: {txn.reference}",
            'data': txn.to_dict()
        }), 201
    except ValueError as ve:
        return jsonify({'success': False, 'message': str(ve)}), 400
    except Exception as e:
        return jsonify({'success': False, 'message': 'Error recording transaction.'}), 500

@admin_transactions_bp.route('/<int:id>/verify', methods=['POST'])
@roles_required('master_admin', 'treasurer')
def verify_transaction(id):
    txn = db.get_or_404(Transaction, id)
    if txn.status == 'confirmed':
        return jsonify({'success': False, 'message': 'Transaction is already confirmed.'}), 400
    if txn.status == 'reversed':
        return jsonify({'success': False, 'message': 'Cannot confirm a reversed transaction.'}), 400

    txn.status = 'confirmed'
    txn.verified_by_user_id = request.current_user.id
    txn.confirmed_at = datetime.utcnow()

    audit = AuditLog(
        user_id=request.current_user.id,
        action='PAYMENT_VERIFIED',
        target_type='transaction',
        target_id=txn.reference,
        details={'verifiedBy': request.current_user.email}
    )
    db.session.add(audit)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': f"Transaction {txn.reference} confirmed.",
        'data': txn.to_dict()
    }), 200

@admin_transactions_bp.route('/<int:id>/reverse', methods=['POST'])
@roles_required('master_admin', 'treasurer')
def reverse_transaction(id):
    txn = db.get_or_404(Transaction, id)
    data = request.get_json() or {}
    reason = data.get('reason', '').strip()
    if not reason:
        return jsonify({'success': False, 'message': 'A clear reversal reason is mandatory.'}), 400

    try:
        rev_txn = FinancialService.reverse_transaction(
            transaction_id=id,
            reversed_by_user_id=request.current_user.id,
            reversal_reason=reason
        )
        return jsonify({
            'success': True,
            'message': f"Transaction reversed successfully. Reversal Ref: {rev_txn.reference}",
            'data': rev_txn.to_dict()
        }), 200
    except ValueError as ve:
        return jsonify({'success': False, 'message': str(ve)}), 400
    except Exception as e:
        return jsonify({'success': False, 'message': 'Error reversing transaction.'}), 500
