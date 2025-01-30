# CodeGrind

CodeGrind is an interactive platform that gamifies Data Structures and Algorithms (DSA) practice. It combines LeetCode-style programming challenges with competitive elements and AI assistance to create an engaging learning experience.

## Features

### Current Features
- LeetCode problem integration
- Real-time code editor with syntax highlighting
- AI assistant for problem-solving guidance
- Difficulty-based problem filtering
- Responsive three-panel layout (Problem Description, Code Editor, AI Chat)

### Upcoming Features
- User authentication and profiles
- Competitive coding battles
- Real-time leaderboards
- Achievement system
- Discussion boards
- Direct messaging between users
- Problem-solving statistics and analytics
- Custom problem creation

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- Ollama (for AI functionality)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/codegrind.git
cd codegrind
```

2. Install backend dependencies
```bash
cd public/js
npm install
```

3. Install Python dependencies
```bash
cd backend
pip install -r requirements.txt
```

4. Install and set up Ollama
- Download from [Ollama's website](https://ollama.ai)
- Install the codellama model:
```bash
ollama pull codellama
```

5. Install frontend dependencies
```bash
   cd codegrind-frontend
   npm install
```

### Running the Application

1. Start the Express backend server (serves LeetCode problems)
```bash
cd public/js
node server.js
```

2. Start the frontend server (in a new terminal)
```bash
# From the project root
python -m http.server 8000
```

3. Start the AI server (in a new terminal)
```bash
cd backend
python ai_server.py
```

3. Start the React development server: (if using the react frontend)
```bash
   cd codegrind-frontend
   npm run dev
   ```


4. Access the application
- Open your browser and navigate to `http://127.0.0.1:8000/public/index.html`
- Note: Use `127.0.0.1` instead of `localhost` for proper CORS functionality
- Open your browser and navigate to `http://localhost:5173` to access the application. (if using the react frontend)

### Development Notes
- The frontend runs on port 8000
- The Express backend runs on port 3000
- The AI server runs on port 5000
- CORS is configured to allow communication between these services

## Project Structure
```
codegrind/
├── backend/
│   ├── .env
│   ├── ai_server.py
│   └── requirements.txt
├── public/
│   ├── index.html
│   ├── problems.html
│   ├── problem-details.html
│   ├── styles.css
│   └── js/
│       ├── server.js
│       ├── problems.js
│       └── problem-details.js
└── README.md
│       
└── .env
```

## Environment Variables
.env files are not included in the repository. You need to create them yourself.
.env files are used to store sensitive information such as API keys and passwords.
codegrind/.env file:
'''
# LeetCode credentials
LEETCODE_USERNAME=
LEETCODE_PASSWORD=
'''

backend/.env file:
'''
# Azure OpenAI credentials
# Azure options that you can set none are used yet...
USE_AZURE=false
AZURE_ENDPOINT=
AZURE_API_KEY=
'''

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request. I may take a while to review it.

## License
This project is licensed under the MIT License - see the LICENSE file for details.