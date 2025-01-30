from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import requests
import time
import sys

app = Flask(__name__)
# Configure CORS to allow requests from your frontend
CORS(app, resources={
    r"/chat": {
        "origins": ["http://127.0.0.1:8000", "http://localhost:8000", "http://localhost:5173"],
        "methods": ["POST"]
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
        data = request.json
        user_message = data.get('message', '')
        
        # Call Ollama API
        response = requests.post('http://localhost:11434/api/generate', 
            json={
                'model': 'codellama',
                'prompt': user_message,
                'stream': False
            }
        )
        
        if response.status_code == 200:
            ai_response = response.json().get('response', '')
            return jsonify({'response': ai_response})
        else:
            return jsonify({'error': 'Failed to get response from Ollama'}), 500
            
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    try:
        start_ollama()
        print("Starting Flask server...")
        app.run(port=5000)
    except Exception as e:
        print(f"Error: {e}") 