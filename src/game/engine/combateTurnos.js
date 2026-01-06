const { rolarIniciativa } = require('./iniciativa');
const { resolverAtaque } = require('./resolverAtaque');
const { resolverDefesa } = require('./resolverDefesa');
const rules = require('../rules');
const golpesAtaque = require('../world/golpesAtaque');
const golpesDefesa = require('../world/golpesDefesa');
const { jogarDado } = require('../dice');

function ataqueMaximoPossivel(regraAtaque) {
  // pior cenário: dado máximo + intensidade do golpe
  return 20 + regraAtaque.intensidade;
}

/* =========================
   ESTADO INICIAL
========================= */
function criarEstadoInicial(p1, p2) {
  return {
    turno: 0,
    atacanteAtual: null,
    defensorAtual: null,

    personagens: {
      [p1.nome]: {
        ...p1,
        stamina: Number.isFinite(p1.stamina) ? p1.stamina : 0,
        percepcao: Number.isFinite(p1.percepcao) ? p1.percepcao : 0,
      },
      [p2.nome]: {
        ...p2,
        stamina: Number.isFinite(p2.stamina) ? p2.stamina : 0,
        percepcao: Number.isFinite(p2.percepcao) ? p2.percepcao : 0,
      },
    },

    fase: 'aguardandoRolagemIniciativa',

    rolagemIniciativaA: null,
    rolagemIniciativaB: null,

    log: [],
    finalizado: false,
  };
}
function executarRolagemIniciativa(estado) {
  const [nomeA, nomeB] = Object.keys(estado.personagens);

  estado.rolagemIniciativaA = jogarDado(20);
  estado.rolagemIniciativaB = jogarDado(20);

  estado.log.push({
    tipo: 'rolagemIniciativa',
    personagemA: nomeA,
    personagemB: nomeB,
    rolagemA: estado.rolagemIniciativaA,
    rolagemB: estado.rolagemIniciativaB,
  });

  estado.fase = 'aguardandoIniciativa';
}

/* =========================
   DISPATCHER PRINCIPAL
========================= */
function executarTurno(estado, payload = {}) {
  if (estado.finalizado) {
    throw new Error('Combate já finalizado');
  }

  switch (estado.fase) {
    case 'aguardandoRolagemIniciativa':
      executarRolagemIniciativa(estado);
      break;
    case 'aguardandoIniciativa':
      executarFaseIniciativa(estado);
      break;

    case 'aguardandoRolagemAtaque':
      executarRolagemAtaque(estado);
      break;

    case 'aguardandoAtaque':
      executarFaseAtaque(estado, payload);
      break;

    case 'aguardandoRolagemDefesa':
      executarRolagemDefesa(estado);
      break;

    case 'aguardandoDefesa':
      executarFaseDefesa(estado, payload);
      break;

    default:
      throw new Error(`Fase inválida: ${estado.fase}`);
  }
}

/* =========================
   FASES
========================= */

function executarFaseIniciativa(estado) {
  const [p1, p2] = Object.values(estado.personagens);

  const iniciativa = rolarIniciativa({
    personagemA: p1,
    personagemB: p2,
    rolagemA: estado.rolagemIniciativaA,
    rolagemB: estado.rolagemIniciativaB,
  });

  if (iniciativa.empate) {
    estado.log.push({
      tipo: 'empateIniciativa',
      iniciativaA: iniciativa.iniciativaA,
      iniciativaB: iniciativa.iniciativaB,
    });

    // limpa e pede nova rolagem
    estado.rolagemIniciativaA = null;
    estado.rolagemIniciativaB = null;
    estado.fase = 'aguardandoRolagemIniciativa';
    return;
  }

  estado.atacanteAtual = iniciativa.primeiro.nome;
  estado.defensorAtual =
    iniciativa.primeiro.nome === p1.nome ? p2.nome : p1.nome;

  estado.turno = 1;
  estado.fase = 'aguardandoRolagemAtaque';

  estado.log.push({
    tipo: 'iniciativa',
    iniciativaA: iniciativa.iniciativaA,
    iniciativaB: iniciativa.iniciativaB,
    rolagemA: iniciativa.rolagemA,
    rolagemB: iniciativa.rolagemB,
    bonusA: iniciativa.bonusA,
    bonusB: iniciativa.bonusB,
    primeiro: iniciativa.primeiro.nome,
  });

  // limpa após uso
  estado.rolagemIniciativaA = null;
  estado.rolagemIniciativaB = null;
}

/* ---------- ROLAGEM ATAQUE ---------- */

function executarRolagemAtaque(estado) {
  const rolagem = jogarDado(20);
  estado.rolagemAtaque = rolagem;

  estado.log.push({
    tipo: 'rolagemAtaque',
    valor: rolagem,
  });

  estado.fase = 'aguardandoAtaque';
}

/* ---------- ATAQUE ---------- */

function executarFaseAtaque(estado, payload) {
  const { golpe, direcao } = payload;
  if (!golpe || !direcao) {
    throw new Error('Golpe ou direção não informados');
  }

  const atacante = estado.personagens[estado.atacanteAtual];
  const golpeAtaque = golpesAtaque[golpe];
  if (!golpeAtaque) {
    throw new Error('Golpe de ataque inválido');
  }

  const regraAtaque = rules.ataqueFisico({
    atacante,
    golpe: golpeAtaque,
    direcao,
  });

  estado.ataquePendente = regraAtaque;

  estado.log.push({
    tipo: 'ataque',
    atacante: atacante.nome,
    golpe: golpeAtaque.nome,
    direcao,
    intensidade: regraAtaque.intensidade,
    velocidade: regraAtaque.velocidade,
  });

  estado.fase = 'aguardandoRolagemDefesa';
}

/* ---------- ROLAGEM DEFESA ---------- */

function executarRolagemDefesa(estado) {
  const rolagem = jogarDado(20);
  estado.rolagemDefesa = rolagem;

  estado.log.push({
    tipo: 'rolagemDefesa',
    valor: rolagem,
  });

  estado.fase = 'aguardandoDefesa';
}

/* ---------- DEFESA ---------- */

function executarFaseDefesa(estado, payload) {
  const { golpe, direcao } = payload;

  if (estado.rolagemDefesa == null) {
    throw new Error('Rolagem de defesa não realizada');
  }
  if (!golpe || !direcao) {
    throw new Error('Golpe ou direção não informados');
  }
  if (!estado.ataquePendente) {
    throw new Error('Nenhum ataque pendente');
  }

  const defensor = estado.personagens[estado.defensorAtual];
  const golpeDefesa = golpesDefesa[golpe];
  if (!golpeDefesa) {
    throw new Error('Golpe de defesa inválido');
  }

  /* 1️⃣ Resolver defesa */
  const resultadoDefesa = resolverDefesa(
    rules.defesaFisica({ defensor, golpe: golpeDefesa, direcao }),
    estado.ataquePendente,
    estado.rolagemDefesa
  );

  /* 2️⃣ Resolver ataque final */
  const resultadoAtaqueFinal = resolverAtaque(
    estado.ataquePendente,
    resultadoDefesa,
    estado.rolagemAtaque
  );
  const direcaoCorreta = resultadoDefesa.direcaoCorreta;

  // componentes sem dado

  // 🧠 REGRA DE DIREÇÃO
  let dano;

  if (resultadoDefesa.evadiu) {
    // esquiva perfeita continua sendo 0
    dano = 0;
  } else if (resultadoDefesa.direcaoCorreta) {
    // direção correta SEMPRE entra na subtração
    dano = Math.max(
      0,
      resultadoAtaqueFinal.valorAtaque - resultadoDefesa.valorDefesa
    );
  } else {
    // direção errada = dano total
    dano = resultadoAtaqueFinal.valorAtaque;
  }

  /* 4️⃣ Aplicar dano */
  defensor.pontosDeVida -= dano;

  estado.log.push({
    tipo: 'narrativaDefesa',
    defensor: defensor.nome,
    golpe: golpeDefesa.nome,
    direcao,
    direcaoCorreta: resultadoDefesa.direcaoCorreta,
  });

  /* 5️⃣ Logs (ordem segura) */
  estado.log.push({
    tipo: 'resolucaoTurno',

    atacante: estado.atacanteAtual,
    defensor: defensor.nome,

    golpeAtaque: estado.ataquePendente.estilo,
    direcao,

    rolagemAtaque: resultadoAtaqueFinal.rolagem,
    valorAtaque: resultadoAtaqueFinal.valorAtaque,

    rolagemDefesa: resultadoDefesa.rolagem,
    valorDefesa: resultadoDefesa.valorDefesa,

    evadiu: resultadoDefesa.evadiu,
    neutralizouGolpe: resultadoDefesa.neutralizouGolpe,

    dano,
    vidaRestante: defensor.pontosDeVida,
  });

  const regraAtaqueUsada = estado.ataquePendente;

  /* 6️⃣ Limpar estado temporário */
  estado.rolagemAtaque = null;
  estado.rolagemDefesa = null;
  estado.ataquePendente = null;

  /* 7️⃣ Fim ou próximo turno */
  if (defensor.pontosDeVida <= 0) {
    estado.finalizado = true;
    estado.fase = 'finalizado';

    estado.log.push({
      tipo: 'fimCombate',
      vencedor: estado.atacanteAtual,
      derrotado: estado.defensorAtual,
    });
    return;
  }

  /* 6.5️⃣ Consumir stamina do atacante */
  const atacante = estado.personagens[estado.atacanteAtual];
  const custoAtaque = resultadoAtaqueFinal.valorAtaque;

  atacante.stamina = Math.max(0, atacante.stamina - custoAtaque);

  estado.log.push({
    tipo: 'staminaGasta',
    personagem: atacante.nome,
    custo: custoAtaque,
    staminaRestante: atacante.stamina,
  });

  /* 6.6️⃣ Checar ataque consecutivo */
  const custoMaximo = ataqueMaximoPossivel(regraAtaqueUsada);

  if (atacante.stamina >= custoMaximo) {
    const rolagemAtacante = jogarDado(20);
    const rolagemDefensor = jogarDado(20);

    estado.log.push({
      tipo: 'rolagemIniciativaExtra',
      atacante: atacante.nome,
      defensor: defensor.nome,
      rolagemAtacante,
      rolagemDefensor,
    });

    if (rolagemAtacante > rolagemDefensor) {
      estado.log.push({
        tipo: 'ataqueConsecutivo',
        atacante: atacante.nome,
        staminaRestante: atacante.stamina,
      });

      // mantém o mesmo atacante
      estado.fase = 'aguardandoRolagemAtaque';
      return;
    }
  }

  [estado.atacanteAtual, estado.defensorAtual] = [
    estado.defensorAtual,
    estado.atacanteAtual,
  ];

  estado.turno += 1;
  estado.fase = 'aguardandoRolagemAtaque';
}

/* ========================= */

module.exports = {
  criarEstadoInicial,
  executarTurno,
};
