import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { LeetCode } from 'leetcode-query';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const port = 3000;
// Initialize LeetCode client with authentication
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

// Only allow requests from your local machine
app.use(cors({
    origin: ['http://localhost:8000', 'http://127.0.0.1:8000'],
    methods: ['GET'] // Only allow GET requests
}));


// Serve Monaco Editor files from node_modules
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Bind to localhost only
app.get('/api/problems', async (req, res) => {
    try {
        // Convert EASY to Easy, MEDIUM to Medium, etc.
        const difficulty = req.query.difficulty ? 
            req.query.difficulty.charAt(0).toUpperCase() + 
            req.query.difficulty.slice(1).toLowerCase() : null;
        console.log('\n==== DEBUG INFO ====');
        console.log('Original difficulty:', req.query.difficulty);
        console.log('Converted difficulty:', difficulty);
        
        // ... authentication code ...
        // Try to authenticate if credentials are provided
        if (process.env.LEETCODE_USERNAME && process.env.LEETCODE_PASSWORD) {
            try {
                await leetcode.auth({
                    username: process.env.LEETCODE_USERNAME,
                    password: process.env.LEETCODE_PASSWORD
                });
                console.log('Successfully authenticated with LeetCode');
            } catch (authError) {
                console.error('Authentication failed:', authError.message);
            }
        }

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
        
        // Get a sample of the first problem before filtering
        console.log('\nFirst problem from API:', {
            title: response.data.allQuestions[0].title,
            difficulty: response.data.allQuestions[0].difficulty
        });

        // Log all possible difficulty values
        const difficulties = [...new Set(response.data.allQuestions.map(q => q.difficulty))];
        console.log('\nAll possible difficulty values in API:', difficulties);

        const problems = response.data.allQuestions.filter(q => {
            return !q.isPaidOnly && 
                   (!difficulty || q.difficulty === difficulty);
        });
        
        const timestamp = new Date().toISOString();
        console.log(`\n[${timestamp}] ✅ Retrieved ${problems.length} problems ${difficulty ? `(Difficulty: ${difficulty})` : ''}`);
        console.log('==== END DEBUG INFO ====\n');
        
        res.json({ 
            questions: problems,
            total: problems.length 
        });
    } catch (error) {
        console.error('Error fetching problems:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/problem/:titleSlug', async (req, res) => {
    try {
        const { titleSlug } = req.params;
        console.log('Received request for problem:', titleSlug);
        
        console.log('Fetching problem from LeetCode API...');
        const query = {
            query: `
                query questionData($titleSlug: String!) {
                    question(titleSlug: $titleSlug) {
                        questionId
                        title
                        content
                        difficulty
                    }
                }
            `,
            variables: {
                titleSlug: titleSlug
            }
        };
        
        const response = await leetcode.graphql(query);
        console.log('LeetCode API Response:', response);
        
        if (!response.data?.question) {
            console.log('No question data found in response');
            throw new Error('Problem not found');
        }

        res.json(response);
    } catch (error) {
        console.error('Error fetching problem:', error);
        res.status(500).json({ error: error.message });
    }
});


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