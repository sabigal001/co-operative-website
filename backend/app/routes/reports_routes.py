from datetime import datetime, date
from flask import Blueprint, request, jsonify
from backend.app.models import db, Transaction, Member, Loan, Investment, AuditLog
from backend.app.services.jwt_auth import roles_required

reports_bp = Blueprint('reports', __name__, url_prefix='/api/admin/reports')

@reports_bp.route('/summary', methods=['GET'])
@roles_required('master_admin', 'treasurer', 'secretary')
def get_summary_metrics():
    total_members = Member.query.count()
    active_loans = Loan.query.filter_by(status='active').all()
    total_loan_outstanding_kobo = sum(l.outstanding_kobo for l in active_loans)

    confirmed_txns = Transaction.query.filter_by(status='confirmed').all()
    savings_kobo = sum(t.net_amount_kobo for t in confirmed_txns if t.category == 'savings')
    share_capital_kobo = sum(t.net_amount_kobo for t in confirmed_txns if t.category == 'shares')
    ajo_net_kobo = sum(t.net_amount_kobo for t in confirmed_txns if t.category == 'ajo')
    ajo_deductions_kobo = sum(t.deduction_amount_kobo for t in confirmed_txns if t.category == 'ajo')

    # Today's collection
    today_start = datetime.combine(date.today(), datetime.min.time())
    today_txns = [t for t in confirmed_txns if t.created_at and t.created_at >= today_start]
    today_cash_kobo = sum(t.gross_amount_kobo for t in today_txns if t.payment_method == 'cash')
    today_bank_kobo = sum(t.gross_amount_kobo for t in today_txns if t.payment_method == 'bank_transfer')

    return jsonify({
        'success': True,
        'data': {
            'totalMembers': total_members,
            'totalSavingsNaira': max(0, savings_kobo) / 100.0,
            'totalShareCapitalNaira': max(0, share_capital_kobo) / 100.0,
            'totalAjoNetNaira': max(0, ajo_net_kobo) / 100.0,
            'totalAjoDeductionsNaira': max(0, ajo_deductions_kobo) / 100.0,
            'totalLoanOutstandingNaira': total_loan_outstanding_kobo / 100.0,
            'activeLoanCount': len(active_loans),
            'todayCashCollectionNaira': today_cash_kobo / 100.0,
            'todayBankCollectionNaira': today_bank_kobo / 100.0,
            'todayTotalCollectionNaira': (today_cash_kobo + today_bank_kobo) / 100.0
        }
    }), 200

@reports_bp.route('/daily-cashbook', methods=['GET'])
@roles_required('master_admin', 'treasurer')
def get_daily_cashbook():
    date_str = request.args.get('date', datetime.utcnow().strftime('%Y-%m-%d'))
    try:
        target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        target_date = datetime.utcnow().date()

    start_dt = datetime.combine(target_date, datetime.min.time())
    end_dt = datetime.combine(target_date, datetime.max.time())

    txns = Transaction.query.filter(
        Transaction.created_at >= start_dt,
        Transaction.created_at <= end_dt
    ).order_by(Transaction.created_at.desc()).all()

    cash_entries = [t.to_dict() for t in txns if t.payment_method == 'cash']
    bank_entries = [t.to_dict() for t in txns if t.payment_method == 'bank_transfer']

    total_cash_kobo = sum(t.gross_amount_kobo for t in txns if t.payment_method == 'cash' and t.status == 'confirmed')
    total_bank_kobo = sum(t.gross_amount_kobo for t in txns if t.payment_method == 'bank_transfer' and t.status == 'confirmed')

    return jsonify({
        'success': True,
        'data': {
            'date': date_str,
            'cashTotalNaira': total_cash_kobo / 100.0,
            'bankTotalNaira': total_bank_kobo / 100.0,
            'totalDayNaira': (total_cash_kobo + total_bank_kobo) / 100.0,
            'cashEntries': cash_entries,
            'bankEntries': bank_entries
        }
    }), 200

@reports_bp.route('/audit-logs', methods=['GET'])
@roles_required('master_admin')
def get_audit_logs():
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 50))

    pagination = AuditLog.query.order_by(AuditLog.timestamp.desc()).paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        'success': True,
        'data': {
            'logs': [l.to_dict() for l in pagination.items],
            'total': pagination.total,
            'page': pagination.page,
            'pages': pagination.pages
        }
    }), 200
