const {
  ataqueFisico,
  ataqueMagico,
  esquivar,
  defesaFisica,
  defesaFugir,
} = require("./rules");

const personagemService = require("../services/personagensService");

async function executarCombate(id1, id2) {
  const p1 = await personagemService.buscarPorId(id1);
  const p2 = await personagemService.buscarPorId(id2);

  const jogador1 = {
    ...p1,
    vida: p1.pontosDeVida,
  };
  const jogador2 = {
    ...p2,
    vida: p2.pontosDeVida,
  };
  const espada = { precisao: 1, forca: 2 };
  const magia = { precisao: 1, qtdPoder: 3 };

  let turno = 1;

  console.log("\n=== Inicio do Combate ===");

  while (jogador1.vida > 0 && jogador2.vida > 0) {
    console.log(`\n=== TURNO ${turno} ===`);

    const defesaJ2 = jogador2.vida < 10 ? defesaFugir : esquivar;
    const ataque1 = ataqueFisico(jogador1, espada, defesaJ2, jogador2);
    jogador2.vida -= ataque1.resultado.danoCausado;
    console.log(
      `⚔️ ${jogador1.nome} causa ${ataque1.resultado.danoCausado}
            de dano`
    );
    console.log(`❤️ Vida de ${jogador2.nome}: ${Math.max(0, jogador2.vida)}`);

    if (jogador2.vida <= 0) break;

    const ataque2 = ataqueMagico(jogador2, magia, defesaFisica, jogador1);
    jogador1.vida -= ataque2.resultado.danoCausado;

    console.log(
      `🔥 ${jogador2.nome} causa ${ataque2.resultado.danoCausado}
            de dano`
    );
    console.log(`❤️ Vida de ${jogador1.nome}: ${Math.max(0, jogador1.vida)}`);

    turno++;
  }
  console.log("\n=== FIM DO COMBATE ===");

  if (jogador1.vida > 0) {
    console.log(`🏆 ${jogador1.nome} venceu!`);
  } else {
    console.log(`🏆 ${jogador2.nome} venceu!`);
  }

  await personagemService.atualizarVida(
    jogador1.id,
    Math.max(0, jogador1.vida)
  );
  await personagemService.atualizarVida(
    jogador2.id,
    Math.max(0, jogador2.vida)
  );
}
module.exports = {
  executarCombate,
};
