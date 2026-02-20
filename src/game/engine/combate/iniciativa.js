function rolarIniciativa({ personagemA, personagemB, rolagemA, rolagemB }) {
  const baseA = (personagemA.agilidade || 0) + (personagemA.inteligencia || 0);
  const baseB = (personagemB.agilidade || 0) + (personagemB.inteligencia || 0);

  const diferenca = Math.abs(baseA - baseB);
  const bonus = Math.floor(diferenca / 10);

  const bonusA = baseA > baseB ? bonus : 0;
  const bonusB = baseB > baseA ? bonus : 0;

  const iniciativaA = rolagemA + bonusA;
  const iniciativaB = rolagemB + bonusB;

  if (iniciativaA === iniciativaB) {
    return {
      empate: true,
      iniciativaA,
      iniciativaB,
      rolagemA,
      rolagemB,
      bonusA,
      bonusB,
    };
  }

  const primeiro = iniciativaA > iniciativaB ? personagemA : personagemB;

  return {
    empate: false,

    iniciativaA,
    iniciativaB,

    rolagemA,
    rolagemB,

    bonusA,
    bonusB,

    primeiro,
  };
}

module.exports = { rolarIniciativa };
