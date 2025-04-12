const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'YouthYoungAdultGSRIK',
  password: 'sa',
  port: 5432,
});
module.exports = pool;