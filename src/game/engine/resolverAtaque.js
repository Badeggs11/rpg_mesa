// game/engine/resolverAtaque.js
const { jogarDado } = require("../dice");
const { resolverDefesa } = require("./resolverDefesa");
const regras = require("../rules");

function resolverAtaque(acao, contexto) {
  const { defensor, defesaEscolhida } = contexto;

  if (!defesaEscolhida) {
    throw new Error("Ataque requer uma defesa escolhida");
  }

  // cria defesa a partir das rules
  const defesaFn = regras[defesaEscolhida];
  if (!defesaFn) {
    throw new Error(`Defesa '${defesaEscolhida}' não existe`);
  }

  const defesa = defesaFn(defensor);

  // valida se defesa é permitida
  if (!acao.defesaAlvo.includes(defesa.estilo)) {
    throw new Error(
      `Defesa '${defesa.estilo}' não permitida contra este ataque`
    );
  }

  // rolagem de ataque
  const rolagemAtaque = jogarDado(acao.ataque.dado);
  const valorAtaque = rolagemAtaque + acao.ataque.base;

  // rolagem de defesa
  const resultadoDefesa = resolverDefesa(defesa);

  const diferenca = valorAtaque - resultadoDefesa.valorDefesa;
  const acertou = diferenca > 0;

  let dano = 0;
  if (acertou) {
    const rolagemDano = jogarDado(acao.dano.dado);
    dano = Math.max(0, rolagemDano + diferenca);
    defensor.vida -= dano;
  }

  return {
    tipo: "resultadoAtaque",
    estilo: acao.estilo,
    ataque: {
      rolagem: rolagemAtaque,
      base: acao.ataque.base,
      valorAtaque,
    },
    defesa: resultadoDefesa,
    acertou,
    diferenca,
    dano,
    descricao: acao.descricao,
  };
}

module.exports = { resolverAtaque };
