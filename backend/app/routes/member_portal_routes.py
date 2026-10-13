from flask import Blueprint, request, jsonify
from backend.app.models import Member, Transaction, Loan, Investment
from backend.app.services.jwt_auth import token_required
from backend.app.services.financial_service import FinancialService

member_portal_bp = Blueprint('member_portal', __name__, url_prefix='/api/member')

def get_authorized_member():
    user = request.current_user
    if user.role != 'member' or not user.member:
        # Check if staff viewing their own test or member
        if user.member:
            return user.member
        return None
    return user.member

@member_portal_bp.route('/profile', methods=['GET'])
@token_required
def get_profile():
    member = get_authorized_member()
    if not member:
        return jsonify({'success': False, 'message': 'No member profile associated with this account.'}), 404

    return jsonify({
        'success': True,
        'data': member.to_dict(include_financials=True)
    }), 200

@member_portal_bp.route('/financial-summary', methods=['GET'])
@token_required
def get_financial_summary():
    member = get_authorized_member()
    if not member:
        return jsonify({'success': False, 'message': 'No member profile associated with this account.'}), 404

    summary = FinancialService.calculate_member_financials(member.id)
    return jsonify({
        'success': True,
        'data': summary
    }), 200

@member_portal_bp.route('/transactions', methods=['GET'])
@token_required
def get_transactions():
    member = get_authorized_member()
    if not member:
        return jsonify({'success': False, 'message': 'No member profile associated with this account.'}), 404

    txns = Transaction.query.filter_by(member_id=member.id).order_by(Transaction.created_at.desc()).all()
    return jsonify({
        'success': True,
        'data': [t.to_dict() for t in txns]
    }), 200

@member_portal_bp.route('/loans', methods=['GET'])
@token_required
def get_loans():
    member = get_authorized_member()
    if not member:
        return jsonify({'success': False, 'message': 'No member profile associated with this account.'}), 404

    loans = Loan.query.filter_by(member_id=member.id).order_by(Loan.created_at.desc()).all()
    return jsonify({
        'success': True,
        'data': [l.to_dict() for l in loans]
    }), 200

@member_portal_bp.route('/investments', methods=['GET'])
@token_required
def get_investments():
    member = get_authorized_member()
    if not member:
        return jsonify({'success': False, 'message': 'No member profile associated with this account.'}), 404

    invs = Investment.query.filter_by(member_id=member.id).order_by(Investment.created_at.desc()).all()
    return jsonify({
        'success': True,
        'data': [i.to_dict() for i in invs]
    }), 200

# Strict block against any member payment initiation
@member_portal_bp.route('/deposit', methods=['POST'])
@member_portal_bp.route('/withdraw', methods=['POST'])
@member_portal_bp.route('/pay-loan', methods=['POST'])
def block_member_payments():
    return jsonify({
        'success': False,
        'message': 'Financial transaction initiation is not permitted from the member portal. All payments and deductions are recorded exclusively through authorised cooperative staff.'
    }), 403
