const mapaBase = {
  vila_abandonada: {
    id: 'vila_abandonada',
    nome: 'Vila Abandonada',
    descricao: 'Uma pequena vila abandonada.',
    pos: { x: 500, y: 300 },
    conexoes: [
      'floresta_norte',
      'estrada_leste',
      'mercado_da_vila',
      'casa_do_luis',
    ],
  },

  mercado_da_vila: {
    id: 'mercado_da_vila',
    nome: 'Mercado da Vila',
    descricao: 'Mercado da vila.',
    pos: { x: 650, y: 300 },
    conexoes: ['vila_abandonada'],
  },

  casa_do_luis: {
    id: 'casa_do_luis',
    nome: 'Casa do Luis',
    descricao: 'Casa do garoto Luis.',
    pos: { x: 350, y: 300 },
    conexoes: ['vila_abandonada'],
  },

  floresta_norte: {
    id: 'floresta_norte',
    nome: 'Floresta do Norte',
    descricao: 'Árvores densas.',
    pos: { x: 500, y: 120 },
    conexoes: ['vila_abandonada'],
  },

  estrada_leste: {
    id: 'estrada_leste',
    nome: 'Estrada Leste',
    descricao: 'Estrada de terra.',
    pos: { x: 500, y: 500 },
    conexoes: ['vila_abandonada'],
  },
};

module.exports = { mapaBase };
