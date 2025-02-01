import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { LeetCode } from 'leetcode-query';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './api/auth/auth.routes.js';
import leetcodeRoutes from './api/leetcode/leetcode.routes.js';

dotenv.config();

const app = express();
const leetcode = new LeetCode();

// Get the directory name using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// LeetCode problem routes
app.get('/api/problems', async (req, res) => {
  try {
    const difficulty = req.query.difficulty;
    const query = {
      query: `
        query problemsetQuestionList {
          allQuestions: allQuestionsRaw {
            titleSlug
            title
            questionFrontendId
            difficulty
            status
            isPaidOnly
          }
        }
      `
    };
    
    const response = await leetcode.graphql(query);
    let questions = response.data.allQuestions;
    
    if (difficulty) {
      questions = questions.filter(q => 
        q.difficulty.toLowerCase() === difficulty.toLowerCase()
      );
    }
    
    res.json({ questions });
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/problem/:titleSlug', async (req, res) => {
  try {
    const { titleSlug } = req.params;
    const query = {
      query: `
        query questionData($titleSlug: String!) {
          question(titleSlug: $titleSlug) {
            questionId
            questionFrontendId
            title
            titleSlug
            content
            difficulty
            codeSnippets {
              lang
              langSlug
              code
            }
          }
        }
      `,
      variables: {
        titleSlug
      }
    };
    
    const response = await leetcode.graphql(query);
    if (!response.data.question) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    
    res.json(response.data.question);
  } catch (error) {
    console.error('Error fetching problem:', error);
    res.status(500).json({ error: error.message });
  }
});

// Auth routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', leetcodeRoutes);

// Add this to your server.js file
app.post('/api/run-code', async (req, res) => {
    const { language, code } = req.body;
    console.log('Received request to run code:', { language, code });

    try {
        // First API call to submit code
        const submitResponse = await fetch('https://judge0-ce.p.rapidapi.com/submissions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': process.env.RAPID_API_KEY, // You'll need this
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            },
            body: JSON.stringify({
                source_code: code,
                language_id: getLanguageId(language),
                stdin: ''
            })
        });

        if (!submitResponse.ok) {
            const errorData = await submitResponse.text();
            console.error('Judge0 API error:', errorData);
            throw new Error(`Judge0 API error: ${errorData}`);
        }

        const submission = await submitResponse.json();
        console.log('Submission created:', submission);

        // Wait a moment for the code to be processed
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Second API call to get results
        const resultResponse = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${submission.token}`, {
            headers: {
                'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            }
        });

        if (!resultResponse.ok) {
            const errorData = await resultResponse.text();
            console.error('Judge0 API error:', errorData);
            throw new Error(`Judge0 API error: ${errorData}`);
        }

        const result = await resultResponse.json();
        console.log('Execution result:', result);

        res.json({
          "stdout": result.stdout,
          "time": result.time,
          "memory": result.memory,
          "stderr": result.stderr,
          "token": result.token,
          "compile_output": result.compile_output,
          "message": result.message,
          "status": result.status
        });
    } catch (error) {
        console.error('Error in /api/run-code:', error);
        res.status(500).json({ 
            error: 'Error executing code',
            details: error.message 
        });
    }
});

function getLanguageId(language) {
    const languageMap = {
        python: 71,    // Python (3.8.1)
        javascript: 63, // JavaScript (Node.js 12.14.0)
        java: 62,      // Java (OpenJDK 13.0.1)
        cpp: 54        // C++ (GCC 9.2.0)
    };
    return languageMap[language.toLowerCase()] || 71; // Default to Python
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '127.0.0.1', () => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 🚀 Server started`);
  console.log(`    URL: http://localhost:${PORT}`);
  console.log(`    Access: Local only (127.0.0.1)`);
  console.log(`    Ready to fetch LeetCode problems\n`);
});

// Handle server shutdown
process.on('SIGINT', () => {
  const timestamp = new Date().toISOString();
  console.log(`\n[${timestamp}] 🛑 Server shutting down`);
  process.exit();
}); 