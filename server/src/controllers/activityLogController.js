import { ActivityLogService } from "../services/activityLogService.js"

export const ActivityLogController = {
  getActivityLog: async function(req, res, next) {
    try {
      const result = await ActivityLogService.findLogsForUser({
        userId: req.user.id,
        taskId: req.query.taskId,
        action: req.query.action,
        sort: req.query.sort,
        order: req.query.order,
        limit: req.query.limit,
        page: req.query.page
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
}