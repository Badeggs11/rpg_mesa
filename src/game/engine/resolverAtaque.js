const { jogarDado } = require("../dice");
const { resolverDefesa } = require("./resolverDefesa");

function resolverAtaque(ataque, defesaEscolhida) {
  // valida se a defesa é permitida
  if (!ataque.defesaAlvo.includes(defesaEscolhida.estilo)) {
    throw new Error(
      `Defesa '${defesaEscolhida.estilo}' não permitida contra este ataque`
    );
  }

  // rolagem de ataque
  const rolagemAtaque = jogarDado(ataque.ataque.dado);
  const valorAtaque = rolagemAtaque + ataque.ataque.base;

  // resolver defesa
  const resultadoDefesa = resolverDefesa(defesaEscolhida);

  // comparar
  const diferenca = valorAtaque - resultadoDefesa.valorDefesa;

  let dano = 0;
  let acertou = diferenca > 0;

  if (acertou) {
    const rolagemDano = jogarDado(ataque.dano.dado);
    dano = Math.max(0, rolagemDano);
  }

  return {
    tipo: "resultadoAtaque",
    estilo: ataque.estilo,
    ataque: {
      rolagem: rolagemAtaque,
      base: ataque.ataque.base,
      valorAtaque,
    },
    defesa: resultadoDefesa,
    acertou,
    diferenca,
    dano,
    descricao: ataque.descricao,
  };
}

module.exports = { resolverAtaque };
