import { pool } from './db.js';

export async function seed() {
  try {
    const categories = [
      'Food/Drinks', 'Shopping', 'Entertainment', 'Rent',
      'Water Bill', 'Electricity Bill', 'Health', 'Sports',
      'Pets', 'Travel', 'Tax', 'Salary', 'Odd Jobs', 'Pension'
    ];

    for (const category of categories) {
      await pool.query(
        'INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
        [category]
      );
    }
    console.log("Seed UP completed!");
  } catch (err) {
    console.error("Seed UP error:", err);
  } finally {
    await pool.end();
  }
}

export async function unseed() {
  try {
    await pool.query("DELETE FROM categories WHERE name IN ('Food/Drinks', 'Shopping', 'Entertainment', 'Rent', 'Water Bill', 'Electricity Bill', 'Health', 'Sports', 'Pets', 'Travel', 'Tax', 'Salary', 'Odd Jobs', 'Pension');");

    console.log("Seed DOWN completed!");
  } catch (err) {
    console.error("Seed DOWN error:", err);
  } finally {
    await pool.end();
  }
}
