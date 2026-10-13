import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from backend.app.config import Config
from backend.app.models import db

migrate = Migrate()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Enable CORS for frontend integration
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints
    from backend.app.routes.auth_routes import auth_bp
    from backend.app.routes.admin_members_routes import admin_members_bp
    from backend.app.routes.admin_transactions_routes import admin_transactions_bp
    from backend.app.routes.member_portal_routes import member_portal_bp
    from backend.app.routes.reports_routes import reports_bp
    from backend.app.routes.admin_bulk_routes import admin_bulk_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_members_bp)
    app.register_blueprint(admin_transactions_bp)
    app.register_blueprint(member_portal_bp)
    app.register_blueprint(reports_bp)
    app.register_blueprint(admin_bulk_bp)

    @app.route('/api/health', methods=['GET'])
    def health():
        return jsonify({
            'status': 'healthy',
            'service': 'Mosunmola Cooperative Core API',
            'version': '1.0.0-PROD'
        }), 200

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'success': False, 'message': 'Endpoint not found.'}), 404

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({'success': False, 'message': 'Internal server error occurred.'}), 500

    # Ensure tables exist for dev/sqlite
    with app.app_context():
        db.create_all()

    return app
