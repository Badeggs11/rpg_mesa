const personagensService = require('../services/personagensService');

module.exports = {
  async listar(req, res) {
    try {
      const lista = await personagensService.listar();
      return res.json(lista);
    } catch (erro) {
      console.error('Erro ao listar personagens:', erro);
      return res.status(500).json({ erro: 'Erro ao listar personagens' });
    }
  },

  async criar(req, res) {
    try {
      const { nome, vida, forca, resistencia, agilidade, inteligencia } =
        req.body;

      const novo = await personagensService.criar({
        nome,
        vida,
        forca,
        resistencia,
        agilidade,
        inteligencia,
      });

      return res.status(201).json(novo);
    } catch (erro) {
      console.error('Erro ao criar personagem:', erro);
      return res.status(500).json({ erro: 'Erro ao criar personagem' });
    }
  },

  async atualizar(req, res) {
    try {
      const id = req.params.id;
      const {
        nome,
        vida,
        stamina,
        percepcao,
        forca,
        resistencia,
        agilidade,
        inteligencia,
      } = req.body;

      const atualizado = await personagensService.atualizar(id, {
        nome,
        vida,
        stamina,
        percepcao,
        forca,
        resistencia,
        agilidade,
        inteligencia,
      });

      return res.json(atualizado);
    } catch (erro) {
      console.error('Erro ao atualizar personagem:', erro);
      return res.status(500).json({ erro: 'Erro ao atualizar personagem' });
    }
  },

  async remover(req, res) {
    try {
      const id = req.params.id;

      await personagensService.remover(id);

      return res.json({ mensagem: 'Personagem removido' });
    } catch (erro) {
      console.error('Erro ao remover personagem:', erro);
      return res.status(500).json({ erro: 'Erro ao remover personagem' });
    }
  },
};
