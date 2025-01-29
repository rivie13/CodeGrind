import cors from 'cors';
import express from 'express';
import { LeetCode } from 'leetcode-query';

const app = express();
const port = 3000;
const leetcode = new LeetCode();

// Request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

// Only allow requests from your local machine
app.use(cors({
    origin: 'http://127.0.0.1:8000',
    methods: ['GET'] // Only allow GET requests
}));

// Bind to localhost only
app.get('/api/problems', async (req, res) => {
    try {
        const difficulty = req.query.difficulty;
        const filters = difficulty ? { difficulty } : {};
        const problems = await leetcode.problems({ filters });
        res.json(problems);
    } catch (error) {
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