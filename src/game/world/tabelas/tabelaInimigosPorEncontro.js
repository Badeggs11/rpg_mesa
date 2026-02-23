// 🌍 Tabela híbrida (fallback sistêmico)
// Futuramente: poderá ser sobrescrita pelo banco de dados

const tabelaInimigosPorEncontro = {
  emboscada: {
    baixo: 2, // Goblin fraco
    medio: 2,
    alto: 2, // por enquanto fixo (teste)
  },

  criatura: {
    baixo: 2,
    medio: 2,
    alto: 2,
  },

  ambiente_hostil: {
    baixo: 2,
    medio: 2,
    alto: 2,
  },
};

function obterInimigoFallback(tipoEncontro, perigo) {
  if (!tipoEncontro) return 2;

  const tabelaTipo = tabelaInimigosPorEncontro[tipoEncontro];

  if (!tabelaTipo) {
    // fallback universal seguro
    return 2;
  }

  return tabelaTipo[perigo] || tabelaTipo.medio || 2;
}

module.exports = {
  tabelaInimigosPorEncontro,
  obterInimigoFallback,
};
