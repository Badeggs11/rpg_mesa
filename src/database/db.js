const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho correto: sobe uma pasta a partir de /src/database
const dbPath = path.join(__dirname, '..', 'rpg.db');

const db = new sqlite3.Database(dbPath, err => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err);
  } else {
    console.log('Banco SQLite conectado com sucesso em:', dbPath);
  }
});

db.serialize(() => {
  db.run(`
        CREATE TABLE IF NOT EXISTS personagens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            pontosDeVida INTEGER,
            stamina INTEGER DEFAULT O,
            percepcao INTEGER DEFAULT 0,
            forca INTEGER,
            resistencia INTEGER,
            agilidade INTEGER,
            inteligencia INTEGER
            
        )
        
    `);
  db.run(
    `
  ALTER TABLE personagens ADD COLUMN stamina INTEGER DEFAULT 0
`,
    err => {
      if (err && !err.message.includes('duplicate column')) {
        console.error('Erro ao adicionar coluna stamina:', err.message);
      }
    }
  );

  db.run(
    `
  ALTER TABLE personagens ADD COLUMN percepcao INTEGER DEFAULT 0
`,
    err => {
      if (err && !err.message.includes('duplicate column')) {
        console.error('Erro ao adicionar coluna percepcao:', err.message);
      }
    }
  );

  db.run(`CREATE TABLE IF NOT EXISTS mesas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            descricao TEXT,
            criador_id INTEGER,
            status TEXT DEFAULT 'aberta',
            criado_em TEXT DEFAULT CURRENT_TIMESTAMP)
    `);
  db.run(`
        CREATE TABLE IF NOT EXISTS mesa_personagens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mesa_id INTEGER,
            personagem_id INTEGER,
            papel TEXT DEFAULT 'jogador',
            entrando_em TEXT DEFAULT CURRENT_TIMESTAMP,
            
            FOREIGN KEY (mesa_id) REFERENCES mesas(id),
            FOREIGN KEY (personagem_id) REFERENCES personagens(id)
            )
    `);
});

module.exports = db;
