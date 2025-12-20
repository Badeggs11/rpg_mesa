// src/game/engine/iniciativa.js
const { jogarDado } = require("../dice");

function rolarIniciativa(personagem) {
  return (personagem.agilidade || 0) + jogarDado(20);
}

module.exports = {
  rolarIniciativa,
};
