function iniciarTempoRodada(estado) {
  if (!estado.tempoRodada) {
    estado.tempoRodada = {};
  }

  estado.tempoRodada.inicioTimestamp = Date.now();
  estado.tempoRodada.limiteMs = 180000; // 3 minutos

  if (!estado.logMundo) {
    estado.logMundo = [];
  }

  estado.logMundo.push({
    tipo: 'tempo_rodada_iniciado',
    rodada: estado.rodadaGlobal,
    descricao: 'O relógio da rodada foi iniciado (limite de 3 minutos).',
  });

  return estado;
}

function tempoRodadaEsgotado(estado) {
  if (!estado.tempoRodada?.inicioTimestamp) return false;

  const agora = Date.now();
  const decorrido = agora - estado.tempoRodada.inicioTimestamp;

  return decorrido >= estado.tempoRodada.limiteMs;
}

module.exports = {
  iniciarTempoRodada,
  tempoRodadaEsgotado,
};
