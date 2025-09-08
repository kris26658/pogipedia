const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const AUTH_URL = 'http://localhost:420/oauth';
const THIS_URL = 'http://172.16.3.209:3000/login';
const app = express();
const port = 3000;

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'mYl!ttL3Gn!',
  resave: false,
  saveUninitialized: false,
}));

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

// Check if dark mode is enabled through environment variable
let darkMode = false;
if (process.env.DARK_MODE === 'true') {
  darkMode = true;
  console.log('Dark mode is enabled.');
}

// Define color schemes for light and dark modes
const lightRanks = {
  'Uncommon': '#EBF8DC',
  'Trash': '#fcdcdc',
  'Common': '#ffedc1',
  'Rare': '#DCF2F8',
  'Mythic': '#E7D5F3',
  'Default': '#FFFFFF'
};

const darkRanks = {
  'Uncommon': '#3d442f',
  'Trash': '#412020',
  'Common': '#4b3317',
  'Rare': '#2d3f4d',
  'Mythic': '#34314b',
  'Default': '#333333'
};

// Function to get background color based on rank and theme
function getBackgroundColor(rank) {
  return darkMode ? darkRanks[rank] || darkRanks['Default'] : lightRanks[rank] || lightRanks['Default'];
}

// Function to initialize the database
function initializeDatabase() {
  db.serialize(() => {
    // Create the 'pogs' table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS pogs (
        uid INTEGER PRIMARY KEY,
        serial TEXT,
        name TEXT NOT NULL,
        color TEXT,
        tags TEXT NOT NULL,
        lore TEXT,
        rank TEXT,
        creator TEXT,
        description TEXT,
        imageUrl TEXT
      )
    `);

    // Create the 'variations' table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS variations (
        uid INTEGER PRIMARY KEY,
        pog_id INTEGER NOT NULL,
        variation TEXT NOT NULL,
        FOREIGN KEY (pog_id) REFERENCES pogs (uid)
      )
    `);

    // Create the 'users' table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        fb_name TEXT NOT NULL,
        fb_id TEXT UNIQUE NOT NULL
      )
    `);
  });
}

function isAuthenticated(req, res, next) {
  if (req.session.user) {
      const tokenData = req.session.token;

      try {
          // Check if the token has expired
          const currentTime = Math.floor(Date.now() / 1000);
          if (tokenData.exp < currentTime) {
              throw new Error('Token has expired');
          }

          next();
      } catch (err) {
          res.redirect(`${FBJS_URL}/oauth?refreshToken=${tokenData.refreshToken}&redirectURL=${THIS_URL}`);
      }
  } else {
      res.redirect(`/login?redirectURL=${THIS_URL}`);
  }
}

// Route to render the index page
app.get('/', (req, res) => {
  // Fetch all pogs from the database
  db.all('SELECT * FROM pogs', (err, pogs) => {
    if (err) {
      return res.status(500).send(err.message);
    }

    // Render the index page with the fetched pogs and pass necessary data to the template
    res.render('index', {
      user: req.session.user,
      pogs: pogs,
      getBackgroundColor: getBackgroundColor, // Pass the function to the template
      ranks: darkMode ? darkRanks : lightRanks // Pass the ranks object to the template
    });
  });
});

// Route to handle theme preference
app.post('/setTheme', (req, res) => {
  darkMode = req.body.darkMode;
  res.sendStatus(200);
});

// Route to handle search request
app.post('/searchPogs', (req, res) => {
  const { id, name, serial, tags } = req.body;
  let query = 'SELECT * FROM pogs WHERE 1=1';
  let params = [];

  // Add conditions to the query based on the provided search parameters
  if (id) {
    query += ' AND uid = ?';
    params.push(id);
  }
  if (name) {
    query += ' AND name LIKE ?';
    params.push(`%${name}%`);
  }
  if (serial) {
    query += ' AND serial LIKE ?';
    params.push(`%${serial}%`);
  }
  if (tags) {
    query += ' AND tags LIKE ?';
    params.push(`%${tags}%`);
  }

  // Execute the query and return the results
  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    rows.forEach(row => {
      row.backgroundColor = getBackgroundColor(row.rank); // Add background color based on rank
    });
    res.json(rows);
  });
});

// Route to get all pogs with their tags using uid for uid tags
app.get('/api/pogs', (req, res) => {
  const sql = 'SELECT uid, serial, name, color, tags, rank FROM pogs';
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    console.log('Fetched pogs:', rows); // Log the fetched data
    res.json(rows);
  });
});
// Route to get all data about an individual pog
app.get('/api/pogs/:uid', (req, res) => {
  const uid = req.params.uid;
  db.get('SELECT * FROM pogs WHERE uid = ?', [uid], (err, row) => {
    if (err) {
        res.status(500).json({ error: err.message });
    } else {
        console.log('Fetched row:', row); // Debugging
        res.json(row);
    }
});
});

// Route to get all data about an individual pog, including variations
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
    console.log('Identifier matches serial number pattern, treating as serial');
  } else {
    return res.status(400).send('Invalid identifier format');
  }

  db.get(sql, params, (err, row) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(row);
  });
});

// Route to get all collections (tags)
app.get('/api/collections', (req, res) => {
  const sql = 'SELECT DISTINCT tags FROM pogs';
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(rows);
  });
});

// Route to get all pogs in a specific collection (tag)
app.get('/api/collections/:name', (req, res) => {
  const name = req.params.name;
  const sql = 'SELECT uid, name, color FROM pogs WHERE tags = ?';
  db.all(sql, [name], (err, rows) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(rows);
  });
});

// Route to log users in through Formbar Oauth
app.get('/login', (req, res) => {
  if (req.query.token) {
    let tokenData = jwt.decode(req.query.token);
    req.session.token = tokenData;
    req.session.user = tokenData.username;

    let fb_id = req.session.token.id;
    let fb_name = req.session.user;
    let query = `SELECT * FROM users WHERE fb_id = ?`;

    db.get(query, [fb_id], (err, row) => {
        if (err) {
            console.log(err);
            console.error(err);
            res.send("There was an error:\n" + err)
        } else if (row) {
            req.session.user = fb_name; // Ensure session is set
            console.log("User found in users, redirecting to catologue");
            res.redirect('/');
        } else {
            db.run(`INSERT INTO users(fb_name, fb_id) VALUES(?, ?)`, [fb_name, fb_id], (err) => {
                if (err) {
                    console.log(err);
                    console.error(err);
                    res.send("There was an error:\n" + err)
                } else {
                    req.session.user = fb_name; // Ensure session is set
                    console.log("User inserted into users, redirecting to catalogue");
                    res.redirect('/');
                }
            });
        }
    });
} else {
    res.redirect(`${AUTH_URL}?redirectURL=${THIS_URL}`);
}
});

// Start the server
// on port 3000
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});