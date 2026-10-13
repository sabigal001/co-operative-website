"""
Mosunmola Cooperative - Staff / Admin Management CLI
Use this on PythonAnywhere or locally to provision, inspect, or reset staff passwords.

Usage:
  python manage_admin.py show
  python manage_admin.py set-password bhassannosimot@gmail.com MyNewSecret2026!
  python manage_admin.py create-admin bhassannosimot@gmail.com "Nosimot Hassan" MyNewSecret2026!
"""
import sys
import os

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(os.path.dirname(__file__))))

from backend.app import create_app
from backend.app.models import db, User

def show_admins():
    app = create_app()
    with app.app_context():
        users = User.query.filter(User.role.in_(['master_admin', 'treasurer', 'secretary'])).all()
        print("\n================== MOSUNMOLA STAFF ACCOUNTS ==================")
        if not users:
            print("No staff accounts found. Run 'python seed.py' first.")
        for u in users:
            print(f"Role: {u.role:<15} | Email: {u.email:<30} | Name: {u.full_name} | Active: {u.is_active}")
        print("==============================================================\n")

def set_password(email, new_password):
    if not email or not new_password:
        print("Error: Email and new password are required.")
        print("Example: python manage_admin.py set-password bhassannosimot@gmail.com NewPassword123")
        sys.exit(1)

    app = create_app()
    with app.app_context():
        user = User.query.filter_by(email=email.strip().lower()).first()
        if not user:
            print(f"Error: No user found with email '{email}'.")
            sys.exit(1)

        user.set_password(new_password)
        db.session.commit()
        print(f"\nSUCCESS: Password for '{email}' ({user.role}) has been updated successfully!\n")

def create_admin(email, full_name, password):
    if not email or not full_name or not password:
        print("Error: email, full_name, and password are required.")
        print('Example: python manage_admin.py create-admin bhassannosimot@gmail.com "Nosimot Hassan" Secret2026!')
        sys.exit(1)

    app = create_app()
    with app.app_context():
        email = email.strip().lower()
        user = User.query.filter_by(email=email).first()
        if user:
            user.full_name = full_name
            user.role = 'master_admin'
            user.is_active = True
            user.set_password(password)
            db.session.commit()
            print(f"\nSUCCESS: Existing user '{email}' updated to Master Admin with new password.\n")
        else:
            new_user = User(
                email=email,
                full_name=full_name,
                role='master_admin',
                is_active=True
            )
            new_user.set_password(password)
            db.session.add(new_user)
            db.session.commit()
            print(f"\nSUCCESS: Master Admin account created for '{email}' with role 'master_admin'.\n")

if __name__ == '__main__':
    args = sys.argv[1:]
    if not args:
        print(__doc__)
        sys.exit(0)

    cmd = args[0].lower()
    if cmd == 'show':
        show_admins()
    elif cmd == 'set-password':
        if len(args) < 3:
            print("Usage: python manage_admin.py set-password <email> <new_password>")
            sys.exit(1)
        set_password(args[1], args[2])
    elif cmd == 'create-admin':
        if len(args) < 4:
            print('Usage: python manage_admin.py create-admin <email> "<full_name>" <password>')
            sys.exit(1)
        create_admin(args[1], args[2], args[3])
    else:
        print(f"Unknown command '{cmd}'. Available commands: show, set-password, create-admin")
        print(__doc__)
