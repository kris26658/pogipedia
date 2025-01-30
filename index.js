const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;

// Connect to SQLite database
const dbPath = path.resolve(__dirname, 'db', 'pog.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initializeDatabase();
  }
});

// Function to initialize the database
function initializeDatabase() {
  db.serialize(() => {
    // Create tables
    db.run(`
      CREATE TABLE IF NOT EXISTS pogs (
        uid INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        tags TEXT NOT NULL
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS variations (
        uid INTEGER PRIMARY KEY,
        pog_id INTEGER NOT NULL,
        variation TEXT NOT NULL,
        FOREIGN KEY (pog_id) REFERENCES pogs (uid)
      )
    `);

    })
     
}

// Route to get all pogs with their tags using uid for uid tags
app.get('/api/pogs', (req, res) => {
  const sql = 'SELECT uid, name,color , tags FROM pogs';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});





// Route to get all data about an individual pog, including variations
app.get('/api/pogs/:uid', (req, res) => {
  const uid = req.params.uid;
  // Assuming you are using a database query to get the pog details
  const query = 'SELECT * FROM pogs WHERE uid = ?'; // Adjust the query as needed
  db.all(query, [uid], (err, rows) => {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      if (rows.length === 0) {
          res.status(404).json({ error: 'Pogs not found' });
          return;
      }
      // Assuming 'color' is a field in your 'pogs' table
      res.json(rows.map(row => ({
          uid: row.uid,
          name: row.name,
          lore: row.lore,
          color: row.color, // Include the color field in the response
          tags: row.tags,
          // Add other fields as needed
      })));
  });
});

// Route to get all collections
app.get('/api/collections', (req, res) => {
  const sql = 'SELECT DISTINCT tags FROM pogs';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows.map(row => row.tags)
    });
  });
});

// Route to get all pogs in a tags
app.get('/api/collections/:name', (req, res) => {
  const collectionName = req.params.name;
  const sql = 'SELECT uid, name, color FROM pogs WHERE tags = ?'; // Include color in the SQL query
  db.all(sql, [collectionName], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows.map(row => ({
      uid: row.uid,
      name: row.name,
      color: row.color, // Include the color field in the response
    })));
  });
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});