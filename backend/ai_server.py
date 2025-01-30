from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import requests
import time
import sys

app = Flask(__name__)
# Configure CORS to allow requests from both frontends
CORS(app, resources={
    r"/chat": {
        "origins": [
            "http://127.0.0.1:8000",  # Original frontend
            "http://localhost:8000",   # Original frontend
            "http://localhost:5173"    # React frontend
        ],
        "methods": ["POST"],
        "allow_headers": ["Content-Type"]
    }
})

def start_ollama():
    """Start Ollama if it's not already running"""
    try:
        # Try to connect to Ollama
        requests.get('http://localhost:11434/api/tags')
        print("Ollama is already running")
    except requests.exceptions.ConnectionError:
        print("Starting Ollama...")
        # Start Ollama as a subprocess
        if sys.platform == "win32":
            subprocess.Popen(["ollama", "serve"], shell=True)
        else:
            subprocess.Popen(["ollama", "serve"])
        
        # Wait for Ollama to start
        max_retries = 5
        for i in range(max_retries):
            try:
                time.sleep(2)
                requests.get('http://localhost:11434/api/tags')
                print("Ollama started successfully")
                return
            except requests.exceptions.ConnectionError:
                if i == max_retries - 1:
                    raise Exception("Failed to start Ollama")
                continue

@app.route('/chat', methods=['POST'])
def chat():
    try:
        # Get message from either frontend implementation
        data = request.json
        message = data.get('message')
        if not message:
            return jsonify({'error': 'No message provided'}), 400

        # Call Ollama API
        response = requests.post('http://localhost:11434/api/generate', 
            json={
                'model': 'codellama',
                'prompt': message,
                'stream': False
            }
        )
        
        if response.status_code == 200:
            ai_response = response.json().get('response', '')
            return jsonify({'response': ai_response})
        else:
            return jsonify({'error': 'Failed to get response from Ollama'}), 500

        # Alternative implementation using ollama package
        # Keeping this commented for future reference
        """
        import ollama
        response = ollama.chat(model='codellama', messages=[
            {'role': 'user', 'content': message}
        ])
        return jsonify({
            'response': response['message']['content']
        })
        """
            
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    try:
        start_ollama()
        print("Starting Flask server...")
        print("\nServer is accessible from:")
        print("- Original frontend: http://localhost:8000")
        print("- React frontend: http://localhost:5173")
        app.run(port=5000, debug=True)
    except Exception as e:
        print(f"Error: {e}")