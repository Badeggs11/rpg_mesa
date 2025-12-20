const { combateFisico } = require("../../services/combatService");

(async () => {
  try {
    const resultado = await combateFisico({
      atacanteId: 3,
      defensorId: 4,
      armaAtacanteId: "longa",
      armaDefensorId: "longa",
      defesaEscolhida: "defesaFisica",
    });

    console.log("⚔️ Resultado do combate:");
    console.dir(resultado, { depth: null });
  } catch (err) {
    console.error("❌ Erro no combate:", err.message);
  }
})();
