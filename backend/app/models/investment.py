from datetime import datetime
from . import db

class Investment(db.Model):
    __tablename__ = 'investments'

    id = db.Column(db.Integer, primary_key=True)
    member_id = db.Column(db.Integer, db.ForeignKey('members.id'), nullable=False, index=True)
    
    category = db.Column(db.String(40), nullable=False) # 'share_capital', 'agro_asset', 'real_estate'
    title = db.Column(db.String(150), nullable=False)
    units = db.Column(db.Integer, default=1, nullable=False)
    
    # Financial units in integer kobo
    unit_price_kobo = db.Column(db.BigInteger, nullable=False)
    total_amount_kobo = db.Column(db.BigInteger, nullable=False)
    current_value_kobo = db.Column(db.BigInteger, nullable=False)
    
    annual_yield_pct = db.Column(db.Float, default=15.0, nullable=False)
    status = db.Column(db.String(20), default='active', nullable=False)
    certificate_number = db.Column(db.String(60), unique=True, nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    member = db.relationship('Member', back_populates='investments')

    def to_dict(self):
        return {
            'id': self.id,
            'memberId': self.member.member_id if self.member else None,
            'category': self.category,
            'title': self.title,
            'units': self.units,
            'unitPriceNaira': self.unit_price_kobo / 100.0,
            'totalAmountNaira': self.total_amount_kobo / 100.0,
            'currentValueNaira': self.current_value_kobo / 100.0,
            'annualYieldPct': self.annual_yield_pct,
            'status': self.status,
            'certificateNumber': self.certificate_number,
            'createdAt': self.created_at.isoformat(),
        }
