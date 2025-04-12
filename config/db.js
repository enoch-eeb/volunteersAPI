const { Pool } = require('pg');
require('dotenv').config();

// Buat class Database untuk manajemen koneksi yang lebih baik
class Database {
  constructor() {
    if (!process.env.DB_URL) {
      throw new Error('DB_URL environment variable not set');
    }

    this.pool = new Pool({
      connectionString: process.env.DB_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000
    });

    this.init()
      .then(() => console.log('Database connected'))
      .catch(err => console.error('Database connection failed:', err));
  }

  async init() {
    try {
      await this.pool.query('SELECT 1');
    } catch (err) {
      throw new Error(`Database connection test failed: ${err.message}`);
    }
  }

  async query(text, params) {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      console.log(`Executed query in ${duration}ms`);
      return res;
    } catch (err) {
      console.error('Query error:', { text, params, error: err.message });
      throw err;
    }
  }
}

// Ekspor instance database yang sudah jadi
module.exports = new Database();