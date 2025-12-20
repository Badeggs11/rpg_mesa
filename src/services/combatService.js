const personagensService = require("./personagensService");
const { executarAcao } = require("../game/engine/executarAcao");
const { ataqueFisico } = require("../game/rules");
const { armas } = require("../game/world");
const { jogarDado } = require("../game/dice");

async function combateFisico({
  atacanteId,
  defensorId,
  armaAtacanteId,
  armaDefensorId,
}) {
  // 1️⃣ Buscar personagens
  let p1 = await personagensService.buscarPorId(atacanteId);
  let p2 = await personagensService.buscarPorId(defensorId);

  if (!p1 || !p2) {
    throw new Error("Personagem não encontrado");
  }

  // 2️⃣ Criar estado em memória
  console.log("DEBUG armaAtacanteId:", armaAtacanteId);
  console.log("DEBUG armaDefensorId:", armaDefensorId);
  console.log("DEBUG armas disponíveis:", Object.keys(armas.espadas));

  let estado = [
    {
      ...p1,
      vida: p1.pontosDeVida,
      arma: armas.espadas[armaAtacanteId],
    },
    {
      ...p2,
      vida: p2.pontosDeVida,
      arma: armas.espadas[armaDefensorId],
    },
  ];

  // 3️⃣ Iniciativa
  estado.forEach((p) => {
    p.iniciativa = jogarDado(20) + (p.agilidade || 0);
  });

  estado.sort((a, b) => b.iniciativa - a.iniciativa);

  const log = [];

  // 4️⃣ Loop de combate
  while (estado.every((p) => p.vida > 0)) {
    for (let i = 0; i < estado.length; i++) {
      const atacante = estado[i];
      const defensor = estado[(i + 1) % estado.length];

      if (atacante.vida <= 0 || defensor.vida <= 0) break;

      const acao = ataqueFisico(atacante, atacante.arma);
      const resultado = executarAcao(acao, {
        defensor,
        defesaEscolhida: "defesaFisica",
      });

      log.push({
        turno: log.length + 1,
        atacante: atacante.nome,
        defensor: defensor.nome,
        dano: resultado.dano,
        vidaDefensor: defensor.vida,
      });

      if (defensor.vida <= 0) break;
    }
  }

  // 5️⃣ Persistir estado final
  for (const p of estado) {
    await personagensService.atualizarVida(p.id, p.vida);
  }

  return {
    vencedor: estado.find((p) => p.vida > 0).nome,
    personagens: estado.map((p) => ({
      id: p.id,
      nome: p.nome,
      vida: p.vida,
    })),
    log,
  };
}

module.exports = {
  combateFisico,
};
