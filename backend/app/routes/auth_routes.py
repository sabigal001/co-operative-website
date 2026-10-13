from flask import Blueprint, request, jsonify
from backend.app.services.auth_service import AuthService
from backend.app.services.jwt_auth import token_required, roles_required

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/bootstrap', methods=['POST'])
def bootstrap():
    data = request.get_json() or {}
    email = data.get('email', '')
    password = data.get('password', '')
    full_name = data.get('fullName', '')
    bootstrap_secret = data.get('bootstrapSecret', '')

    try:
        user = AuthService.bootstrap_master_admin(email, password, full_name, bootstrap_secret)
        return jsonify({
            'success': True,
            'message': 'Master Admin account initialized successfully. Initial setup is now closed.',
            'data': user.to_dict()
        }), 201
    except PermissionError as pe:
        return jsonify({'success': False, 'message': str(pe)}), 403
    except ValueError as ve:
        return jsonify({'success': False, 'message': str(ve)}), 400
    except Exception as e:
        return jsonify({'success': False, 'message': 'Bootstrap error occurred.'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    identifier = data.get('email') or data.get('memberId') or data.get('username') or ''
    password = data.get('password', '')

    if not identifier or not password:
        return jsonify({'success': False, 'message': 'Email/Member ID and password are required.'}), 400

    try:
        user, token = AuthService.authenticate_user(identifier, password)
        return jsonify({
            'success': True,
            'message': 'Login successful.',
            'data': {
                'token': token,
                'user': user.to_dict(),
                'member': user.member.to_dict(include_financials=True) if user.member else None
            }
        }), 200
    except PermissionError as pe:
        return jsonify({'success': False, 'message': str(pe)}), 403
    except ValueError as ve:
        return jsonify({'success': False, 'message': str(ve)}), 401
    except Exception as e:
        return jsonify({'success': False, 'message': 'Authentication failed.'}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    return jsonify({
        'success': True,
        'message': 'Successfully signed out of Mosunmola Cooperative session.'
    }), 200

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user():
    user = request.current_user
    return jsonify({
        'success': True,
        'data': {
            'user': user.to_dict(),
            'member': user.member.to_dict(include_financials=True) if user.member else None
        }
    }), 200

@auth_bp.route('/staff/provision', methods=['POST'])
@roles_required('master_admin')
def provision_staff():
    data = request.get_json() or {}
    email = data.get('email', '')
    full_name = data.get('fullName', '')
    role = data.get('role', '')
    initial_password = data.get('initialPassword', '')

    if not email or not role or not initial_password:
        return jsonify({'success': False, 'message': 'Email, role, and initial password are required.'}), 400

    try:
        user = AuthService.provision_staff_user(request.current_user, email, full_name, role, initial_password)
        return jsonify({
            'success': True,
            'message': f"Staff user '{email}' provisioned with role '{user.role}'.",
            'data': user.to_dict()
        }), 201
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 400

@auth_bp.route('/member/generate-claim-code', methods=['POST'])
@roles_required('master_admin', 'secretary', 'treasurer')
def generate_claim_code():
    data = request.get_json() or {}
    member_id = data.get('memberId', '')

    if not member_id:
        return jsonify({'success': False, 'message': 'memberId is required.'}), 400

    try:
        code = AuthService.generate_member_claim_code(request.current_user, member_id)
        return jsonify({
            'success': True,
            'message': f"Single-use claim code generated for {member_id}.",
            'data': {'claimCode': code, 'memberId': member_id, 'expiresInHours': 72}
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 400

@auth_bp.route('/member/claim', methods=['POST'])
def claim_account():
    data = request.get_json() or {}
    member_id = data.get('memberId', '')
    registered_name = data.get('registeredName', '')
    claim_code = data.get('claimCode', '')
    password = data.get('password', '')
    email = data.get('email')

    if not member_id or not registered_name or not claim_code or not password:
        return jsonify({'success': False, 'message': 'Membership ID, Registered Name, Claim Code, and Password are all required.'}), 400

    try:
        user = AuthService.claim_member_account(member_id, registered_name, claim_code, password, email)
        from backend.app.services.jwt_auth import generate_token
        token = generate_token(user)
        return jsonify({
            'success': True,
            'message': 'Account claimed and activated successfully. You can now access your member portal.',
            'data': {
                'token': token,
                'user': user.to_dict()
            }
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 400

@auth_bp.route('/change-password', methods=['POST'])
@token_required
def change_password():
    data = request.get_json() or {}
    old_password = data.get('oldPassword', '')
    new_password = data.get('newPassword', '')

    if not new_password or len(new_password) < 6:
        return jsonify({'success': False, 'message': 'New password must be at least 6 characters.'}), 400

    user = request.current_user
    # If old password is provided, verify it (unless admin resetting own)
    if old_password and not user.check_password(old_password):
        return jsonify({'success': False, 'message': 'Current password is incorrect.'}), 400

    from backend.app.models import db
    user.set_password(new_password)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Password updated successfully.'
    }), 200
