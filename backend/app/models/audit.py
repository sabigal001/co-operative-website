from datetime import datetime
import json
from . import db

class AuditLog(db.Model):
    __tablename__ = 'audit_logs'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True, index=True)
    action = db.Column(db.String(100), nullable=False, index=True)
    target_type = db.Column(db.String(50), nullable=True) # 'member', 'transaction', 'loan', 'user'
    target_id = db.Column(db.String(100), nullable=True)
    details_json = db.Column(db.Text, nullable=True)
    ip_address = db.Column(db.String(60), nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)

    user = db.relationship('User', foreign_keys=[user_id])

    @property
    def details(self):
        if not self.details_json:
            return {}
        try:
            return json.loads(self.details_json)
        except Exception:
            return {'raw': self.details_json}

    @details.setter
    def details(self, data):
        if data:
            self.details_json = json.dumps(data)
        else:
            self.details_json = None

    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'actorName': self.user.full_name if self.user else 'System',
            'actorRole': self.user.role if self.user else 'system',
            'action': self.action,
            'targetType': self.target_type,
            'targetId': self.target_id,
            'details': self.details,
            'ipAddress': self.ip_address,
            'timestamp': self.timestamp.isoformat()
        }
