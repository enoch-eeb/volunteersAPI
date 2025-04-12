const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all volunteers
router.get('/volunteers', async (req, res) => {
  try {
    const query = 'SELECT id, nama_lengkap, bidang_pelayanan, alat_musik, email FROM volunteers';
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get volunteers by bidang pelayanan
router.get('/volunteers/:bidang', async (req, res) => {
  try {
    const { bidang } = req.params;
    const query = `
      SELECT * FROM volunteers 
      WHERE $1 = ANY(bidang_pelayanan)
    `;
    const { rows } = await pool.query(query, [bidang]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST (Create New Volunteer)
router.post('/volunteers', async (req, res) => {
  try {
    const {
      nama_lengkap,
      tanggal_lahir,
      nomor_hp,
      email,
      bidang_pelayanan,
      pengalaman,
      alat_musik,
      bersedia_latihan,
      bersedia_training
    } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO volunteers (
        nama_lengkap,
        tanggal_lahir,
        nomor_hp,
        email,
        bidang_pelayanan,
        pengalaman,
        alat_musik,
        bersedia_latihan,
        bersedia_training
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        nama_lengkap,
        tanggal_lahir || null,
        nomor_hp || null,
        email,
        bidang_pelayanan || [],
        pengalaman || null,
        alat_musik || [],
        bersedia_latihan || null,
        bersedia_training || null
      ]
    );

    res.status(201).json({ 
      message: 'Data added successfully', 
      data: rows[0] 
    });
  } catch (err) {
    res.status(400).json({ 
      error: 'Failed to add data',
      details: err.message 
    });
  }
});

// PUT (Update Volunteer)
router.put('/volunteers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Validasi minimal 1 field yang diupdate
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    // Bangin query secara dinamis
    const setClause = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updateData)) {
      setClause.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }

    values.push(id); // ID selalu di akhir
    const query = `
      UPDATE volunteers 
      SET ${setClause.join(', ')} 
      WHERE id = $${paramIndex} 
      RETURNING *
    `;

    const { rows } = await pool.query(query, values);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Volunteer not found" });
    }

    res.json({ 
      message: 'Data updated partially', 
      data: rows[0] 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE Volunteer
router.delete('/volunteers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM volunteers WHERE id = $1', [id]);
    res.json({ message: 'Data deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


module.exports = router;