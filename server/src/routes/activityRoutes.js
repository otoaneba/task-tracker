import express from 'express';
import { ActivityLogController } from '../controllers/activityLogController.js';

export const activityRoutes = express.Router();

activityRoutes.get('/', ActivityLogController.getActivityLog)