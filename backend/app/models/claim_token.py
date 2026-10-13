from datetime import datetime, timedelta
import secrets
from . import db

class ClaimToken(db.Model):
    __tablename__ = 'claim_tokens'

    id = db.Column(db.Integer, primary_key=True)
    member_id = db.Column(db.Integer, db.ForeignKey('members.id'), nullable=False, index=True)
    token_code = db.Column(db.String(32), unique=True, nullable=False, index=True)
    expires_at = db.Column(db.DateTime, nullable=False)
    is_used = db.Column(db.Boolean, default=False, nullable=False)
    used_at = db.Column(db.DateTime, nullable=True)
    created_by_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    member = db.relationship('Member', back_populates='claim_tokens')

    @classmethod
    def generate(cls, member_id: int, created_by_user_id: int = None, hours_valid: int = 72):
        # Generate 8-character uppercase alphanumeric code e.g. "MCS-7K8P"
        code = f"CLAIM-{secrets.token_hex(4).upper()}"
        expires = datetime.utcnow() + timedelta(hours=hours_valid)
        token = cls(
            member_id=member_id,
            token_code=code,
            expires_at=expires,
            created_by_user_id=created_by_user_id
        )
        return token

    def is_valid(self) -> bool:
        return not self.is_used and datetime.utcnow() < self.expires_at
