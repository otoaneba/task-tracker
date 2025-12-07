import pool from "../config/db.js";
import { QueryError } from "../utils/errors.js";

export const UserModel = {
  findByEmail: async (email) => {
    try {
      const sql = "SELECT * FROM users WHERE email = $1"; // $1 = first parameter
      const params = [email]; // parameters must be an array. If a string is passed in, pg will treat each character as a separate parameter.
      const result = await pool.query(sql, params);
      
      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0] || null;
    } catch (error) {
      throw new QueryError("Failed to query user by email", { email, cause: error });
    }
  },
  createUser: async function({email, passwordHash, username}) {
    try {
      const sql = "INSERT INTO users (email, password_hash, username) VALUES ($1, $2, $3) RETURNING *"; // RETURNING * = return the created user
      const result = await pool.query(sql, [email, passwordHash, username]);

      if (result.rowCount === 0) {
        return null;
      }

      return result.rows[0] || null;
    } catch (error) {
      throw new QueryError("Failed to create user", { username, email, cause: error })
    }
  },
  findById: async function(id) {
    try {
    const sql = "SELECT * FROM users WHERE id = $1";
    const result = await pool.query(sql, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] || null;
    } catch (error) {
      throw new QueryError("Failed to find user by id", { id, cause: error })
    }
  }
}