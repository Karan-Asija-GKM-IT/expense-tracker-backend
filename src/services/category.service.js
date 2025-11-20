import { pool } from '../db/db.js';
import { handleServiceError } from "../helpers/handleServiceError.js";

export const getCategories = async () => {
  try {
    const result = await pool.query(
      'SELECT id, name FROM categories ORDER BY id ASC'
    );
    return result.rows;

  } catch (err) {
    handleServiceError(err, "Failed to fetch categories");
  }
};
