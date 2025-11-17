import {pool} from '../db/db.js';


export const getAllCategoriesService = async () => {
    const result = await pool.query('SELECT id, name FROM categories ORDER BY id ASC');
    return result.rows;
}