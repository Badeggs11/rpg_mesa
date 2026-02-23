// src/game/engine/campanha/sistemas/sistemaReputacaoJogador.js
function inicializarReputacao(estado) {
  // Inicializa estrutura principal
  if (!estado.reputacao) {
    estado.reputacao = {};
  }

  // Inicializa bloco global (defensivo)
  if (!estado.reputacao.global) {
    estado.reputacao.global = {
      fama: 0,
      honra: 0,
      suspeita: 0,
      reputacaoSocial: 0,
      titulos: [],
    };
  }

  // 🔥 CORREÇÃO CRÍTICA (seu bug está aqui)
  if (!estado.reputacao.jogadores) {
    estado.reputacao.jogadores = {};
  }

  if (!estado.jogadores) return;

  estado.jogadores.forEach(j => {
    if (!estado.reputacao.jogadores[j.id]) {
      estado.reputacao.jogadores[j.id] = {
        fama: 0,
        honra: 0,
        suspeita: 0,
        reputacaoSocial: 0,
        titulos: [],
        historicoSocial: [],
      };
    }
  });
}

function calcularImpactoSocial(estado) {
  const perfil = estado.perfilMundo;
  const memoria = estado.memoriaMundo;

  let impactoGlobal = {
    fama: 0,
    honra: 0,
    suspeita: 0,
  };

  if (!perfil || !perfil.resumoComportamento) return impactoGlobal;

  const resumo = perfil.resumoComportamento;

  // 🎯 Exploração gera fama social
  if (resumo.exploracoes >= 2) {
    impactoGlobal.fama += 2;
  }

  // 🧠 Investigação gera honra (sabedoria, respeito)
  if (resumo.investigacoes >= 2) {
    impactoGlobal.honra += 1;
  }

  // 🌍 Regiões descobertas aumentam fama do grupo
  const regioes = memoria?.regioesDescobertas?.length || 0;
  if (regioes >= 1) {
    impactoGlobal.fama += regioes;
  }

  // ⚔️ Combate excessivo pode gerar suspeita (futuro)
  if (resumo.combates >= 3) {
    impactoGlobal.suspeita += 2;
  }

  return impactoGlobal;
}

function atualizarTitulosGlobais(estado) {
  const reputacaoGlobal = estado.reputacao.global;
  const memoria = estado.memoriaMundo;

  if (!memoria) return;

  const regioes = memoria.regioesDescobertas?.length || 0;

  // 🎖️ Título: Exploradores do Mundo
  if (
    regioes >= 2 &&
    !reputacaoGlobal.titulos.includes('Exploradores do Mundo')
  ) {
    reputacaoGlobal.titulos.push('Exploradores do Mundo');

    estado.logMundo.push({
      tipo: 'titulo_global_conquistado',
      rodada: estado.rodadaGlobal,
      titulo: 'Exploradores do Mundo',
      descricao: 'O grupo passou a ser conhecido como Exploradores do Mundo.',
    });
  }
}

function atualizarReputacaoJogadores(estado, impactoGlobal) {
  const jogadores = estado.jogadores;

  jogadores.forEach(jogador => {
    if (!jogador.vivo) return;

    const rep = estado.reputacao.jogadores[jogador.id];
    if (!rep) return; // proteção extra

    rep.fama += impactoGlobal.fama;
    rep.honra += impactoGlobal.honra;
    rep.suspeita += impactoGlobal.suspeita;

    rep.reputacaoSocial = rep.fama + rep.honra - rep.suspeita;

    rep.historicoSocial.push({
      rodada: estado.rodadaGlobal,
      fama: rep.fama,
      honra: rep.honra,
      suspeita: rep.suspeita,
      reputacaoSocial: rep.reputacaoSocial,
    });
  });
}

function atualizarReputacaoGlobal(estado, impactoGlobal) {
  const global = estado.reputacao.global;

  global.fama += impactoGlobal.fama;
  global.honra += impactoGlobal.honra;
  global.suspeita += impactoGlobal.suspeita;

  global.reputacaoSocial = global.fama + global.honra - global.suspeita;
}

function sistemaReputacaoJogador(estado) {
  if (!estado) return estado;

  inicializarReputacao(estado);

  const impacto = calcularImpactoSocial(estado);

  // Se não houve impacto social relevante, não polui o log
  if (impacto.fama === 0 && impacto.honra === 0 && impacto.suspeita === 0) {
    return estado;
  }

  atualizarReputacaoJogadores(estado, impacto);
  atualizarReputacaoGlobal(estado, impacto);
  atualizarTitulosGlobais(estado);

  if (!estado.logMundo) estado.logMundo = [];

  estado.logMundo.push({
    tipo: 'reputacao_atualizada',
    rodada: estado.rodadaGlobal,
    impacto,
    reputacaoGlobal: estado.reputacao.global.reputacaoSocial,
    descricao:
      'A reputação social do grupo evoluiu com base nas ações observadas pelo mundo.',
  });

  return estado;
}

module.exports = sistemaReputacaoJogador;
