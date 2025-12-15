const { regras } = require("../game/rules");

const {
  ataqueFisico,
  ataqueMagico,
  defesaFisica,
  esquivar,
  resistirMagia,
  defesaFugir,
} = regras;

// ==========================
// PERSONAGENS
// ==========================

const guerreiro = {
  nome: "Guerreiro",
  forca: 4,
  sorte: 2,
  resistencia: 3,
  vigor: 3,
  agilidade: 1,
  inteligencia: 1,
  poder: 0,
  vida: 35,
};

const mago = {
  nome: "Mago",
  forca: 1,
  sorte: 2,
  resistencia: 1,
  vigor: 2,
  agilidade: 2,
  inteligencia: 4,
  poder: 4,
  vida: 30,
};

// ==========================
// ATAQUES (skills)
// ==========================

const espada = {
  precisao: 1,
  forca: 2,
};

const bolaDeFogo = {
  precisao: 1,
  qtdPoder: 3,
};

// ==========================
// LOOP DE COMBATE SIMPLES
// ==========================

let turno = 1;

while (guerreiro.vida > 0 && mago.vida > 0) {
  console.log(`\n=== TURNO ${turno} ===`);

  // -------- Guerreiro ataca --------
  const defesaMago = mago.vida < 10 ? defesaFugir : esquivar;

  const ataqueGuerreiro = ataqueFisico(guerreiro, espada, defesaMago, mago);
  console.log(JSON.stringify(ataqueGuerreiro, null, 2));

  mago.vida -= ataqueGuerreiro.danoCausado;

  console.log(`⚔ ${guerreiro.nome} ataca (${ataqueGuerreiro.rolagemAtaque})`);
  console.log(`🛡 ${mago.nome} defende (${ataqueGuerreiro.defesa.rolagem})`);
  console.log(`💥 Dano causado: ${ataqueGuerreiro.danoCausado}`);
  console.log(`❤️ Vida do ${mago.nome}: ${Math.max(0, mago.vida)}`);

  if (mago.vida <= 0) break;

  // -------- Mago ataca --------
  const ataqueMago = ataqueMagico(mago, bolaDeFogo, defesaFisica, guerreiro);

  guerreiro.vida -= ataqueMago.danoCausado;

  console.log(`🔥 ${mago.nome} conjura magia (${ataqueMago.rolagemAtaque})`);
  console.log(`🛡 ${guerreiro.nome} resiste (${ataqueMago.defesa.rolagem})`);
  console.log(`💥 Dano causado: ${ataqueMago.danoCausado}`);
  console.log(`❤️ Vida do ${guerreiro.nome}: ${Math.max(0, guerreiro.vida)}`);

  turno++;
}

// ==========================
// RESULTADO FINAL
// ==========================

console.log("\n=== FIM DO COMBATE ===");

if (guerreiro.vida <= 0 && mago.vida <= 0) {
  console.log("☠ Ambos caíram!");
} else if (guerreiro.vida <= 0) {
  console.log(`🏆 ${mago.nome} venceu!`);
} else {
  console.log(`🏆 ${guerreiro.nome} venceu!`);
}
