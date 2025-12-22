const { rolarIniciativa } = require("./iniciativa");
const { resolverAtaque } = require("./resolverAtaque");
const regras = require("../rules");

function combateTurnos({
  personagemA,
  personagemB,
  escolherAcao,
  escolherDefesa,
  maxTurnos = 20,
}) {
  const estado = {
    turno: 0,
    log: [],
    finalizado: false,
    vencedor: null,
    motivo: null,
  };
  const iniciativa = rolarIniciativa(personagemA, personagemB);

  let atacante =
    iniciativa.iniciativaA > iniciativa.iniciativaB ? personagemA : personagemB;
  let defensor = atacante === personagemA ? personagemB : personagemA;

  estado.log.push({
    tipo: "iniciativa",
    iniciativa,
    primeiro: atacante.nome,
  });

  while (!estado.finalizado && estado.turno < maxTurnos) {
    estado.turno++;

    const acao = escolherAcao(atacante, defensor, estado.turno);
    if (!acao || !acao.tipo) {
      throw new Error("Acao invalida retornada pelo atacante");
    }

    const defesaEscolhida = escolherDefesa(defensor, acao, estado.turno);

    const resultado = resolverAtaque(acao, {
      defensor,
      defesaEscolhida,
    });

    estado.log.push({
      tipo: "turno",
      turno: estado.turno,
      atacante: atacante.nome,
      defensor: defensor.nome,
      resultado,
      vidaDefensor: defensor.vida,
    });

    if (defesaEscolhida === "fugir" && resultado.defesa.sucesso === true) {
      estado.finalizado = true;
      estado.vencedor = atacante.nome;
      estado.motivo = "fuga";
      break;
    }
    if (defensor.vida <= 0) {
      estado.finalizado = true;
      estado.vencedor = atacante.nome;
      estado.motivo = "morte";
      break;
    }

    [atacante, defensor] = [defensor, atacante];
  }

  if (!estado.finalizado) {
    estado.finalizado = true;
    estado.motivo = "limite_turnos";
  }

  return estado;
}
module.exports = { combateTurnos };
