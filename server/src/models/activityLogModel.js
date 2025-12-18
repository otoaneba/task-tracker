import pool from "../config/db.js";
import { QueryError } from "../utils/errors.js";

export const ActivityLogModel = {
  createLog: async function({taskId, userId, action, metadata}) { 
    try {
      const sql = `
        INSERT INTO task_activity_logs (task_id, user_id, action, metadata)
        VALUES ($1, $2, $3, $4)
        RETURNING id, task_id, user_id, action, metadata, created_at
      `
      const result = await pool.query(sql, [taskId, userId, action, metadata]);

      return result.rows[0];
    } catch (error) {
      throw new QueryError("Failed to created log.", { taskId, cause: error })
    }
  },
  findLogsForUser: async function({userId, action, sort, order, limit, offset}) {
    try {
      const sql = `
        SELECT *
        FROM task_activity_logs
        WHERE
          user_id = $1
          AND ($2::text IS NULL OR action = $2::text)
        ORDER BY ${sort} ${order}, id ${order}
        LIMIT $3
        OFFSET $4
      `;
  
      const result = await pool.query(sql, [userId, action, limit, offset])
  
      return result.rows;
    } catch (error) {
      throw new QueryError("Failed to find logs for user.", {userId, cause: error})
    }
  }
};