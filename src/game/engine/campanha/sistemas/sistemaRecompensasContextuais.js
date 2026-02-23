// 🎁 sistemaRecompensasContextuais.js
// Gera recompensas baseadas em desafios/pressões enfrentadas.
// Engine pura: só cria recompensasPendentes (fila), não aplica em DB.

function garantirEstruturas(estado) {
  if (!estado.recompensasPendentes) estado.recompensasPendentes = [];
  if (!estado.logMundo) estado.logMundo = [];
  if (!estado.eventosDisparados) estado.eventosDisparados = [];
}

function jaGerouRecompensa(estado, chaveUnica) {
  return estado.recompensasPendentes.some(r => r.chaveUnica === chaveUnica);
}

function montarRecompensaPorDesafio(desafio, estado) {
  // Você pode expandir isso depois com tabelas do "mundo"
  // (ex: arquivos JSON por mundo).
  const base = {
    origem: 'mundo_sistemico',
    rodada: estado.rodadaGlobal,
    desafioId: desafio.id,
    opcional: true,
  };

  // Recompensas por categoria/subtipo
  if (desafio.subtipo === 'ambiente_hostil') {
    return {
      ...base,
      tipo: 'atributo',
      atributo: 'resistencia',
      valor: 1,
      motivo: 'Sobreviveu a condições hostis do mundo.',
    };
  }

  if (desafio.subtipo === 'ermitão') {
    return {
      ...base,
      tipo: 'atributo',
      atributo: 'percepcao',
      valor: 1,
      motivo: 'Aprendeu algo raro com um ermitão.',
    };
  }

  if (desafio.subtipo === 'charada_antiga') {
    return {
      ...base,
      tipo: 'atributo',
      atributo: 'inteligencia',
      valor: 1,
      motivo: 'Resolveu um desafio intelectual antigo.',
    };
  }

  // fallback (caso apareça algo novo)
  return {
    ...base,
    tipo: 'recurso',
    recurso: 'suprimentos',
    valor: 1,
    motivo: 'O mundo ofereceu uma pequena vantagem.',
  };
}

/**
 * Quando gerar recompensa?
 * - Exemplo simples agora: se a pressão ambiental está ativa e o jogador
 *   sobreviveu ao "tick" de rodada (ou seja, chegou ao final do processamento),
 *   gera 1 recompensa contextual.
 *
 * Depois você pode amarrar isso a:
 * - "fugiu para região segura"
 * - "venceu combate"
 * - "resolveu desafio"
 */
function sistemaRecompensasContextuais(estado) {
  if (!estado) return estado;
  garantirEstruturas(estado);

  const desafio = estado.eventoDramaticoAtivo;
  if (!desafio || desafio.categoria !== 'desafio') return estado;

  // Só gera recompensa se o desafio estiver ATIVO (pressão real acontecendo)
  if (desafio.estado !== 'ativo') return estado;

  // Uma chave única evita duplicar recompensa na mesma rodada/desafio
  const chaveUnica = `recompensa_${desafio.id}_rodada_${estado.rodadaGlobal}`;
  if (jaGerouRecompensa(estado, chaveUnica)) return estado;

  const recompensa = montarRecompensaPorDesafio(desafio, estado);
  recompensa.chaveUnica = chaveUnica;

  estado.recompensasPendentes.push(recompensa);

  estado.logMundo.push({
    tipo: 'recompensa_gerada',
    rodada: estado.rodadaGlobal,
    desafioId: desafio.id,
    recompensa: {
      tipo: recompensa.tipo,
      atributo: recompensa.atributo,
      recurso: recompensa.recurso,
      valor: recompensa.valor,
    },
    descricao:
      'O mundo reconheceu a superação e deixou uma recompensa em aberto.',
  });

  return estado;
}

module.exports = sistemaRecompensasContextuais;
