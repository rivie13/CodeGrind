import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { LeetCode } from 'leetcode-query';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
// Initialize LeetCode client with authentication
const leetcode = new LeetCode();

// Get the directory name using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    next();
});

// Update CORS configuration to include Vite's default port
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET']
}));

// Serve Monaco Editor files from node_modules
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Add these middleware BEFORE your routes
app.use(express.json());  // This line is crucial for parsing JSON request bodies

// Bind to localhost only
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

// Listen only on localhost
app.listen(port, '127.0.0.1', () => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] 🚀 Server started`);
    console.log(`    URL: http://localhost:${port}`);
    console.log(`    Access: Local only (127.0.0.1)`);
    console.log(`    Ready to fetch LeetCode problems\n`);
});

// Handle server shutdown
process.on('SIGINT', () => {
    const timestamp = new Date().toISOString();
    console.log(`\n[${timestamp}] 🛑 Server shutting down`);
    process.exit();
});