// 🎯 sistemaResolucaoDesafios.js
// Resolve desafios latentes com modelo híbrido:
// - Passivo (latente no mundo)
// - Ativo por contexto (região + tensão)

function inicializarEstadoDesafios(estado) {
  if (!estado.desafiosAtivos) {
    estado.desafiosAtivos = [];
  }
}

function ehRegiaoPerigosa(localAtual, estado) {
  const memoria = estado.memoriaMundo;
  const regioesHostis = memoria?.regioesHostis || [];

  return regioesHostis.includes(localAtual);
}

function ativarPressaoAmbiental(estado, desafio) {
  if (!estado.logMundo) estado.logMundo = [];

  estado.logMundo.push({
    tipo: 'pressao_ambiental_ativa',
    rodada: estado.rodadaGlobal,
    desafioId: desafio.id,
    descricao: 'O ambiente se tornou mais hostil devido às condições do mundo.',
  });

  desafio.estado = 'ativo';
}

function manterDesafioLatente(desafio) {
  if (!desafio.estado) {
    desafio.estado = 'latente';
  }
}

function sistemaResolucaoDesafios(estado) {
  if (!estado) return estado;
  if (!estado.eventoDramaticoAtivo) return estado;
  if (!estado.reacaoMundo) return estado;

  inicializarEstadoDesafios(estado);

  const desafio = estado.eventoDramaticoAtivo;
  const tensao = estado.reacaoMundo.nivelTensaoGlobal || 0;
  const localAtual = estado.historia?.localAtual || 'desconhecido';

  // 🔥 Regra 1 — Desafio começa como latente
  manterDesafioLatente(desafio);

  // 🌍 Regra 2 — Ativação contextual híbrida
  const tensaoAlta = tensao >= 5;
  const regiaoPerigosa = ehRegiaoPerigosa(localAtual, estado);

  // Se mundo está perigoso E jogador está em região hostil
  if (tensaoAlta && regiaoPerigosa) {
    if (desafio.estado !== 'ativo') {
      ativarPressaoAmbiental(estado, desafio);

      estado.desafiosAtivos.push({
        id: desafio.id,
        rodadaAtivacao: estado.rodadaGlobal,
        local: localAtual,
        tipo: desafio.desafio,
        subtipo: desafio.subtipo,
      });
    }
  }

  console.log('DEBUG LOCAL:', localAtual);
  console.log('DEBUG REGIOES HOSTIS:', estado.memoriaMundo?.regioesHostis);
  console.log('DEBUG TENSAO:', tensao);

  // 🌱 Caso contrário, permanece passivo (sandbox puro)
  return estado;
}

module.exports = sistemaResolucaoDesafios;
