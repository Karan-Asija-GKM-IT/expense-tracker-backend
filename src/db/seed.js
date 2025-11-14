import { pool } from './db.js';

async function runSeed() {
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
      console.log("Categories seeded successfully!");
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await pool.end();
  }
}

runSeed();
