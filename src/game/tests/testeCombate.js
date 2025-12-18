// game/tests/testeCombate.js

const { ataqueFisico, esquivar } = require("../rules");
const { executarAcao } = require("../engine/executarAcao");

// mocks simples (depois vêm do banco)
const jake = {
  nome: "Jake",
  forca: 6,
  agilidade: 4,
  inteligencia: 3,
  resistencia: 5,
  sorte: 2,
  poder: 1,
};

const goblin = {
  nome: "Goblin",
  forca: 3,
  agilidade: 5,
  inteligencia: 1,
  resistencia: 2,
  sorte: 3,
  poder: 0,
};

const espada = {
  nome: "Espada",
  precisao: 2,
  poder: 3,
  velocidade: 1,
  dadoDano: 8,
};

// cria ação
const ataque = ataqueFisico(jake, espada);

// defensor escolhe defesa
const defesa = esquivar(goblin);

// engine executa
const resultado = executarAcao(ataque, { defesa });

console.log("=== Resultado do Combate ===");
console.log(resultado);
