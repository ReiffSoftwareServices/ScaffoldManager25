const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();
const port = 3000;

// Serve static files from the public directory
app.use(express.static('public'));
app.use(express.json());

// Create SQLite database connection
const db = new sqlite3.Database('scaffold.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS scaffolds (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            location TEXT,
            status TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Gerüstanmeldungen Tabelle
    db.run(`CREATE TABLE IF NOT EXISTS geruest_anmeldungen (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        foto_url TEXT,
        anmelder_id INTEGER,
        bereich TEXT,
        anlage TEXT,
        ebene TEXT,
        oertlichkeit TEXT,
        koordinate TEXT,
        notiz1 TEXT,
        notiz2 TEXT,
        length FLOAT,
        width FLOAT,
        height FLOAT,
        volume FLOAT,
        anmelde_datum DATE,
        aufbau_datum DATE,
        status TEXT DEFAULT 'Neu',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
}

// Basic API endpoints
app.get('/api/scaffolds', (req, res) => {
    db.all('SELECT * FROM scaffolds', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Foto-Upload Endpoint
app.post('/api/upload-foto', upload.single('foto'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Kein Foto hochgeladen' });
    }
    res.json({ 
        success: true, 
        foto_url: req.file.path 
    });
});

// Gerüstanmeldung Endpoint
app.post('/api/geruest-anmeldung', (req, res) => {
    const anmeldung = req.body;
    
    // Validierung der Pflichtfelder
    const requiredFields = ['anmelder_id', 'bereich', 'anlage', 'oertlichkeit', 'aufbau_datum'];
    const missingFields = requiredFields.filter(field => !anmeldung[field]);
    
    if (missingFields.length > 0) {
        return res.status(400).json({ 
            error: 'Pflichtfelder fehlen', 
            fields: missingFields 
        });
    }

    // SQL Insert
    db.run(`INSERT INTO geruest_anmeldungen (
        foto_url, anmelder_id, bereich, anlage,
        ebene, oertlichkeit, koordinate, notiz1, notiz2,
        length, width, height, volume,
        anmelde_datum, aufbau_datum, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
        anmeldung.foto_url,
        anmeldung.anmelder_id,
        anmeldung.bereich,
        anmeldung.anlage,
        anmeldung.ebene,
        anmeldung.oertlichkeit,
        anmeldung.koordinate,
        anmeldung.notiz1,
        anmeldung.notiz2,
        anmeldung.length,
        anmeldung.width,
        anmeldung.height,
        anmeldung.volume,
        new Date().toISOString().split('T')[0],
        anmeldung.aufbau_datum,
        'Neu'
    ], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ 
            success: true, 
            id: this.lastID,
            message: 'Gerüstanmeldung erfolgreich gespeichert' 
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 