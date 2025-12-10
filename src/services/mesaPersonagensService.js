const db = require("../database/db");

module.exports = {
    adicionar({ mesa_id, personagem_id, papel }) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO mesa_personagens (mesa_id, personagem_id, papel)
                VALUES (?, ?, ?)
            `;
            db.run(
                query,
                [mesa_id, personagem_id, papel || "jogador"],
                function (err) {
                    if (err) return reject (err);

                    resolve({
                        id: this.lastID,
                        mesa_id,
                        personagem_id,
                        papel: papel || "jogador"
                    });
                }
            );
        });
    },
    listarPorMesa(mesa_id) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT mp.id, mp.papel, p.*
                FROM mesa_personagens mp
                JOIN personagens p ON p.id = mp.personagem_id
                WHERE mp.mesa_id = ? 
            `;
            db.all(query, [mesa_id], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    remover(id) {
        return new Promise((resolve, reject) => {
            const query = `
                DELETE FROM mesa_personagens
                WHERE id = ?
            `;
            db.run(query, [id], function (err) {
                if (err) return reject(err);
                resolve({ sucesso: true });
            });

        });
    }
};