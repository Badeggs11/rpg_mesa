const muros = {
  muroPedraAntiga: {
    tipo: "Muro de Pedra Antiga",
    altura: 6,
    material: "pedra",
    apoio: "regular",
    superficieEscorregadia: false,
    irregularidades: 2,
    estado: "gasto",
  },
  muroCasteloPolido: {
    tipo: "Muro de Castelo Polido",
    altura: 8,
    material: "pedra polida",
    apoio: "ruim",
    superficieEscorregadia: false,
    irregularidades: 0,
    estado: "novo",
  },
  muroMadeiraVelha: {
    tipo: "Muro de Madeira Velha",
    altura: 4,
    material: "madeira",
    apoio: "bom",
    superficieEscorregadia: false,
    irregularidades: 1,
    estado: "gasto",
  },
  muroTijolos: {
    tipo: "Muro de Tijolos",
    altura: 3,
    material: "tijolo",
    apoio: "regular",
    superficieEscorregadia: false,
    irregularidades: 1,
    estado: "novo",
  },
  muroComMusgo: {
    tipo: "Muro com Musgo",
    altura: 5,
    material: "pedra",
    apoio: "regular",
    superficieEscorregadia: true,
    irregularidades: 2,
    estado: "gasto",
  },
};

module.exports = muros;
