// src/game/engine/narrativa/mestreIA.js

import { narrativePackBase } from './narrativePackBase.js';

export function gerarNarrativa(estadoCampanha, resultadoRodada = {}) {
  if (!estadoCampanha) {
    return {
      narracao: 'O mundo permanece em silêncio.',
      rodada: 0,
    };
  }

  // 🧠 Leitura DEFENSIVA da tensão (compatível com sua arquitetura macro)
  const tensao =
    estadoCampanha?.reacaoMundo?.nivelTensaoGlobal ??
    estadoCampanha?.mundo?.perfilMundo?.tensaoGlobal ??
    0;

  let tomAmbiente = '';

  if (tensao < 3) {
    tomAmbiente = pick(narrativePackBase.ambiente.tensao_baixa);
  } else if (tensao < 7) {
    tomAmbiente = pick(narrativePackBase.ambiente.tensao_media);
  } else {
    tomAmbiente = pick(narrativePackBase.ambiente.tensao_alta);
  }

  // 🔍 Integração com memória do mundo (SEU sistema já existente)
  const memoria = estadoCampanha?.mundo?.memoriaMundo;
  const eventosRecentes = memoria?.eventosHistoricos?.slice(-1) || [];

  let contextoMemoria = '';
  if (eventosRecentes.length > 0) {
    contextoMemoria =
      'Os ecos de eventos passados ainda influenciam o presente.';
  }

  const ultimaDescoberta = resultadoRodada?.descoberta || 'nenhuma';

  const textoDescoberta = narrativePackBase.descoberta[ultimaDescoberta]
    ? pick(narrativePackBase.descoberta[ultimaDescoberta])
    : '';

  const narrativaFinal =
    `${tomAmbiente} ${textoDescoberta} ${contextoMemoria}`.trim();

  return {
    narracao: narrativaFinal,
    rodada: estadoCampanha.rodadaGlobal,
    metadados: {
      tensao,
      temMemoriaHistorica: eventosRecentes.length > 0,
    },
  };
}

function pick(lista) {
  if (!Array.isArray(lista) || lista.length === 0) return '';
  return lista[Math.floor(Math.random() * lista.length)];
}
