const express = require('express');
const path = require('path');
const app = express();
const apiRouter = require('./routes/api');
const db = require('./config/db');

// Konfigurasi view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Gunakan path absolut

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Gunakan path absolut
app.use('/api', apiRouter);

// Render halaman utama
app.get('/', async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT 
        id,
        nama_lengkap,
        COALESCE(bidang_pelayanan, ARRAY[]::text[]) as bidang_pelayanan,
        COALESCE(alat_musik, ARRAY[]::text[]) as alat_musik,
        email
      FROM volunteers
    `);
    
    const volunteers = result.rows;
    const bidangList = [...new Set(
      volunteers.flatMap(v => v.bidang_pelayanan || [])
    )].filter(Boolean).sort();

    res.render('index', { 
      volunteers: volunteers || [], 
      bidangList: bidangList || [],
      partials: { header: true }
    });
    
  } catch (err) {
    console.error('Database operation failed:', err);
    next(err);
  }
});


// 404 Handler
app.use((req, res) => {
  res.status(404).render('error', {
    message: 'Halaman tidak ditemukan'
  });
});

// Error handling middleware yang lebih baik
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  
  // Pastikan file error.ejs ada di folder views
  res.status(500).render('error', {
    message: process.env.NODE_ENV === 'production' 
      ? 'Terjadi kesalahan server' 
      : err.message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server dengan error handling
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Handle uncaught exceptions
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  server.close(() => process.exit(1));
});

module.exports = app;