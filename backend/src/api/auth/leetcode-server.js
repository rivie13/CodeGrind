import cors from 'cors';
import express from 'express';
import authRoutes from './routes/auth.js';

const app = express();

// Enable CORS for the frontend
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));

app.use(express.json());
app.use('/api', authRoutes);

// ... rest of your server code 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 