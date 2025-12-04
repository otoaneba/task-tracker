import { pool } from "../config/db.js";
import { QueryError } from "../utils/errors.js";

export const TaskModel = {
  findAll: async function(userId) {
    try {
      const sql = "SELECT * FROM tasks WHERE user_id = $1 AND deleted_at IS NULL";
      const result = await pool.query(sql, [userId]);

      if (result.rows.length === 0) { 
        return [];
      }

      return result.rows || null;
    } catch (error) {
      throw new QueryError("Failed to find all tasks", { userId, cause: error });
    }
  },
  findTaskById: async function(id, userId) {
    try {
      const sql = "SELECT * from tasks WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL";
      const result = await pool.query(sql, [id, userId]);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0] || null;
    } catch (error) {
      throw new QueryError("Failed to find task by id", {id, userId, cause: error})
    }
  },
  createTask: async function({userId, title, description, imageUrl, status, dueDate}) {
    try {
      const sql = "INSERT INTO tasks (user_id, title, description, image_url, status, due_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *"; // RETURNING * = return the created task
      const result = await pool.query(sql, [userId, title, description, imageUrl, status, dueDate]);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0] || null;
    } catch (error) {
      throw new QueryError("Failed to create task by id", {title, description, imageUrl, status, dueDate, cause: error});
    }
  },
  updateTask: async function({id, userId, title, description, imageUrl, status, dueDate}) {
    try {
      const sql = "UPDATE tasks SET title = $1, description = $2, image_url = $3, status = $4, due_date = $5, updated_at = NOW() WHERE id = $6 AND user_id = $7 AND deleted_at IS NULL RETURNING *";
      const result = await pool.query(sql, [title, description, imageUrl, status, dueDate, id, userId]);

      if (result.rowCount === 0) {
        return null;
      }

      return result.rows[0] || null;
    } catch (error) {
      throw new QueryError("Failed to update task", {id, userId, title, description, imageUrl, status, dueDate, cause: error})
    }
  },
  deleteTask: async function({id, userId}) {
    try {
      const sql = "UPDATE tasks SET deleted_at = NOW() WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL RETURNING *";
      const result = await pool.query(sql, [id, userId]);

      if (result.rowCount === 0) {
        return null;
      }

      return result.rows[0] || null;
    } catch (error) {
      throw new QueryError("Failed to delete task", {id, userId, cause: error})
    }
  }
}