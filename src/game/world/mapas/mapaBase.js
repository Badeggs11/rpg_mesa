const mapaBase = {
  // 🏛️ CENTRO
  praca_central: {
    id: 'praca_central',
    nome: 'Praça Central',
    descricao: 'Uma praça aberta com uma fonte antiga.',
    pos: { x: 500, y: 300 },
    conexoes: ['taverna', 'igreja', 'loja_armas', 'loja_pocoes', 'restaurante'],
  },

  // 🏠 CASAS AO REDOR
  casa_1: {
    id: 'casa_1',
    nome: 'Casa Simples 1',
    descricao: 'Uma casa de madeira.',
    pos: { x: 498, y: 299 },
  },
  casa_2: {
    id: 'casa_2',
    nome: 'Casa Simples 2',
    descricao: 'Uma casa de madeira.',
    pos: { x: 502, y: 299 },
  },
  casa_3: {
    id: 'casa_3',
    nome: 'Casa Simples 3',
    descricao: 'Uma casa de madeira.',
    pos: { x: 499, y: 301 },
  },
  casa_4: {
    id: 'casa_4',
    nome: 'Casa Simples 4',
    descricao: 'Uma casa de madeira.',
    pos: { x: 501, y: 301 },
  },

  // 🍺 TAVERNA
  taverna: {
    id: 'taverna',
    nome: 'Taverna do Javali Risonho',
    descricao: 'Barulhos, risadas e cheiro de cerveja.',
    pos: { x: 500, y: 298 },
    conexoes: ['praca_central'],
  },

  // ⚔️ LOJA DE ARMAS
  loja_armas: {
    id: 'loja_armas',
    nome: 'Forja do Martelo',
    descricao: 'Armas e armaduras penduradas.',
    pos: { x: 497, y: 300 },
  },

  // 🧪 LOJA DE POÇÕES
  loja_pocoes: {
    id: 'loja_pocoes',
    nome: 'Alquimia da Lua',
    descricao: 'Frascos brilhando em tons estranhos.',
    pos: { x: 503, y: 300 },
  },

  // 🏛️ PREFEITURA
  prefeitura: {
    id: 'prefeitura',
    nome: 'Prefeitura da Vila',
    descricao: 'Quadro de missões disponível.',
    pos: { x: 500, y: 302 },
  },

  // 🍽️ RESTAURANTE
  restaurante: {
    id: 'restaurante',
    nome: 'Panela da Dona Mira',
    descricao: 'Comida quente e cheirosa.',
    pos: { x: 499, y: 298 },
  },

  // ⛪ IGREJA
  igreja: {
    id: 'igreja',
    nome: 'Capela da Luz',
    descricao: 'Silenciosa e acolhedora.',
    pos: { x: 501, y: 298 },
  },
};

module.exports = { mapaBase };
