import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authMiddleware } from './middleware/authMiddleWare.js';
import { errorHandler } from './middleware/errorHandler.js';
import { taskRoutes } from './routes/taskRoutes.js';
import { userRoutes } from './routes/userRoutes.js';
import { activityRoutes } from './routes/activityRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/users', userRoutes)
app.use('/tasks', authMiddleware, taskRoutes); // mount middleware first so that every path that starts with /tasks is protected
app.use('/activity-logs', authMiddleware, activityRoutes);
 
// Error handling
app.use(errorHandler);

export default app;