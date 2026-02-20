function registrarAcaoJogador(estado, acao) {
  if (!estado) return estado;

  const jogadorAtualId = estado.ciclo?.jogadorDaVez;
  if (!jogadorAtualId) return estado;

  // Inicializa estruturas essenciais
  if (!estado.historicoAcoes) {
    estado.historicoAcoes = [];
  }

  if (!estado.logMundo) {
    estado.logMundo = [];
  }

  if (!estado.cooldowns) {
    estado.cooldowns = {};
  }

  const agora = Date.now();
  const ultimo = estado.cooldowns[jogadorAtualId] || 0;

  // 🧱 Cooldown sistêmico (anti-spam de input)
  if (agora - ultimo < 500) {
    return estado;
  }

  // Atualiza cooldown corretamente por jogador
  estado.cooldowns[jogadorAtualId] = agora;

  // Registra ação no histórico macro da campanha
  estado.historicoAcoes.push({
    tipo: 'acao_jogador',
    jogadorId: jogadorAtualId,
    acao: acao?.tipo || 'acao_desconhecida',
    rodada: estado.rodadaGlobal,
    timestamp: agora,
  });

  // Log narrativo do mundo (macro)
  estado.logMundo.push({
    tipo: 'acao_registrada',
    descricao: `Jogador ${jogadorAtualId} realizou a ação: ${
      acao?.tipo || 'desconhecida'
    }`,
    rodada: estado.rodadaGlobal,
  });

  return estado;
}

module.exports = registrarAcaoJogador;
