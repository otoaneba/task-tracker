import { ActivityLogService } from "../services/activityLogService"

export const ActivityLogController = {
  getActivityLog: async function({req, res, err}) {
    try {
      const result = await ActivityLogService.getLogsForUser({
        userId: req.user.id,
        taskId: req.query.taskId,
        action: req.query.action,
        sort: req.query.sort,
        order: req.query.order,
        limit: req.query.limit,
        offset: req.query.offset
      });

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}