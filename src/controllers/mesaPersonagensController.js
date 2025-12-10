const mesaPersonagensService = require("../services/mesaPersonagensService");

module.exports = {
    async adicionar(req, res) {
        try {
            const {mesa_id, personagem_id, papel } = req.body;
            const novo = await mesaPersonagensService.adicionar( {
                mesa_id,
                personagem_id,
                papel
            });
            return res.status(201).json(novo);

        } catch (erro) {
            console.error(" Erro ao adicionar o personagem na mesa", erro);
            return res.status(500).json({
                erro: "Erro ao adicionar personagem na mesa"
            });
        }
    },
    async listarPorMesa(req, res) {
        try {
            const mesa_id = req.params.mesa_id;
            const lista = await mesaPersonagensService.listarPorMesa(mesa_id);
            return res.json(lista);
        } catch (erro) {
            console.error("Erro ao listar personagens da mesa", erro);
            return res.status(500).json({
                erro: "Erro ao listar personagens da mesa"
            });
        }
    },
    async remover(req, res) {
        try {
            const id = req.params.id;
            const resposta = await mesaPersonagensService.remover(id);
            return res.json(resposta);
        } catch (erro) {
            console.error("Erro ao remover personagem da mesa", erro);
            return res.status(500).json({
                erro: "Erro ao remover personagem da mesa"
            });
        }
    }
};