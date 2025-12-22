// src/game/engine/iniciativa.js
const { jogarDado } = require("../dice");

function rolarIniciativa(personagemA, personagemB) {
  const baseA = (personagemA.agilidade || 0) + (personagemA.inteligencia || 0);
  const baseB = (personagemB.agilidade || 0) + (personagemB.inteligencia || 0);

  const diferenca = Math.abs(baseA - baseB);
  const bonus = Math.floor(diferenca / 5);

  let iniciativaA;
  let iniciativaB;

  do {
    iniciativaA = jogarDado(20) + (baseA > baseB ? bonus : 0);
    iniciativaB = jogarDado(20) + (baseB > baseA ? bonus : 0);
  } while (iniciativaA === iniciativaB);

  return {
    iniciativaA,
    iniciativaB,
    bonus,
    primeiro: iniciativaA > iniciativaB ? personagemA : personagemB,
  };
}

module.exports = { rolarIniciativa };
