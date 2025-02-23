// Gerüstanmeldung Tabelle
const geruest_anmeldungen = {
    tableName: 'geruest_anmeldungen',
    columns: {
        id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
        foto_url: 'TEXT',
        anmelder_id: 'INTEGER',
        equipment_id: 'INTEGER',
        bereich: 'TEXT',
        anlage: 'TEXT',
        ebene: 'TEXT',
        oertlichkeit: 'TEXT',
        koordinate: 'TEXT',
        notiz1: 'TEXT',
        notiz2: 'TEXT',
        length: 'FLOAT',
        width: 'FLOAT',
        height: 'FLOAT',
        volume: 'FLOAT',
        anmelde_datum: 'DATE',
        aufbau_datum: 'DATE',
        status: 'TEXT DEFAULT "Neu"',
        created_at: 'DATETIME DEFAULT CURRENT_TIMESTAMP'
    }
};

db.run(`CREATE TABLE IF NOT EXISTS ${geruest_anmeldungen.tableName} (
    ${Object.entries(geruest_anmeldungen.columns).map(([column, type]) => `${column} ${type}`).join(', ')}
)`); 