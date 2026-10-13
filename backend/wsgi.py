import sys
import os

# PythonAnywhere WSGI configuration
# Replace '/home/yourusername/cooperative-website' with your actual PythonAnywhere path
project_home = os.path.expanduser('~/cooperative-website')
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Set production environment variables
os.environ.setdefault('FLASK_ENV', 'production')

from backend.app import create_app
from backend.app.config import Config

application = create_app(Config)
