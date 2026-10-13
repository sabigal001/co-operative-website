from datetime import datetime
from . import db

class Loan(db.Model):
    __tablename__ = 'loans'

    id = db.Column(db.Integer, primary_key=True)
    loan_reference = db.Column(db.String(50), unique=True, nullable=False, index=True)
    member_id = db.Column(db.Integer, db.ForeignKey('members.id'), nullable=False, index=True)
    
    # Amounts in integer kobo
    principal_kobo = db.Column(db.BigInteger, nullable=False)
    outstanding_kobo = db.Column(db.BigInteger, nullable=False)
    interest_rate_pct = db.Column(db.Float, default=5.0, nullable=False)
    duration_months = db.Column(db.Integer, default=6, nullable=False)
    monthly_repayment_kobo = db.Column(db.BigInteger, nullable=False)
    
    purpose = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(30), default='active', nullable=False) # 'active', 'repaid', 'pending', 'defaulted'
    
    guarantors_json = db.Column(db.Text, nullable=True) # JSON list
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    disbursed_at = db.Column(db.DateTime, nullable=True)
    due_date = db.Column(db.DateTime, nullable=True)

    member = db.relationship('Member', back_populates='loans')

    def to_dict(self):
        return {
            'id': self.id,
            'loanReference': self.loan_reference,
            'memberId': self.member.member_id if self.member else None,
            'memberName': self.member.full_name if self.member else None,
            'principalKobo': self.principal_kobo,
            'principalNaira': self.principal_kobo / 100.0,
            'outstandingKobo': self.outstanding_kobo,
            'outstandingNaira': self.outstanding_kobo / 100.0,
            'interestRatePct': self.interest_rate_pct,
            'durationMonths': self.duration_months,
            'monthlyRepaymentKobo': self.monthly_repayment_kobo,
            'monthlyRepaymentNaira': self.monthly_repayment_kobo / 100.0,
            'purpose': self.purpose,
            'status': self.status,
            'createdAt': self.created_at.isoformat(),
            'dueDate': self.due_date.isoformat() if self.due_date else None,
        }
