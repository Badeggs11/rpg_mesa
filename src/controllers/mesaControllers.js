const mesasService = require("../services/mesasService");

module.exports = {

    async listar(req, res) {
        try {
            const lista = await mesasService.listar();
            return res.json(lista);
        } catch (erro) {
            return res.status(500).json({ erro: "Erro ao listar mesas" })
        }
    },
    async criar(req, res) {
        try {
            const { nome, descricao, criador_id } = req.body;
            const novaMesa = await mesasService.criar({ nome, descricao, criador_id});
            return res.status(201).json(novaMesa);
            
        } catch (erro) {
            return res.status(500).json({ erro: "Erro ao criar a mesa "});
        }
    },
    async atualizar(req, res) {
        try {
            const id = req.params.id;
            const { nome, descricao, status } = req.body;

            const mesa = await mesasService.atualizar(id, { nome, descricao, status});
            return res.json(mesa);

        } catch (erro) {
            return res.status(500).json({ erro: "Erro ao atualizar a mesa" });
        }
    },
    async remover(req, res) {
        try {
            const id = req.params.id;
            await mesasService.remover(id);
            return res.json({ mensagem: "Mesa removida "});
        } catch {
            return res.status(500).json({ erro: "Erro ao remover a mesa" });
        }
    }

};
