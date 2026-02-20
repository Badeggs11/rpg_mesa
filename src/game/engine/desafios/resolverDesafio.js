const { jogarDado } = require('../../dice');

function resolverDesafio(desafio) {
  let sucessos = 0;
  const rolagens = [];

  for (let i = 0; i < desafio.testes; i++) {
    const r = jogarDado(desafio.dado);
    rolagens.push(r);
    if (r >= desafio.dificuldade) {
      sucessos++;
    }
  }
  return {
    tipo: 'resultadoDesafio',
    nome: desafio.nome,
    sucesso: sucessos > 0,
    sucessos,
    rolagens,
    dificuldade: desafio.dificuldade,
    descricao: desafio.descricao,
  };
}

module.exports = { resolverDesafio };
