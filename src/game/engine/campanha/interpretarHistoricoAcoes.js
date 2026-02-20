function interpretarHistoricoAcoes(estado) {
  if (!estado) return estado;

  const historico = estado.historicoAcoes || [];

  if (historico.length === 0) {
    return estado; // nada para interpretar ainda
  }

  // 🧠 Contadores de comportamento
  let exploracoes = 0;
  let descansos = 0;
  let investigacoes = 0;
  let combates = 0;

  for (const acao of historico) {
    switch (acao.acao) {
      case 'explorar_local':
        exploracoes++;
        break;
      case 'descansar':
        descansos++;
        break;
      case 'investigar':
        investigacoes++;
        break;
      case 'entrar_combate':
        combates++;
        break;
      default:
        break;
    }
  }

  // 🌍 Inicializa perfil do jogador no estado (sandbox core)
  if (!estado.perfilMundo) {
    estado.perfilMundo = {
      tendencia: 'neutra',
      resumoComportamento: {},
    };
  }

  estado.perfilMundo.resumoComportamento = {
    exploracoes,
    descansos,
    investigacoes,
    combates,
  };

  // 🎭 Interpretação narrativa do comportamento
  let novaTendencia = 'neutra';

  if (exploracoes > descansos && exploracoes > investigacoes) {
    novaTendencia = 'explorador';
  } else if (investigacoes > exploracoes) {
    novaTendencia = 'investigador';
  } else if (combates > exploracoes && combates > descansos) {
    novaTendencia = 'agressivo';
  } else if (descansos > exploracoes && descansos > combates) {
    novaTendencia = 'cauteloso';
  }

  // 📜 Só registra log se a tendência mudou (evita spam)
  if (estado.perfilMundo.tendencia !== novaTendencia) {
    estado.perfilMundo.tendencia = novaTendencia;

    estado.logMundo.push({
      tipo: 'perfil_jogador_atualizado',
      rodada: estado.rodadaGlobal,
      descricao: `O mundo percebe que o jogador possui uma tendência ${novaTendencia}.`,
    });
  }

  return estado;
}

module.exports = interpretarHistoricoAcoes;
