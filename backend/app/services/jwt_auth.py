import os
from functools import wraps
from datetime import datetime, timezone, timedelta
import jwt
from flask import request, jsonify, current_app
from backend.app.models import db
from backend.app.models.user import User

def generate_token(user: User) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        'sub': str(user.id),
        'email': user.email,
        'role': user.role,
        'fullName': user.full_name,
        'memberId': user.member.member_id if user.member else None,
        'iat': now,
        'exp': now + timedelta(hours=current_app.config.get('JWT_EXPIRY_HOURS', 24))
    }
    secret = current_app.config.get('JWT_SECRET_KEY')
    return jwt.encode(payload, secret, algorithm='HS256')

def decode_token(token: str) -> dict:
    secret = current_app.config.get('JWT_SECRET_KEY')
    return jwt.decode(token, secret, algorithms=['HS256'])

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        token = None
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ', 1)[1].strip()
        
        if not token:
            token = request.cookies.get('mosunmola_token')

        if not token:
            return jsonify({'success': False, 'message': 'Authentication required. Missing Bearer token.'}), 401

        try:
            payload = decode_token(token)
            sub = payload.get('sub')
            user_id = int(sub) if sub is not None else None
            user = db.session.get(User, user_id) if user_id else None
            if not user or not user.is_active:
                return jsonify({'success': False, 'message': 'User account inactive or not found.'}), 401
            
            # Pass user in request context
            request.current_user = user
        except jwt.ExpiredSignatureError:
            return jsonify({'success': False, 'message': 'Session expired. Please log in again.'}), 401
        except Exception as e:
            return jsonify({'success': False, 'message': f'Invalid authentication token: {str(e)}'}), 401

        return f(*args, **kwargs)
    return decorated

def roles_required(*allowed_roles):
    def decorator(f):
        @wraps(f)
        @token_required
        def decorated(*args, **kwargs):
            user = getattr(request, 'current_user', None)
            if not user:
                return jsonify({'success': False, 'message': 'Authentication required.'}), 401

            # Master admin always has super-administrative oversight
            if user.role not in allowed_roles and user.role != 'master_admin':
                return jsonify({
                    'success': False,
                    'message': f'Access denied. Required role: {", ".join(allowed_roles)}. Your role: {user.role}'
                }), 403

            return f(*args, **kwargs)
        return decorated
    return decorator
