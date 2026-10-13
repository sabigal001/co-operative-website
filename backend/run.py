import os
import sys

# Add repository root to python path
sys.path.insert(0, os.path.abspath(os.path.dirname(os.path.dirname(__file__))))

from backend.app import create_app

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting Mosunmola Cooperative API server on port {port}...")
    app.run(host='127.0.0.1', port=port, debug=True)
