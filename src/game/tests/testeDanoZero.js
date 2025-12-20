const { ataqueFisico } = require("../rules");
const { executarAcao } = require("../engine/executarAcao");

// atacante fraco
const atacante = {
  nome: "Aprendiz",
  vida: 20,
  forca: 1,
  agilidade: 1,
  resistencia: 1,
  inteligencia: 1,
};

// defensor forte
const defensor = {
  nome: "Cavaleiro",
  vida: 40,
  forca: 10,
  agilidade: 8,
  resistencia: 12,
  inteligencia: 5,
};

// arma fraca
const arma = {
  nome: "Galho",
  dadoDano: 4,
  precisao: 0,
  poder: 0,
  peso: 0,
};

const vidaInicial = defensor.vida;

// cria ação
const acao = ataqueFisico(atacante, arma);

// executa
const resultado = executarAcao(acao, {
  defensor,
  defesaEscolhida: "defesaFisica",
});

console.log("🧪 Teste de dano zero");
console.dir(resultado, { depth: null });

console.log("❤️ Vida inicial:", vidaInicial);
console.log("❤️ Vida final:", defensor.vida);

// ASSERT manual
if (defensor.vida < 0) {
  throw new Error("❌ Vida ficou negativa");
}

if (resultado.dano !== 0) {
  throw new Error("❌ Dano deveria ser zero");
}

if (defensor.vida !== vidaInicial) {
  throw new Error("❌ Vida não deveria ter mudado");
}

console.log("✅ Teste de dano zero passou");
