const { mapaBase } = require('../../../world/mapas/mapaBase');

function explorarLocal(estadoCampanha, jogadorId) {
  if (!estadoCampanha.exploracao[jogadorId]) {
    estadoCampanha.exploracao[jogadorId] = {
      locaisDescobertos: [],
      locaisVisitados: [],
      nevoaDeGuerraAtiva: true,
    };
  }

  const localAtual = estadoCampanha.mapa.localAtual;

  const conexoes = mapaBase[localAtual].conexoes || [];

  const exploracaoJogador = estadoCampanha.exploracao[jogadorId];

  conexoes.forEach(local => {
    if (!exploracaoJogador.locaisDescobertos.includes(local)) {
      exploracaoJogador.locaisDescobertos.push(local);
    }
  });
}

module.exports = {
  explorarLocal,
};
