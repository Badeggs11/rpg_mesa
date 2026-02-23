function sistemaMemoriaMundo(estado) {
  if (!estado) return estado;

  // 🧠 Inicialização DEFENSIVA (engine sandbox robusta)
  if (!estado.memoriaMundo) {
    estado.memoriaMundo = {};
  }

  const memoria = estado.memoriaMundo;

  if (!Array.isArray(memoria.linhaDoTempo)) {
    memoria.linhaDoTempo = [];
  }

  if (!Array.isArray(memoria.regioesDescobertas)) {
    memoria.regioesDescobertas = [];
  }

  if (!Array.isArray(memoria.eventosHistoricos)) {
    memoria.eventosHistoricos = [];
  }

  if (!Array.isArray(memoria.perfisRegistrados)) {
    memoria.perfisRegistrados = [];
  }

  // 🔥 LINHA NOVA (CRÍTICA para seu sistema híbrido)
  if (!Array.isArray(memoria.regioesHostis)) {
    memoria.regioesHostis = [];
  }

  if (!estado.logMundo) return estado;

  const rodada = estado.rodadaGlobal;

  // 🔍 Varre o log do mundo e transforma em memória persistente
  estado.logMundo.forEach(evento => {
    if (!evento || !evento.tipo) return;

    // 📜 Registrar eventos históricos importantes
    if (evento.tipo === 'evento_dinamico') {
      const jaExiste = memoria.eventosHistoricos.some(
        e => e.eventoId === evento.eventoId
      );

      if (!jaExiste) {
        memoria.eventosHistoricos.push({
          eventoId: evento.eventoId,
          rodada,
          descricao: evento.descricao,
        });
      }
    }

    // 🗺 Registrar regiões descobertas
    if (evento.tipo === 'novo_local_descoberto' && evento.local) {
      if (!memoria.regioesDescobertas.includes(evento.local)) {
        memoria.regioesDescobertas.push(evento.local);
      }
    }

    // 🧠 Registrar perfil comportamental
    if (evento.tipo === 'perfil_jogador_atualizado') {
      memoria.perfisRegistrados.push({
        rodada,
        tendencia: estado.perfilMundo?.tendencia || 'desconhecida',
      });
    }
  });

  // 🕰 Linha do tempo do mundo
  const jaRegistrouRodada = memoria.linhaDoTempo.some(r => r.rodada === rodada);

  if (!jaRegistrouRodada) {
    memoria.linhaDoTempo.push({
      rodada,
      resumo: `Rodada ${rodada}: o mundo evoluiu com base nas ações dos jogadores.`,
    });
  }

  return estado;
}

module.exports = sistemaMemoriaMundo;
