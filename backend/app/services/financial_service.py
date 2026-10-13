import uuid
from datetime import datetime, timezone
from backend.app.models import db, Transaction, Member, AuditLog, Loan, Investment

AJO_DEDUCTION_KOBO = 5000  # ₦50.00 = 5,000 kobo statutory cooperative admin deduction

def now_utc():
    return datetime.now(timezone.utc)

def naira_to_kobo(amount_naira: float) -> int:
    return int(round(float(amount_naira) * 100))

def kobo_to_naira(amount_kobo: int) -> float:
    return amount_kobo / 100.0

def generate_reference(prefix: str = 'TXN') -> str:
    now_str = now_utc().strftime('%Y%m%d%H%M%S')
    suffix = uuid.uuid4().hex[:6].upper()
    return f"{prefix}-{now_str}-{suffix}"

class FinancialService:

    @staticmethod
    def record_payment(
        member_id: int,
        category: str, # 'savings', 'shares', 'investments', 'loans', 'ajo', 'fees'
        txn_type: str, # 'deposit', 'withdrawal', 'repayment', 'share_purchase', 'investment_contribution'
        gross_amount_kobo: int,
        payment_method: str, # 'cash', 'bank_transfer', 'internal_journal'
        description: str,
        recorded_by_user_id: int,
        bank_reference: str = None,
        is_verified: bool = True,
        loan_id: int = None
    ) -> Transaction:
        if gross_amount_kobo <= 0:
            raise ValueError("Transaction amount must be greater than zero.")

        if not description or not description.strip():
            raise ValueError("A manually specified transaction description is required.")

        member = db.session.get(Member, member_id)
        if not member:
            raise ValueError(f"Member with ID {member_id} not found.")

        # Check for duplicate bank reference if provided
        if bank_reference and bank_reference.strip():
            existing = Transaction.query.filter_by(bank_reference=bank_reference.strip()).first()
            if existing:
                raise ValueError(f"Transaction with bank reference '{bank_reference}' already recorded (Ref: {existing.reference}).")

        # Calculate deductions (Specifically transparent ₦50 on Ajo deposits)
        deduction_amount_kobo = 0
        deduction_reason = None
        net_amount_kobo = gross_amount_kobo

        if category == 'ajo' and txn_type == 'deposit':
            if gross_amount_kobo <= AJO_DEDUCTION_KOBO:
                raise ValueError(f"Ajo deposit must be greater than the statutory ₦50 (5,000 kobo) deduction.")
            deduction_amount_kobo = AJO_DEDUCTION_KOBO
            net_amount_kobo = gross_amount_kobo - deduction_amount_kobo
            deduction_reason = "₦50 statutory cooperative administrative deduction on Ajo deposit"

        status = 'confirmed' if is_verified else 'pending_verification'
        reference = generate_reference(prefix=f"MCS-{category[:3].upper()}")

        txn = Transaction(
            reference=reference,
            member_id=member.id,
            category=category,
            txn_type=txn_type,
            gross_amount_kobo=gross_amount_kobo,
            deduction_amount_kobo=deduction_amount_kobo,
            net_amount_kobo=net_amount_kobo,
            payment_method=payment_method,
            status=status,
            description=description.strip(),
            bank_reference=bank_reference.strip() if bank_reference else None,
            deduction_reason=deduction_reason,
            recorded_by_user_id=recorded_by_user_id,
            verified_by_user_id=recorded_by_user_id if is_verified else None,
            confirmed_at=now_utc() if is_verified else None
        )

        db.session.add(txn)

        # If this is a loan repayment, adjust loan outstanding balance
        if category == 'loans' and txn_type == 'repayment' and status == 'confirmed':
            loan = Loan.query.filter_by(member_id=member.id, status='active').first()
            if loan:
                loan.outstanding_kobo = max(0, loan.outstanding_kobo - net_amount_kobo)
                if loan.outstanding_kobo == 0:
                    loan.status = 'repaid'

        # Write audit trail
        audit = AuditLog(
            user_id=recorded_by_user_id,
            action='PAYMENT_RECORDED',
            target_type='transaction',
            target_id=reference,
            details={
                'memberId': member.member_id,
                'category': category,
                'txnType': txn_type,
                'grossKobo': gross_amount_kobo,
                'deductionKobo': deduction_amount_kobo,
                'netKobo': net_amount_kobo,
                'paymentMethod': payment_method,
                'status': status,
                'description': description.strip()
            }
        )
        db.session.add(audit)
        db.session.commit()
        return txn

    @staticmethod
    def reverse_transaction(
        transaction_id: int,
        reversed_by_user_id: int,
        reversal_reason: str
    ) -> Transaction:
        if not reversal_reason or not reversal_reason.strip():
            raise ValueError("A clear, documented reversal reason is required.")

        orig = db.session.get(Transaction, transaction_id)
        if not orig:
            raise ValueError("Original transaction not found.")

        if orig.status == 'reversed':
            raise ValueError("This transaction has already been reversed.")

        orig.status = 'reversed'
        orig.reversed_at = now_utc()
        orig.reversal_reason = reversal_reason.strip()

        # Create offsetting reversal transaction linked to parent
        rev_ref = generate_reference(prefix='REV')
        reversal_txn = Transaction(
            reference=rev_ref,
            member_id=orig.member_id,
            category=orig.category,
            txn_type='reversal',
            gross_amount_kobo=-orig.gross_amount_kobo,
            deduction_amount_kobo=-orig.deduction_amount_kobo,
            net_amount_kobo=-orig.net_amount_kobo,
            payment_method='internal_journal',
            status='confirmed',
            description=f"Reversal of {orig.reference}: {reversal_reason.strip()}",
            parent_transaction_id=orig.id,
            reversal_reason=reversal_reason.strip(),
            recorded_by_user_id=reversed_by_user_id,
            verified_by_user_id=reversed_by_user_id,
            confirmed_at=now_utc()
        )
        db.session.add(reversal_txn)

        # Audit
        audit = AuditLog(
            user_id=reversed_by_user_id,
            action='TRANSACTION_REVERSED',
            target_type='transaction',
            target_id=orig.reference,
            details={
                'originalRef': orig.reference,
                'reversalRef': rev_ref,
                'reason': reversal_reason.strip(),
                'netAmountKoboReversed': orig.net_amount_kobo
            }
        )
        db.session.add(audit)
        db.session.commit()
        return reversal_txn

    @staticmethod
    def calculate_member_financials(member_id: int) -> dict:
        member = db.session.get(Member, member_id)
        if not member:
            return {}

        # Confirmed transactions for this member
        txns = Transaction.query.filter_by(member_id=member.id, status='confirmed').all()

        savings_kobo = 0
        shares_kobo = 0
        investments_kobo = 0
        ajo_gross_kobo = 0
        ajo_deductions_kobo = 0
        ajo_net_kobo = 0

        for t in txns:
            if t.category == 'savings':
                if t.txn_type in ('deposit', 'interest'):
                    savings_kobo += t.net_amount_kobo
                elif t.txn_type in ('withdrawal',):
                    savings_kobo -= t.net_amount_kobo
                elif t.txn_type == 'reversal':
                    savings_kobo += t.net_amount_kobo # already signed
            elif t.category == 'shares':
                if t.txn_type in ('share_purchase', 'deposit'):
                    shares_kobo += t.net_amount_kobo
                elif t.txn_type == 'reversal':
                    shares_kobo += t.net_amount_kobo
            elif t.category == 'investments':
                if t.txn_type in ('investment_contribution', 'deposit'):
                    investments_kobo += t.net_amount_kobo
                elif t.txn_type == 'reversal':
                    investments_kobo += t.net_amount_kobo
            elif t.category == 'ajo':
                if t.txn_type == 'deposit':
                    ajo_gross_kobo += t.gross_amount_kobo
                    ajo_deductions_kobo += t.deduction_amount_kobo
                    ajo_net_kobo += t.net_amount_kobo
                elif t.txn_type == 'reversal':
                    ajo_gross_kobo += t.gross_amount_kobo
                    ajo_deductions_kobo += t.deduction_amount_kobo
                    ajo_net_kobo += t.net_amount_kobo

        # Active loans
        active_loans = Loan.query.filter_by(member_id=member.id, status='active').all()
        total_loan_outstanding_kobo = sum(l.outstanding_kobo for l in active_loans)
        total_loan_principal_kobo = sum(l.principal_kobo for l in active_loans)

        return {
            'savingsBalanceKobo': max(0, savings_kobo),
            'savingsBalanceNaira': max(0, savings_kobo) / 100.0,
            
            'shareCapitalKobo': max(0, shares_kobo),
            'shareCapitalNaira': max(0, shares_kobo) / 100.0,
            
            'investmentsTotalKobo': max(0, investments_kobo),
            'investmentsTotalNaira': max(0, investments_kobo) / 100.0,
            
            'ajoGrossKobo': max(0, ajo_gross_kobo),
            'ajoGrossNaira': max(0, ajo_gross_kobo) / 100.0,
            'ajoDeductionsKobo': max(0, ajo_deductions_kobo),
            'ajoDeductionsNaira': max(0, ajo_deductions_kobo) / 100.0,
            'ajoNetCreditedKobo': max(0, ajo_net_kobo),
            'ajoNetCreditedNaira': max(0, ajo_net_kobo) / 100.0,
            
            'loanPrincipalKobo': total_loan_principal_kobo,
            'loanPrincipalNaira': total_loan_principal_kobo / 100.0,
            'loanOutstandingKobo': total_loan_outstanding_kobo,
            'loanOutstandingNaira': total_loan_outstanding_kobo / 100.0,
            'activeLoanCount': len(active_loans),
            
            'statutoryDeductionPerDepositNaira': AJO_DEDUCTION_KOBO / 100.0
        }
