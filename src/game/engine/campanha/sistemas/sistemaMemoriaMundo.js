function sistemaMemoriaMundo(estado) {
  if (!estado) return estado;

  // Inicializa memória do mundo se não existir
  if (!estado.memoriaMundo) {
    estado.memoriaMundo = {
      linhaDoTempo: [],
      regioesDescobertas: [],
      eventosHistoricos: [],
      perfisRegistrados: [],
    };
  }

  if (!estado.logMundo) return estado;

  const rodada = estado.rodadaGlobal;
  const memoria = estado.memoriaMundo;

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

    // 🗺 Registrar regiões descobertas (memória geográfica do mundo)
    if (evento.tipo === 'novo_local_descoberto' && evento.local) {
      if (!memoria.regioesDescobertas.includes(evento.local)) {
        memoria.regioesDescobertas.push(evento.local);
      }
    }

    // 🧠 Registrar evolução do perfil do jogador (memória comportamental)
    if (evento.tipo === 'perfil_jogador_atualizado') {
      memoria.perfisRegistrados.push({
        rodada,
        tendencia: estado.perfilMundo?.tendencia || 'desconhecida',
      });
    }
  });

  // 🕰 Registrar linha do tempo do mundo (uma entrada por rodada)
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
