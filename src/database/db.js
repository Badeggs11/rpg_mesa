const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Caminho correto: sobe uma pasta a partir de /src/database
const dbPath = path.join(__dirname, "..", "rpg.db");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco:", err);
    } else {
        console.log("Banco SQLite conectado com sucesso em:", dbPath);
    }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS personagens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            forca INTEGER,
            agilidade INTEGER,
            inteligencia INTEGER
        )
        
    `);
    db.run(`CREATE TABLE IF NOT EXISTS mesas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            descricao TEXT,
            criador_id INTEGER,
            status TEXT DEFAULT 'aberta',
            criado_em TEXT DEFAULT CURRENT_TIMESTAMP)
    `);
});

module.exports = db;
