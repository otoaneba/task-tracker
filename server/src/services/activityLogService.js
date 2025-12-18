import { ActivityLogModel } from "../models/activityLogModel";
import { ValidationError } from "../utils/errors";
import { ActivityLogHelper } from "./helpers/log";

export const ActivityLogService = {
  createLog: async function({taskId, userId, action, metadata}) {
    // validate action and metaData
    if (action == null) {
      throw new ValidationError("Action is required for logging.");
    }

    if (typeof action !== "string") {
      throw new ValidationError("Invalid logging action.");
    }

    const normalizedAction = action.trim();

    if (normalizedAction === "") {
      throw new ValidationError("Action is required for logging.");
    }

    const validActions = ["task_created", "task_updated", "task_completed", "task_deleted"];

    if (!validActions.includes(normalizedAction)) {
      throw new ValidationError("Invalid logging action.")
    }

    if (metadata === undefined) {
      metadata = null;
    }
    if (metadata !== null && typeof metadata !== "object" ) {
      throw new ValidationError("Metadata must be an object.")
    }

    const result = await ActivityLogModel.createLog({taskId, userId, action: normalizedAction, metadata});

    return result;
  },
  findLogsForUser: async function() {

  }
};