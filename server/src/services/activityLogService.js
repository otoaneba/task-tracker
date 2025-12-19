import { ActivityLogModel } from "../models/activityLogModel.js";
import { ValidationError } from "../utils/errors.js";
import { SortHelper } from "./helpers/sort.js";

const VALID_ACTIONS = ["task_created", "task_updated", "task_completed", "task_deleted"];

export const ActivityLogService = {
  createLog: async function({taskId, userId, action, metadata}) {

    if (!VALID_ACTIONS.includes(action)) {
      throw new ValidationError("Invalid logging action.")
    }

    if (metadata === undefined) {
      metadata = null;
    }

    if (metadata !== null && typeof metadata !== "object" ) {
      throw new ValidationError("Metadata must be an object.")
    }

    const result = await ActivityLogModel.createLog({taskId, userId, action: action, metadata});

    return result;
  },
  findLogsForUser: async function({userId, action, sortColumn, sortDirection, page, limit}) {
    let parsedPage;
    let parsedLimit;

    if (page === undefined || (typeof page === "string" && page.trim() === "")) {
      parsedPage = 1;
    } else {
      parsedPage = Number(page);
      if (Number.isNaN(parsedPage)) {
        throw new ValidationError("Page must be a number.");
      } else if (parsedPage < 1) {
        throw new ValidationError("Page must be a positive number.")
      }
    }

    if (limit === undefined || (typeof limit === "string" && limit.trim() === "")) {
      parsedLimit = 10;
    } else {
      parsedLimit = Number(limit);
      if (Number.isNaN(parsedLimit)) {
        throw new ValidationError("Limit must be a number..");
      } else if (parsedLimit < 1 || parsedLimit > 10) {
        throw new ValidationError("Limit must be between 1 and 10.")
      }
    }
    const offset = (parsedPage - 1) * parsedLimit;

    if (action === undefined || (typeof action === "string" && action.trim() === "")) {
      action = null
    } else {
      action = action.trim();
      if (!VALID_ACTIONS.includes(action)) {
        throw new ValidationError("Action must be either 'task_created', 'task_updated', 'task_completed', 'task_deleted'");
      }
    }

    const sortValues = SortHelper.NormalizeAndValidateSort({column: sortColumn, direction: sortDirection});
    sortColumn = sortValues['sortColumn'];
    sortDirection = sortValues['sortDirection'];

    const allLogs = await ActivityLogModel.findLogsForUser({userId: userId, action: action, sort: sortColumn, order: sortDirection, limit: parsedLimit, offset: offset});

    const result = {
      data: [...allLogs],
      page: parsedPage,
      limit: parsedLimit,
      hasMore: allLogs.length === parsedLimit
    }

    return result;
  }
};