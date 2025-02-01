# CodeGrind

CodeGrind is an interactive platform that gamifies Data Structures and Algorithms (DSA) practice. It combines LeetCode-style programming challenges with competitive elements and AI assistance to create an engaging learning experience.

## Features

### Current Features
- LeetCode problem integration
- Real-time code editor with syntax highlighting
- AI assistant for problem-solving guidance
- Difficulty-based problem filtering
- Responsive three-panel layout (Problem Description, Code Editor, AI Chat)
- User authentication system
  - Login/Register functionality
  - JWT-based authentication
  - Secure password hashing
  - Profile dashboard with statistics
- Problem filtering by difficulty level
- Real-time code execution
- Personalized user profiles

### Upcoming Features
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
- PostgreSQL (v14 or higher)
- Ollama (for AI functionality)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/codegrind.git
cd codegrind
```

2. Set up PostgreSQL
```bash
# Install PostgreSQL if not already installed
# Windows: Download and install from https://www.postgresql.org/download/windows/
# Mac: brew install postgresql
# Linux: sudo apt install postgresql

# Create a new database
psql -U postgres
CREATE DATABASE codegrind;
\q
```

3. Install and configure backend
```bash
cd backend
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database and LeetCode credentials:
# DATABASE_URL="postgresql://username:password@localhost:5432/codegrind"
# LEETCODE_USERNAME="your_leetcode_username"
# LEETCODE_PASSWORD="your_leetcode_password"
# JWT_SECRET="your_jwt_secret"

# Initialize the database
npx prisma migrate dev
npx prisma generate
```

4. Install Python dependencies for AI server
```bash
cd backend/src/ai
pip install -r requirements.txt
```

5. Install and set up Ollama
- Download from [Ollama's website](https://ollama.ai)
- Install the codellama model:
```bash
ollama pull codellama
```

6. Install frontend dependencies
```bash
cd codegrind-frontend
npm install

# Set up frontend environment variables
cp .env.example .env
# Edit .env with your backend URLs:
# VITE_API_URL=http://localhost:3000
# VITE_AI_SERVER_URL=http://localhost:5000
```

### Running the Application

1. Start the backend servers:
```bash
# Start PostgreSQL service if not running
# Windows: net start postgresql
# Mac: brew services start postgresql
# Linux: sudo service postgresql start

# Start the backend server
cd backend
npm run dev

# In a separate terminal, start the AI server
cd backend/src/ai
python ai_server.py
```

2. Start the frontend:
```bash
cd codegrind-frontend
npm run dev
```

3. Access the application at http://localhost:5173

### Development Notes
- The frontend runs on port 5173
- The Express backend runs on port 3000
- The AI server runs on port 5000 (must be started separately with Python)
- PostgreSQL runs on port 5432
- CORS is configured to allow communication between these services

## Environment Variables
.env files are not included in the repository. You need to create them yourself.

backend/.env:
```
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/codegrind"

# LeetCode credentials
LEETCODE_USERNAME=your_username
LEETCODE_PASSWORD=your_password

# JWT configuration
JWT_SECRET=your_secret_key

# Server configuration
PORT=3000
FRONTEND_URL=http://localhost:5173
```

frontend/.env:
```
VITE_API_URL=http://localhost:3000
VITE_AI_SERVER_URL=http://localhost:5000
```

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request. I may take a while to review it.

## License
This project is licensed under the MIT License - see the LICENSE file for details.