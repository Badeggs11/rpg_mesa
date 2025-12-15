const db = require("../database/db");

module.exports = {
  listar() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM personagens", (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },
  criar({ nome, forca, inteligencia, agilidade }) {
    return new Promise((resolve, reject) => {
      const query = `
            INSERT INTO personagens (nome, pontosDeVida, forca, resistencia, agilidade, inteligencia)
            VALUES (?, ?, ?, ?, ?, ?)
            `;
      db.run(
        query,
        [
          nome,
          pontosDeVida || 100,
          forca || 0,
          resistencia || 0,
          agilidade || 0,
          inteligencia || 0,
        ],
        function (err) {
          if (err) return reject(err);

          resolve({
            id: this.lastID,
            nome,
            pontosDeVida: pontosDeVida || 100,
            forca: forca || 0,
            resistencia: resistencia || 0,
            agilidade: agilidade || 0,
            inteligencia: inteligencia || 0,
          });
        }
      );
    });
  },
  atualizar(
    id,
    { nome, pontosDeVida, forca, resistencia, agilidade, inteligencia }
  ) {
    return new Promise((resolve, reject) => {
      const query = `
                UPDATE personagens
                SET nome = ?, pontosDeVida = ?, forca = ?, resistencia = ?, agilidade = ?, inteligencia = ?
                WHERE id = ?
                `;
      db.run(
        query,
        [nome, pontosDeVida, forca, resistencia, agilidade, inteligencia, id],
        function (err) {
          if (err) return reject(err);

          resolve({
            id,
            nome,
            forca,
            agilidade,
            inteligencia,
          });
        }
      );
    });
  },
  remover(id) {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM personagens WHERE id = ?`;
      db.run(query, [id], function (err) {
        if (err) return reject(err);
        resolve({ sucessoMeuFilho: true });
      });
    });
  },
};
