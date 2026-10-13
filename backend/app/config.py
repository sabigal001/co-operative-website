import os
from sqlalchemy.pool import StaticPool

basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-mosunmola-change-in-production')
    
    # Database URL: Supports SQLite default or PostgreSQL / MySQL on PythonAnywhere
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or f"sqlite:///{os.path.join(basedir, 'mosunmola.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Token authentication
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', SECRET_KEY)
    JWT_EXPIRY_HOURS = int(os.environ.get('JWT_EXPIRY_HOURS', '24'))
    
    # One-time bootstrap secret for Master Admin initialization
    BOOTSTRAP_SECRET = os.environ.get('BOOTSTRAP_SECRET', 'MOSUNMOLA_INIT_BOOTSTRAP_2026')
    
    # Authorised Staff Emails (Environment allowlist)
    MASTER_ADMIN_EMAIL = os.environ.get('MASTER_ADMIN_EMAIL', 'admin@mosunmolacoop.ng').strip().lower()
    TREASURER_EMAIL = os.environ.get('TREASURER_EMAIL', 'treasurer@mosunmolacoop.ng').strip().lower()
    SECRETARY_EMAIL = os.environ.get('SECRETARY_EMAIL', 'secretary@mosunmolacoop.ng').strip().lower()

class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite://'
    SQLALCHEMY_ENGINE_OPTIONS = {
        'poolclass': StaticPool,
        'connect_args': {'check_same_thread': False}
    }
    WTF_CSRF_ENABLED = False
