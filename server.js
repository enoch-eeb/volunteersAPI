const express = require('express');
const app = express();
const apiRouter = require('./routes/api');

// Set EJS sebagai view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware
app.use(express.json()); 
app.use(express.static('public'));
app.use('/api', apiRouter);

// Render halaman utama
app.get('/', async (req, res) => {
  try {
    // Ambil data volunteers
    const volunteersResponse = await fetch('http://localhost:3000/api/volunteers');
    const volunteers = await volunteersResponse.json();
    
    // Ekstrak daftar bidang unik untuk filter
    const bidangList = [...new Set(
      volunteers.flatMap(v => v.bidang_pelayanan)
    )].filter(Boolean);
    
    res.render('index', { 
      volunteers, 
      bidangList 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading data');
  }
});

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});