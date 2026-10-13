from datetime import datetime
from . import db

class Transaction(db.Model):
    __tablename__ = 'transactions'

    id = db.Column(db.Integer, primary_key=True)
    reference = db.Column(db.String(64), unique=True, nullable=False, index=True)
    member_id = db.Column(db.Integer, db.ForeignKey('members.id'), nullable=False, index=True)
    
    # Financial category & transaction type
    category = db.Column(db.String(40), nullable=False) # 'savings', 'shares', 'investments', 'loans', 'ajo', 'fees'
    txn_type = db.Column(db.String(40), nullable=False) # 'deposit', 'withdrawal', 'repayment', 'deduction', 'share_purchase', 'investment_contribution', 'reversal', 'correction'
    
    # Exact Integer Minor Units (Kobo: ₦1.00 = 100 kobo)
    gross_amount_kobo = db.Column(db.BigInteger, nullable=False)
    deduction_amount_kobo = db.Column(db.BigInteger, default=0, nullable=False)
    net_amount_kobo = db.Column(db.BigInteger, nullable=False)
    
    # Payment method and settlement status
    payment_method = db.Column(db.String(30), nullable=False) # 'cash', 'bank_transfer', 'internal_journal'
    status = db.Column(db.String(30), nullable=False, default='confirmed') # 'confirmed', 'pending_verification', 'reversed'
    
    # Manually editable transaction description (staff-authored, free text)
    description = db.Column(db.Text, nullable=False)
    
    bank_reference = db.Column(db.String(100), nullable=True)
    deduction_reason = db.Column(db.String(255), nullable=True) # e.g. "₦50 statutory cooperative administrative deduction on Ajo deposit"
    
    # Staff audit trail
    recorded_by_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    verified_by_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    
    # Reversal / correction link
    parent_transaction_id = db.Column(db.Integer, db.ForeignKey('transactions.id'), nullable=True)
    reversal_reason = db.Column(db.Text, nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    confirmed_at = db.Column(db.DateTime, nullable=True)
    reversed_at = db.Column(db.DateTime, nullable=True)

    # Relationships
    member = db.relationship('Member', back_populates='transactions')
    recorder = db.relationship('User', foreign_keys=[recorded_by_user_id])
    verifier = db.relationship('User', foreign_keys=[verified_by_user_id])
    parent = db.relationship('Transaction', remote_side=[id], backref='children')

    def to_dict(self):
        return {
            'id': self.id,
            'reference': self.reference,
            'memberId': self.member.member_id if self.member else None,
            'memberName': self.member.full_name if self.member else None,
            'category': self.category,
            'txnType': self.txn_type,
            'grossAmountKobo': self.gross_amount_kobo,
            'grossAmountNaira': self.gross_amount_kobo / 100.0,
            'deductionAmountKobo': self.deduction_amount_kobo,
            'deductionAmountNaira': self.deduction_amount_kobo / 100.0,
            'netAmountKobo': self.net_amount_kobo,
            'netAmountNaira': self.net_amount_kobo / 100.0,
            'deductionReason': self.deduction_reason,
            'paymentMethod': self.payment_method,
            'status': self.status,
            'description': self.description,
            'bankReference': self.bank_reference,
            'recordedBy': self.recorder.full_name if self.recorder else None,
            'verifiedBy': self.verifier.full_name if self.verifier else None,
            'parentTransactionId': self.parent_transaction_id,
            'reversalReason': self.reversal_reason,
            'createdAt': self.created_at.isoformat(),
            'confirmedAt': self.confirmed_at.isoformat() if self.confirmed_at else None,
            'reversedAt': self.reversed_at.isoformat() if self.reversed_at else None,
        }
