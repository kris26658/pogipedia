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
// the rought /api/pogs displayes all pogs with their uid , name , color and tag in oeder of entered in the database
app.get('/api/pogs', (req, res) => {
  const sql = 'SELECT uid, serial, name, color, tags FROM pogs';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(
      rows.map(row => ({
        uid: row.uid,
        serial: row.serial,
        name: row.name,
        color: row.color,
        tags: row.tags,
      }))
    );
  });
});





// Route to get all data about an individual pog, including variations
// the route /api/pogs/:uid displays all data about an pug based in its uid
// for example if one is to enter /api/pogs/1 it will display all data about the pog with uid 1 inculding it varitions if any 

app.get('/api/pogs/:identifier', (req, res) => {
  const identifier = req.params.identifier;
  let sql;
  let params;

  console.log(`Received identifier: ${identifier}`);

  // Check if the identifier is a number (uid) or matches a serial number pattern
  if (!isNaN(identifier)) {
    sql = 'SELECT uid, serial, name, color, tags, lore, rank, creator FROM pogs WHERE uid = ?';
    params = [identifier];
    console.log('Identifier is a number, treating as uid');
  } else if (/^\d{4}[A-Z]{1}\d{2}$/.test(identifier)) { // Adjust the regex pattern to match your serial number format
    sql = 'SELECT uid, serial, name, color, tags FROM pogs WHERE serial = ?';
    params = [identifier];
    console.log('Identifier matches serial number pattern');
  } else {
    sql = 'SELECT uid, serial, name, color, tags FROM pogs WHERE name = ?';
    params = [identifier];
    console.log('Identifier is treated as name');
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows.map(row => ({
      uid: row.uid,
      serial: row.serial,
      name: row.name,
      color: row.color,
      tags: row.tags,
      lore: row.lore,
      rank: row.rank,
      creator: row.creator,
    })));
  });
});
// Route to get all collections (tags)
// the route /api/collections displays all collections in the database
// it only displays the tags catgory of the pogs and only 1 of each name

app.get('/api/collections', (req, res) => {
  const sql = 'SELECT DISTINCT tags FROM pogs';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
     
      data: rows.map(row => row.tags)
    });
  });
});

// Route to get all pogs in a specific collection (tag)
// the route /api/collections/:name displays all pogs in a specific collection based on the tag name
// for example if you enter /api/collections/Class Pog it will display all pogs with the tag Class Pog
// it will display the pogs uid , name , and color in order of entered in the database
app.get('/api/collections/:name', (req, res) => {
  const collectionName = req.params.name;
  const sql = 'SELECT uid, serial, name, color FROM pogs WHERE tags = ?'; 
  db.all(sql, [collectionName], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows.map(row => ({
      uid: row.uid,
      serial: row.serial,
      name: row.name,
      color: row.color, 
    })));
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});