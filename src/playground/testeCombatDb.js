const personagemService = require("../services/personagensService");
const { executarCombate } = require("../game/combatDb");

(async () => {
  const personagens = await personagemService.listar();
  console.log("Personagens no banco:", personagens);

  if (personagens.length === 0) {
    console.log("Criando personagens de teste...");

    await personagemService.criar({
      nome: "Jake",
      forca: 10,
      agilidade: 8,
      inteligencia: 6,
    });

    await personagemService.criar({
      nome: "Goblin",
      forca: 9,
      agilidade: 15,
      inteligencia: 3,
    });
  }

  await executarCombate(1, 2);

  const p1 = await personagemService.buscarPorId(1);
  const p2 = await personagemService.buscarPorId(2);

  console.log("Apos o combate:");
  console.log(p1);
  console.log(p2);
})();
