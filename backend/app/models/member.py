from datetime import datetime
import json
from . import db

class Member(db.Model):
    __tablename__ = 'members'

    id = db.Column(db.Integer, primary_key=True)
    member_id = db.Column(db.String(50), unique=True, nullable=False, index=True) # e.g. 'MCS-2026-1033'
    full_name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(120), nullable=True, index=True)
    phone = db.Column(db.String(50), nullable=True)
    branch = db.Column(db.String(100), default='Victoria Island Regional Office')
    status = db.Column(db.String(20), default='active', nullable=False) # 'active', 'pending', 'suspended'
    nin = db.Column(db.String(20), nullable=True)
    address = db.Column(db.Text, nullable=True)
    occupation = db.Column(db.String(100), nullable=True)
    next_of_kin_json = db.Column(db.Text, nullable=True) # JSON string {name, relationship, phone, address}
    bank_name = db.Column(db.String(100), nullable=True)
    account_number = db.Column(db.String(50), nullable=True)
    account_name = db.Column(db.String(150), nullable=True)
    kyc_verified = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user = db.relationship('User', back_populates='member', uselist=False)
    transactions = db.relationship('Transaction', back_populates='member', cascade='all, delete-orphan', order_by='Transaction.created_at.desc()')
    loans = db.relationship('Loan', back_populates='member', cascade='all, delete-orphan')
    investments = db.relationship('Investment', back_populates='member', cascade='all, delete-orphan')
    claim_tokens = db.relationship('ClaimToken', back_populates='member', cascade='all, delete-orphan')

    @property
    def next_of_kin(self):
        if not self.next_of_kin_json:
            return None
        try:
            return json.loads(self.next_of_kin_json)
        except Exception:
            return None

    @next_of_kin.setter
    def next_of_kin(self, data):
        if data:
            self.next_of_kin_json = json.dumps(data)
        else:
            self.next_of_kin_json = None

    def to_dict(self, include_financials=False):
        data = {
            'id': self.id,
            'memberId': self.member_id,
            'fullName': self.full_name,
            'email': self.email,
            'phone': self.phone,
            'branch': self.branch,
            'status': self.status,
            'nin': self.nin,
            'address': self.address,
            'occupation': self.occupation,
            'kycVerified': self.kyc_verified,
            'nextOfKin': self.next_of_kin,
            'bankDetails': {
                'bankName': self.bank_name,
                'accountNumber': self.account_number,
                'accountName': self.account_name
            } if self.account_number else None,
            'hasClaimedAccount': bool(self.user and self.user.is_active),
            'createdAt': self.created_at.isoformat()
        }
        return data
