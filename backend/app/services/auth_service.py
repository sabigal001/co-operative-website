import re
import secrets
from datetime import datetime
from flask import current_app
from sqlalchemy import func
from backend.app.models import db, User, Member, ClaimToken, AuditLog
from backend.app.services.jwt_auth import generate_token

def _normalize_phone_digits(val: str) -> str:
    if not val:
        return ""
    digits = re.sub(r'\D', '', val)
    if digits.startswith('234') and len(digits) > 10:
        digits = '0' + digits[3:]
    return digits

def _phones_match(entered: str, stored: str) -> bool:
    if not entered or not stored:
        return False
    if entered.strip().lower() == stored.strip().lower():
        return True
    d1 = _normalize_phone_digits(entered)
    d2 = _normalize_phone_digits(stored)
    if d1 and d2:
        if d1 == d2:
            return True
        if len(d1) >= 10 and len(d2) >= 10 and d1[-10:] == d2[-10:]:
            return True
    return False

class AuthService:

    @staticmethod
    def bootstrap_master_admin(email: str, password: str, full_name: str, bootstrap_secret: str) -> User:
        """
        One-time bootstrap process for the designated Master Admin.
        Can only be executed once, using the configured BOOTSTRAP_SECRET and MASTER_ADMIN_EMAIL.
        """
        configured_secret = current_app.config.get('BOOTSTRAP_SECRET')
        configured_email = current_app.config.get('MASTER_ADMIN_EMAIL')

        if not bootstrap_secret or bootstrap_secret != configured_secret:
            raise PermissionError("Invalid bootstrap authorization secret.")

        clean_email = email.strip().lower()
        if clean_email != configured_email:
            raise ValueError(f"Email '{clean_email}' does not match the designated Master Admin email '{configured_email}'.")

        # Check if master admin already exists
        existing_master = User.query.filter_by(role='master_admin').first()
        if existing_master:
            raise PermissionError("Master Admin account has already been bootstrapped. Setup is disabled.")

        user = User(
            email=clean_email,
            full_name=full_name.strip(),
            role='master_admin',
            is_active=True
        )
        user.set_password(password)
        db.session.add(user)

        audit = AuditLog(
            action='MASTER_ADMIN_BOOTSTRAPPED',
            target_type='user',
            target_id=clean_email,
            details={'email': clean_email, 'role': 'master_admin'}
        )
        db.session.add(audit)
        db.session.commit()
        return user

    @staticmethod
    def provision_staff_user(actor_user: User, email: str, full_name: str, role: str, initial_password: str) -> User:
        """
        Master Admin provisions Treasurer or Secretary.
        Enforces allowlist: Treasurer must match TREASURER_EMAIL, Secretary must match SECRETARY_EMAIL.
        """
        if actor_user.role != 'master_admin':
            raise PermissionError("Only the Master Administrator can provision staff accounts.")

        clean_email = email.strip().lower()
        clean_role = role.strip().lower()

        treasurer_email = current_app.config.get('TREASURER_EMAIL')
        secretary_email = current_app.config.get('SECRETARY_EMAIL')

        if clean_role == 'treasurer':
            if clean_email != treasurer_email:
                raise ValueError(f"Email '{clean_email}' does not match the designated Treasurer email ({treasurer_email}).")
        elif clean_role in ('secretary', 'pa_officer'):
            clean_role = 'secretary'
            if clean_email != secretary_email:
                raise ValueError(f"Email '{clean_email}' does not match the designated Secretary email ({secretary_email}).")
        else:
            raise ValueError("Invalid staff role. Permitted roles: 'treasurer', 'secretary'.")

        existing = User.query.filter_by(email=clean_email).first()
        if existing:
            # Update password and activate if existing
            existing.full_name = full_name.strip()
            existing.role = clean_role
            existing.set_password(initial_password)
            existing.is_active = True
            user = existing
        else:
            user = User(
                email=clean_email,
                full_name=full_name.strip(),
                role=clean_role,
                is_active=True
            )
            user.set_password(initial_password)
            db.session.add(user)

        audit = AuditLog(
            user_id=actor_user.id,
            action='STAFF_USER_PROVISIONED',
            target_type='user',
            target_id=clean_email,
            details={'role': clean_role, 'provisionedBy': actor_user.email}
        )
        db.session.add(audit)
        db.session.commit()
        return user

    @staticmethod
    def generate_member_claim_code(actor_user: User, member_id_str: str) -> str:
        """
        Staff generates a single-use claim code for a member to securely activate their online portal account.
        """
        member = Member.query.filter_by(member_id=member_id_str.strip()).first()
        if not member:
            raise ValueError(f"Member with ID '{member_id_str}' not found.")

        # Invalidate any previously un-used tokens
        for old in ClaimToken.query.filter_by(member_id=member.id, is_used=False).all():
            old.is_used = True

        token = ClaimToken.generate(member_id=member.id, created_by_user_id=actor_user.id, hours_valid=72)
        db.session.add(token)

        audit = AuditLog(
            user_id=actor_user.id,
            action='CLAIM_CODE_GENERATED',
            target_type='member',
            target_id=member.member_id,
            details={'code': token.token_code, 'member': member.full_name}
        )
        db.session.add(audit)
        db.session.commit()
        return token.token_code

    @staticmethod
    def claim_member_account(member_id_str: str, registered_name: str, claim_code: str, password: str, email: str = None) -> User:
        """
        Member claims their account:
        1. Verifies membership ID
        2. Verifies registered name (case-insensitive substring/normalized match)
        3. Verifies valid single-use claim code
        4. Verifies account not already claimed
        5. Sets password and creates user account linked to Member record
        """
        clean_id = member_id_str.strip()
        member = Member.query.filter_by(member_id=clean_id).first()
        if not member:
            raise ValueError("Invalid membership credentials or claim code.")

        # Name verification (fuzzy or normalized check)
        clean_input_name = " ".join(registered_name.lower().split())
        clean_reg_name = " ".join(member.full_name.lower().split())
        
        # Check matching names
        first_input_part = clean_input_name.split()[0] if clean_input_name else ""
        if clean_input_name not in clean_reg_name and first_input_part not in clean_reg_name:
            raise ValueError("The provided name does not match cooperative records for this membership ID.")

        # Check claim token
        token_obj = ClaimToken.query.filter_by(
            member_id=member.id,
            token_code=claim_code.strip().upper(),
            is_used=False
        ).first()

        if not token_obj or not token_obj.is_valid():
            raise ValueError("Invalid or expired claim code. Please request a new code from cooperative secretariat.")

        # Check if already has an active user account
        if member.user and member.user.is_active:
            raise ValueError("This membership account has already been claimed and activated. Please log in.")

        user_email = email.strip().lower() if email else member.email
        if not user_email:
            user_email = f"{clean_id.lower().replace('-', '')}@member.mosunmolacoop.ng"

        # Check if user with that email already exists
        existing_user = User.query.filter_by(email=user_email).first()
        if existing_user and existing_user.member_id != member.id:
            user_email = f"{clean_id.lower().replace('-', '')}.{secrets.token_hex(2)}@member.mosunmolacoop.ng"

        if member.user:
            user = member.user
            user.set_password(password)
            user.email = user_email
            user.is_active = True
        else:
            user = User(
                email=user_email,
                full_name=member.full_name,
                role='member',
                is_active=True,
                member_id=member.id
            )
            user.set_password(password)
            db.session.add(user)

        # Mark token as used
        token_obj.is_used = True
        token_obj.used_at = datetime.utcnow()

        # Update member email if provided
        if email:
            member.email = email.strip()

        audit = AuditLog(
            action='ACCOUNT_CLAIMED',
            target_type='member',
            target_id=member.member_id,
            details={'email': user_email, 'claimCode': claim_code.strip().upper()}
        )
        db.session.add(audit)
        db.session.commit()
        return user

    @staticmethod
    def authenticate_user(identifier: str, password: str) -> tuple[User, str]:
        """
        Authenticate user:
        1. For Members: Can log in using Member ID, Email, or Phone number,
           with either their registered phone number as password OR their set account password.
           If the member has not yet had a User record created, it is auto-provisioned seamlessly!
        2. For Staff: Email + account password.
        """
        clean_id = identifier.strip()
        clean_pw = password.strip()

        # 1. Attempt to find matching Member record
        member = Member.query.filter(func.lower(Member.member_id) == clean_id.lower()).first()

        # If not found directly, try without hyphens/spaces
        if not member:
            clean_no_hyphens = clean_id.replace('-', '').replace(' ', '')
            for m in Member.query.all():
                if m.member_id.replace('-', '').replace(' ', '').lower() == clean_no_hyphens.lower():
                    member = m
                    break

        # If not found and identifier contains '@', try member email
        if not member and '@' in clean_id:
            member = Member.query.filter(func.lower(Member.email) == clean_id.lower()).first()

        # If not found, check if identifier is a phone number
        if not member:
            id_digits = re.sub(r'\D', '', clean_id)
            if len(id_digits) >= 8:
                for m in Member.query.all():
                    if _phones_match(clean_id, m.phone or ''):
                        member = m
                        break

        # 2. If a Member record was found:
        if member:
            phone_verified = _phones_match(clean_pw, member.phone or '')
            user_pw_verified = False
            if member.user and member.user.check_password(clean_pw):
                user_pw_verified = True

            if not (phone_verified or user_pw_verified):
                raise ValueError("Invalid member credentials. Please enter your Membership ID and your registered phone number.")

            if member.status != 'active':
                raise PermissionError("Your membership account is inactive or suspended. Please contact the cooperative secretariat.")

            # Ensure User record exists for JWT & session
            user = member.user
            if not user:
                user_email = member.email
                if not user_email:
                    user_email = f"{member.member_id.lower()}@mosunmolacoop.ng"
                else:
                    existing_u = User.query.filter_by(email=user_email.lower()).first()
                    if existing_u and existing_u.member_id != member.id:
                        user_email = f"{member.member_id.lower()}@mosunmolacoop.ng"

                user = User(
                    email=user_email.lower(),
                    full_name=member.full_name,
                    role='member',
                    is_active=True,
                    member_id=member.id
                )
                user.set_password(clean_pw if len(clean_pw) >= 6 else "Member@2026")
                db.session.add(user)
                db.session.flush()
            else:
                user.is_active = True

            user.last_login = datetime.utcnow()
            db.session.commit()
            token = generate_token(user)
            return user, token

        # 3. If no Member matched, check for Staff / Admin User by email
        user = User.query.filter_by(email=clean_id.lower()).first()
        if not user or not user.check_password(clean_pw):
            raise ValueError("Invalid email/member ID or password.")

        if not user.is_active:
            raise PermissionError("Account is inactive or suspended. Please contact the cooperative secretariat.")

        user.last_login = datetime.utcnow()
        db.session.commit()

        token = generate_token(user)
        return user, token
