import express from 'express';
import { leetcodeService } from './leetcode.service.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const questions = await leetcodeService.getProblems(req.query.difficulty);
    res.json({ questions });
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:titleSlug', async (req, res) => {
  try {
    const problem = await leetcodeService.getProblemBySlug(req.params.titleSlug);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    res.json(problem);
  } catch (error) {
    console.error('Error fetching problem:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router; 