const { combateTurnos } = require("../engine/combateTurnos");
const regras = require("../rules");
const { armas } = require("../world");

const jake = {
  nome: "Jake",
  vida: 100,
  forca: 10,
  resistencia: 10,
  agilidade: 8,
  inteligencia: 6,
};

const goblin = {
  nome: "Goblin",
  vida: 60,
  forca: 6,
  resistencia: 6,
  agilidade: 7,
  inteligencia: 3,
};

function escolherAcao(atacante) {
  return regras.ataqueFisico(atacante, armas.espadas.longa);
}

function escolherDefesa(defensor) {
  if (defensor.vida < 15) {
    return "fugir";
  }
  return "defesaFisica";
}

const resultado = combateTurnos({
  personagemA: { ...jake },
  personagemB: { ...goblin },
  escolherAcao,
  escolherDefesa,
});

console.log("\n=== RESULTADO DO COMBATE ===\n");
console.log(JSON.stringify(resultado, null, 2));
