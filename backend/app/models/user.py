from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from . import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(30), nullable=False) # 'master_admin', 'treasurer', 'secretary', 'member'
    full_name = db.Column(db.String(150), nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    last_login = db.Column(db.DateTime, nullable=True)
    
    # Linked member for member portal users
    member_id = db.Column(db.Integer, db.ForeignKey('members.id'), nullable=True)
    member = db.relationship('Member', back_populates='user', foreign_keys=[member_id])

    def set_password(self, password: str):
        if not password or len(password) < 6:
            raise ValueError("Password must be at least 6 characters.")
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        if not self.password_hash:
            return False
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'role': self.role,
            'fullName': self.full_name,
            'isActive': self.is_active,
            'lastLogin': self.last_login.isoformat() if self.last_login else None,
            'memberId': self.member.member_id if self.member else None,
            'internalMemberPk': self.member_id
        }
