import express from 'express';
import { TaskController } from '../controllers/taskController.js';

export const taskRoutes = express.Router();

taskRoutes.get('/', TaskController.getTasksForUser);
taskRoutes.get('/:taskId', TaskController.getTaskById);
taskRoutes.post('/', TaskController.createTask);
taskRoutes.patch('/:taskId', TaskController.updateTask);
taskRoutes.delete('/:taskId', TaskController.deleteTask);

taskRoutes.post('/:taskId/activity-logs')