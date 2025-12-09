const db = require("../database/db");

module.exports = {
    listar() {
        return new Promise((resolve, reject) => {
            const query = `
            SELECT * FROM mesas`;
            db.all(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    criar({ nome, descricao, criador_id }) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO mesas (nome, descricao, criador_id)
                VALUES (?, ?, ?)
            `;
            db.run(query, [nome, descricao, criador_id], function(err) {
                if (err) return reject (err);
                resolve({
                    id: this.lastID,
                    nome,
                    descricao,
                    criador_id,
                    status: "aberta"
                });
            });

        });
    },
    atualizar(id, { nome, descricao, status }) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE mesas
                SET nome = ?, descricao = ?, status = ?
                WHERE id = ?
            `;
            db.run(query, [nome, descricao, status], function (err) {
                if (err) return reject(err);
                resolve( {
                    id,
                    nome,
                    descricao,
                    status
                });
            });
        });
    },
    remover(id) {
        return new Promise((resolve, reject) => {
            const query = `
                DELETE FROM mesas
                WHERE id = ?
            `;
            db.run(query, [id], function(err) {
                if (err) return reject(err);
                resolve({ sucesso: true });
            });

        });
    }

};