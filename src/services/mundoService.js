const { mapaBase } = require('../game/world/mapas/mapaBase');
const { lugaresDetalhados } = require('../game/world/lugaresDetalhados');
const { sentimentos } = require('../game/world/sentimentos');
const { desejos } = require('../game/world/desejos');
const { efeitos } = require('../game/world/efeitos');

function obterMapa() {
  return mapaBase;
}

function obterLugarDetalhado(localId) {
  const lugar = lugaresDetalhados[localId];

  if (!lugar) {
    throw new Error(`Lugar detalhado não encontrado: ${localId}`);
  }

  return lugar;
}

function obterSentimento(sentimentoId) {
  const sentimento = sentimentos[sentimentoId];

  if (!sentimento) {
    throw new Error(`Sentimento não encontrado: ${sentimentoId}`);
  }

  return sentimento;
}

function obterDesejo(desejoId, fomeAtual = 12) {
  const desejo = desejos[desejoId];

  if (!desejo) {
    throw new Error(`Desejo não encontrado: ${desejoId}`);
  }

  let desejoCalculado = {
    id: desejo.id,
    nome: desejo.nome,
    sentimentoOrigem: desejo.sentimentoOrigem,
    descricao: desejo.descricao,
  };

  if (desejo.id === 'quero_comer') {
    const fomeMaxima = 24;
    const faltaDeComida = fomeMaxima - Number(fomeAtual);

    let intensidade = 'baixa';

    if (faltaDeComida > 6 && faltaDeComida <= 12) {
      intensidade = 'moderada';
    } else if (faltaDeComida > 12 && faltaDeComida <= 18) {
      intensidade = 'alta';
    } else if (faltaDeComida > 18) {
      intensidade = 'crítica';
    }

    desejoCalculado = {
      ...desejoCalculado,
      fomeAtual: Number(fomeAtual),
      quantidadeNecessaria: Math.max(0, faltaDeComida),
      intensidade,
    };
  }

  return desejoCalculado;
}

function obterEfeito(efeitoId, dados = {}) {
  const efeito = efeitos[efeitoId];

  if (!efeito) {
    throw new Error(`Efeito não encontrado: ${efeitoId}`);
  }

  const fomeAtual = Number(dados.fomeAtual ?? 12);

  const jogador = {
    forca: Number(dados.forca ?? 0),
    agilidade: Number(dados.agilidade ?? 0),
    resistencia: Number(dados.resistencia ?? 0),
    percepcao: Number(dados.percepcao ?? 0),
    percepcaoVisual: Number(dados.percepcaoVisual ?? 0),
    inteligencia: Number(dados.inteligencia ?? 0),
    stamina: Number(dados.stamina ?? 0),
  };

  const resultado = efeito.aplicarEfeito(jogador, fomeAtual);

  return {
    tipo: efeitoId,
    fomeAtual,
    penalidade: resultado.penalidade,
    atributosAfetados: resultado.atributosAfetados,
  };
}

module.exports = {
  obterMapa,
  obterLugarDetalhado,
  obterSentimento,
  obterDesejo,
  obterEfeito,
};
