// 🎮 sistemaResolverDecisaoEncontro.js
// Engine pura: resolve decisão do jogador sobre um encontro perigoso.
// NÃO chama API, NÃO chama Services, NÃO acessa DB.
// Apenas altera o estado sistêmico da campanha.

function garantirEstruturas(estado) {
  if (!estado.logMundo) estado.logMundo = [];
  if (!estado.historicoEncontros) estado.historicoEncontros = [];
}

function registrarHistoricoEncontro(estado, encontro, resolucao) {
  estado.historicoEncontros.push({
    encontroId: encontro.id,
    tipo: encontro.tipo,
    perigo: encontro.perigo,
    rodada: estado.rodadaGlobal,
    resolucao,
    origem: encontro.origem,
  });
}

function resolverDecisaoLutar(estado, encontro) {
  // 🎯 Cria gatilho sistêmico (modelo 2 escolhido)
  estado.gatilhoCombate = {
    origem: 'encontro_perigoso',
    encontroId: encontro.id,
    tipoEncontro: encontro.tipo,
    perigo: encontro.perigo,
    rodada: estado.rodadaGlobal,
    status: 'pendente',
  };

  // 📜 Mantém o encontro como histórico sistêmico (SUA ESCOLHA B)
  encontro.status = 'resolvido_em_combate';

  registrarHistoricoEncontro(estado, encontro, 'combate_iniciado');

  estado.logMundo.push({
    tipo: 'decisao_lutar',
    rodada: estado.rodadaGlobal,
    encontroId: encontro.id,
    descricao:
      'Os aventureiros decidiram enfrentar o perigo. Um combate iminente foi desencadeado.',
  });

  estado.logMundo.push({
    tipo: 'gatilho_combate_criado',
    rodada: estado.rodadaGlobal,
    encontroId: encontro.id,
    descricao:
      'O mundo registrou um gatilho sistêmico de combate originado de um encontro perigoso.',
  });

  // ❗ Não removemos o encontro (histórico rico)
  estado.encontroPendente = null;

  return estado;
}

function resolverDecisaoFugir(estado, encontro) {
  // 🏃 Fuga NÃO remove o risco (como você definiu)
  encontro.status = 'fuga_tentada';
  encontro.tentativasFuga = (encontro.tentativasFuga || 0) + 1;

  registrarHistoricoEncontro(estado, encontro, 'fuga_tentada');

  estado.logMundo.push({
    tipo: 'decisao_fugir',
    rodada: estado.rodadaGlobal,
    encontroId: encontro.id,
    tentativasFuga: encontro.tentativasFuga,
    descricao:
      'Os aventureiros tentaram evitar o perigo, mas a ameaça ainda permanece no ambiente.',
  });

  // ⚠️ Encontro continua no mundo (risco persistente)
  estado.encontroPendente = encontro;

  return estado;
}

function sistemaResolverDecisaoEncontro(estado, decisao) {
  if (!estado) return estado;

  garantirEstruturas(estado);

  const encontro = estado.encontroPendente;

  // Nada para resolver
  if (!encontro) return estado;

  if (!decisao || !decisao.tipo) {
    return estado;
  }

  // 🎮 Decisão do jogador
  if (decisao.tipo === 'lutar') {
    return resolverDecisaoLutar(estado, encontro);
  }

  if (decisao.tipo === 'fugir') {
    return resolverDecisaoFugir(estado, encontro);
  }

  // Decisão inválida não altera estado
  estado.logMundo.push({
    tipo: 'decisao_encontro_invalida',
    rodada: estado.rodadaGlobal,
    descricao: 'Uma decisão inválida foi ignorada pelo sistema do mundo.',
  });

  return estado;
}

module.exports = sistemaResolverDecisaoEncontro;
