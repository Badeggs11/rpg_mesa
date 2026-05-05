const { npcs } = require('../../../world/npcs');
const { dialogosNPC } = require('../../../world/dialogosNPC');

function definirNivelConfianca(confianca) {
  if (confianca <= 0) return 'baixa';
  if (confianca <= 3) return 'media';
  return 'alta';
}

function escolherFala(listaDeFalas) {
  if (!Array.isArray(listaDeFalas) || listaDeFalas.length === 0) {
    return 'O NPC observa você em silêncio.';
  }

  return listaDeFalas[0];
}

function identificarIntencao(falaJogador = '') {
  const fala = falaJogador.toLowerCase();

  if (
    fala.includes('aceito') ||
    fala.includes('quero sim') ||
    fala === 'sim' ||
    fala.includes('pode ser') ||
    fala.includes('eu quero') ||
    fala.includes('quero as sobras') ||
    fala.includes('quero o que tiver') ||
    fala.includes('pode me dar')
  ) {
    return 'aceitar_comida';
  }

  if (
    fala.includes('comida') ||
    fala.includes('comer') ||
    fala.includes('fome') ||
    fala.includes('pão') ||
    fala.includes('sobras')
  ) {
    return 'pedir_comida';
  }

  if (
    fala.includes('trabalho') ||
    fala.includes('serviço') ||
    fala.includes('emprego') ||
    fala.includes('dinheiro') ||
    fala.includes('pagar')
  ) {
    return 'pedir_trabalho';
  }

  if (
    fala.includes('informação') ||
    fala.includes('sabe') ||
    fala.includes('ouviu') ||
    fala.includes('boato') ||
    fala.includes('rumor') ||
    fala.includes('acontecendo')
  ) {
    return 'pedir_informacao';
  }

  if (
    fala.includes('olá') ||
    fala.includes('oi') ||
    fala.includes('bom dia') ||
    fala.includes('boa tarde') ||
    fala.includes('boa noite')
  ) {
    return 'cumprimento';
  }

  if (
    fala.includes('tchau') ||
    fala.includes('adeus') ||
    fala.includes('até mais') ||
    fala.includes('vou embora')
  ) {
    return 'despedida';
  }

  return 'nao_entendi';
}

function garantirMemoriaJogador(jogador) {
  if (!jogador.memoria) {
    jogador.memoria = {
      background: '',
      eventos: [],
      conhecimentos: [],
      relacoes: {},
    };
  }

  if (!jogador.memoria.eventos) jogador.memoria.eventos = [];
  if (!jogador.memoria.conhecimentos) jogador.memoria.conhecimentos = [];
  if (!jogador.memoria.relacoes) jogador.memoria.relacoes = {};
}

function conversarComNPC(estadoCampanha, jogadorId, npcId, falaJogador = '') {
  const jogador = estadoCampanha.jogadores.find(j => j.id === jogadorId);

  if (!jogador) {
    throw new Error('Jogador não encontrado');
  }

  const npc = npcs[npcId];

  if (!npc) {
    throw new Error(`NPC não encontrado: ${npcId}`);
  }

  garantirMemoriaJogador(jogador);

  if (!jogador.memoria.relacoes[npcId]) {
    jogador.memoria.relacoes[npcId] = { confianca: 0 };
  }

  const relacao = jogador.memoria.relacoes[npcId];
  const nivelConfianca = definirNivelConfianca(relacao.confianca);

  const dialogos = dialogosNPC[npcId];

  let falaNPC = '';

  if (falaJogador && falaJogador.trim().length > 0) {
    const intencao = identificarIntencao(falaJogador);

    console.log('INTENCAO DETECTADA:', intencao); // debug

    falaNPC =
      dialogos?.respostasPorIntencao?.[intencao]?.[nivelConfianca] ||
      dialogos?.respostasPorIntencao?.nao_entendi?.[nivelConfianca] ||
      'O NPC não parece entender o que você quis dizer.';
  } else {
    const falasDisponiveis = dialogos?.falasPorConfianca?.[nivelConfianca];
    falaNPC = escolherFala(falasDisponiveis);
  }

  relacao.confianca += 1;

  const descricao = falaJogador
    ? `${jogador.nome} disse para ${npc.nome}: "${falaJogador}". ${falaNPC}`
    : `${jogador.nome} aborda ${npc.nome}. ${falaNPC}`;

  jogador.memoria.eventos.push({
    tipo: 'conversa',
    com: npcId,
    npcNome: npc.nome,
    falaJogador,
    falaNPC,
    descricao,
    rodada: estadoCampanha.rodadaGlobal ?? 0,
  });

  return {
    npc,
    fala: falaNPC,
    falaNPC,
    falaJogador,
    descricao,
    relacao,
  };
}

module.exports = {
  conversarComNPC,
};
