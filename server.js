// server.js
const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());

const allowed = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',');
app.use(cors({ origin: allowed }));

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/api/students', (req, res) => {
  db.query('SELECT * FROM students', (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

app.post('/api/students', (req, res) => {
  const { name, email, course } = req.body;
  if (!name || !email || !course) return res.status(400).json({ error: 'All fields required' });
  db.query(
    'INSERT INTO students (name, email, course) VALUES (?, ?, ?)',
    [name, email, course],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, name, email, course });
    }
  );
});

app.put('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, course } = req.body;
  db.query(
    'UPDATE students SET name=?, email=?, course=? WHERE id=?',
    [name, email, course, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Student not found' });
      res.json({ id, name, email, course });
    }
  );
});

app.delete('/api/students/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM students WHERE id=?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Student not found' });
    res.json({ success: true });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
