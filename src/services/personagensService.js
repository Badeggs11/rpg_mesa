const db = require('../database/db');

module.exports = {
  buscarPorId(id) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT *
        FROM personagens
        WHERE id = ?
        `;
      db.get(query, [id], (err, row) => {
        if (err) return reject(err);
        if (!row) return reject(new Error('Personagem não encontrado'));
        resolve(row);
      });
    });
  },
  listar() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM personagens', (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },
  criar({
    nome,
    vida = 100,
    forca = 10,
    resistencia = 10,
    agilidade = 10,
    inteligencia = 10,
  }) {
    return new Promise((resolve, reject) => {
      const query = `
            INSERT INTO personagens (nome, pontosDeVida, forca, resistencia, agilidade, inteligencia)
            VALUES (?, ?, ?, ?, ?, ?)
            `;
      db.run(
        query,
        [nome, vida, forca, resistencia, agilidade, inteligencia],
        function (err) {
          if (err) return reject(err);

          resolve({
            id: this.lastID,
            nome,
            vida: vida,
            forca: forca,
            resistencia: resistencia,
            agilidade: agilidade,
            inteligencia: inteligencia,
          });
        }
      );
    });
  },
  atualizar(id, { nome, vida, forca, resistencia, agilidade, inteligencia }) {
    return new Promise((resolve, reject) => {
      const query = `
                UPDATE personagens
                SET nome = ?, pontosDeVida = ?, forca = ?, resistencia = ?, agilidade = ?, inteligencia = ?
                WHERE id = ?
                `;
      db.run(
        query,
        [nome, vida, forca, resistencia, agilidade, inteligencia, id],
        function (err) {
          if (err) return reject(err);

          resolve({
            id,
            nome,
            vida,
            forca,
            resistencia,
            agilidade,
            inteligencia,
          });
        }
      );
    });
  },
  atualizarVida(id, vida) {
    return new Promise((resolve, reject) => {
      const query = `
      UPDATE personagens
      SET vida = ?
      WHERE id = ?
    `;

      db.run(query, [vida, id], function (err) {
        if (err) return reject(err);
        resolve({ sucesso: true });
      });
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
