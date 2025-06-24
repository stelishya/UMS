import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);

const PORT = process.env.PORT || 4006;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));