const { ataqueFisico, defesaFisica } = require("../rules");
const { executarAcao } = require("../engine/executarAcao");
const { fugir } = require("../rules");

// personagem mock (sem banco)
const atacante = {
  nome: "Herói",
  vida: 30,
  forca: 8,
  agilidade: 6,
  resistencia: 7,
  inteligencia: 5,
};

const defensor = {
  nome: "Orc",
  vida: 25,
  forca: 7,
  agilidade: 5,
  resistencia: 8,
  inteligencia: 3,
};

// arma mock
const arma = {
  nome: "Espada Longa",
  dadoDano: 8,
  precisao: 2,
  poder: 3,
  peso: 1,
};

// cria ação
const acao = ataqueFisico(atacante, arma);

// executa
const resultado = executarAcao(acao, {
  defensor,
  defesaEscolhida: "fugir",
});

console.log("⚔️ Resultado do ataque:");
console.dir(resultado, { depth: null });
console.log("❤️ Vida do defensor:", defensor.vida);
