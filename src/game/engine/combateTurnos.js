const { rolarIniciativa } = require('./iniciativa');
const { resolverAtaque } = require('./resolverAtaque');
const { resolverDefesa } = require('./resolverDefesa');
const rules = require('../rules');
const golpesAtaque = require('../world/golpesAtaque');
const golpesDefesa = require('../world/golpesDefesa');
const { jogarDado } = require('../dice');

/* =========================
   UTILIDADES
========================= */

function normalizarDirecao(d) {
  if (!d) return { vertical: null, horizontal: null };

  if (typeof d === 'string') {
    const partes = d.split('-').map(s => s.trim().toLowerCase());
    const vertical =
      partes.find(p => ['alto', 'medio', 'médio', 'baixo'].includes(p)) || null;
    const horizontal =
      partes.find(p => ['esquerda', 'direita', 'frontal'].includes(p)) || null;

    return {
      vertical: vertical === 'médio' ? 'medio' : vertical,
      horizontal,
    };
  }

  if (typeof d === 'object') {
    const vertical = d.vertical ?? d.altura ?? d.nivel ?? null;
    const horizontal = d.horizontal ?? d.lado ?? null;

    return {
      vertical: vertical ? String(vertical).toLowerCase() : null,
      horizontal: horizontal ? String(horizontal).toLowerCase() : null,
    };
  }

  return { vertical: null, horizontal: null };
}

function ataqueMaximoPossivel(regraAtaque) {
  // pior cenário: dado máximo + intensidade do golpe
  return 20 + (regraAtaque?.intensidade ?? 0);
}

/* =========================
   ESTADO INICIAL
========================= */

function criarEstadoInicial(p1, p2) {
  // garante números
  const fix = p => ({
    ...p,
    pontosDeVida: Number.isFinite(p.pontosDeVida) ? p.pontosDeVida : 0,
    stamina: Number.isFinite(p.stamina) ? p.stamina : 0,
    percepcao: Number.isFinite(p.percepcao) ? p.percepcao : 0,
  });

  const a = fix(p1);
  const b = fix(p2);

  return {
    turno: 0,
    atacanteAtual: null,
    defensorAtual: null,

    personagens: {
      [a.nome]: { ...a },
      [b.nome]: { ...b },
    },

    fase: 'aguardandoRolagemIniciativa',

    rolagemIniciativaA: null,
    rolagemIniciativaB: null,
    rolagemAtaque: null,
    rolagemDefesa: null,

    ataquePendente: null,

    log: [],
    finalizado: false,
  };
}

/* =========================
   INICIATIVA
========================= */

function executarRolagemIniciativa(estado) {
  const [nomeA, nomeB] = Object.keys(estado.personagens);

  estado.log.push({
    tipo: 'rolagemIniciativaIniciada',
    personagemA: nomeA,
    personagemB: nomeB,
  });

  estado.rolagemIniciativaA = jogarDado(20);
  estado.rolagemIniciativaB = jogarDado(20);

  estado.log.push({
    tipo: 'rolagemIniciativaResultado',
    personagemA: nomeA,
    personagemB: nomeB,
    rolagemA: estado.rolagemIniciativaA,
    rolagemB: estado.rolagemIniciativaB,
  });

  // resolve imediatamente
  executarFaseIniciativa(estado);
}

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

  estado.rolagemIniciativaA = null;
  estado.rolagemIniciativaB = null;
}

/* =========================
   ATAQUE
========================= */

function executarRolagemAtaque(estado) {
  estado.log.push({ tipo: 'rolagemAtaqueIniciada' });

  // dado só será rolado no Confirmar Ataque
  estado.rolagemAtaque = null;
  estado.fase = 'aguardandoAtaque';
}

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

  regraAtaque.direcao = direcao;
  estado.ataquePendente = regraAtaque;

  // 🎲 ROLA O DADO SOMENTE AGORA (confirmar ataque)
  estado.rolagemAtaque = jogarDado(20);

  estado.log.push({
    tipo: 'ataque',
    atacante: atacante.nome,
    golpe: golpeAtaque.nome,
    direcao,
    intensidade: regraAtaque.intensidade,
    velocidade: regraAtaque.velocidade,
  });

  estado.log.push({
    tipo: 'rolagemAtaqueResultado',
    valor: estado.rolagemAtaque,
  });

  estado.fase = 'aguardandoRolagemDefesa';
}

/* =========================
   DEFESA
========================= */

function executarRolagemDefesa(estado) {
  estado.log.push({ tipo: 'rolagemDefesaIniciada' });

  // dado só será rolado no Confirmar Defesa
  estado.rolagemDefesa = null;
  estado.fase = 'aguardandoDefesa';
}

function executarFaseDefesa(estado, payload) {
  const { golpe, direcao: direcaoDefesa } = payload;

  if (!golpe || !direcaoDefesa) {
    throw new Error('Golpe ou direção não informados');
  }
  if (!estado.ataquePendente) {
    throw new Error('Nenhum ataque pendente');
  }

  const nomeAtacante = estado.atacanteAtual;
  const nomeDefensor = estado.defensorAtual;

  const defensor = estado.personagens[nomeDefensor];
  const golpeDefesa = golpesDefesa[golpe];

  if (!golpeDefesa) {
    throw new Error('Golpe de defesa inválido');
  }

  const direcaoAtaque = estado.ataquePendente.direcao;

  // 🎲 ROLA O DADO SOMENTE AGORA (confirmar defesa)
  estado.rolagemDefesa = jogarDado(20);

  estado.log.push({
    tipo: 'rolagemDefesaResultado',
    valor: estado.rolagemDefesa,
  });

  /* 1) resolver defesa */
  const resultadoDefesa = resolverDefesa(
    rules.defesaFisica({
      defensor,
      golpe: golpeDefesa,
      direcao: direcaoDefesa,
    }),
    estado.ataquePendente,
    estado.rolagemDefesa
  );

  /* 2) resolver ataque final */
  const resultadoAtaqueFinal = resolverAtaque(
    estado.ataquePendente,
    resultadoDefesa,
    estado.rolagemAtaque
  );

  /* 3) regra de direção (0/1/2 acertos) */
  const ataqueDir = normalizarDirecao(direcaoAtaque);
  const defesaDir = normalizarDirecao(direcaoDefesa);

  let acertosDirecao = 0;

  if (
    ataqueDir.vertical &&
    defesaDir.vertical &&
    ataqueDir.vertical === defesaDir.vertical
  ) {
    acertosDirecao++;
  }
  if (
    ataqueDir.horizontal &&
    defesaDir.horizontal &&
    ataqueDir.horizontal === defesaDir.horizontal
  ) {
    acertosDirecao++;
  }

  let dano;
  const ehEsquiva = golpeDefesa.tipo === 'esquiva';

  if (ehEsquiva && resultadoDefesa.evadiu) {
    dano = 0;
  } else if (acertosDirecao === 2) {
    dano = Math.max(
      0,
      resultadoAtaqueFinal.valorAtaque - resultadoDefesa.valorDefesa
    );
  } else if (acertosDirecao === 1) {
    // meia direção: metade do ataque (como você queria)
    dano = Math.floor(resultadoAtaqueFinal.valorAtaque * 0.5);
  } else {
    dano = resultadoAtaqueFinal.valorAtaque;
  }

  /* 4) aplicar dano */
  defensor.pontosDeVida -= dano;

  /* 5) logs do turno (SEMPRE antes de qualquer return) */
  estado.log.push({
    tipo: 'narrativaDefesa',
    defensor: defensor.nome,
    golpe: golpeDefesa.nome,
    direcao: direcaoDefesa,
    direcaoCorreta: resultadoDefesa.direcaoCorreta,
    direcaoAtaque,
  });

  estado.log.push({
    tipo: 'resolucaoTurno',
    atacante: nomeAtacante,
    defensor: nomeDefensor,

    rolagemAtaque: resultadoAtaqueFinal.rolagem,
    valorAtaque: resultadoAtaqueFinal.valorAtaque,

    rolagemDefesa: resultadoDefesa.rolagem,
    valorDefesa: resultadoDefesa.valorDefesa,

    direcaoAtaque,
    direcaoDefesa,
    acertosDirecao,

    evadiu: resultadoDefesa.evadiu,
    neutralizouGolpe: resultadoDefesa.neutralizouGolpe,
    direcaoCorreta: resultadoDefesa.direcaoCorreta,

    dano,
    vidaRestante: defensor.pontosDeVida,
  });

  /* 6) fim do combate */
  if (defensor.pontosDeVida <= 0) {
    estado.finalizado = true;
    estado.fase = 'finalizado';

    estado.log.push({
      tipo: 'fimCombate',
      vencedor: nomeAtacante,
      derrotado: nomeDefensor,
    });

    // limpeza final
    estado.rolagemAtaque = null;
    estado.rolagemDefesa = null;
    estado.ataquePendente = null;

    return;
  }

  /* 7) stamina do atacante */
  const atacante = estado.personagens[nomeAtacante];
  const custoAtaque = resultadoAtaqueFinal.valorAtaque;

  atacante.stamina = Math.max(0, atacante.stamina - custoAtaque);

  estado.log.push({
    tipo: 'staminaGasta',
    personagem: atacante.nome,
    custo: custoAtaque,
    staminaRestante: atacante.stamina,
  });

  /* 8) iniciativa extra / ataque consecutivo */
  const custoMaximo = custoAtaque;

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

    const conseguiuExtra = rolagemAtacante > rolagemDefensor;

    estado.log.push({
      tipo: 'resultadoIniciativaExtra',
      atacante: atacante.nome,
      defensor: defensor.nome,
      conseguiu: conseguiuExtra,
    });

    if (conseguiuExtra) {
      estado.log.push({
        tipo: 'ataqueConsecutivo',
        atacante: atacante.nome,
        staminaRestante: atacante.stamina,
      });

      // 🧹 limpa o turno e mantém o atacante
      estado.rolagemAtaque = null;
      estado.rolagemDefesa = null;
      estado.ataquePendente = null;

      estado.fase = 'aguardandoRolagemAtaque';
      return;
    }
  }

  /* 9) troca atacante e próximo turno */
  // 🧹 limpa o turno
  estado.rolagemAtaque = null;
  estado.rolagemDefesa = null;
  estado.ataquePendente = null;

  [estado.atacanteAtual, estado.defensorAtual] = [nomeDefensor, nomeAtacante];

  estado.turno += 1;
  estado.fase = 'aguardandoRolagemAtaque';
}

/* =========================
   DISPATCHER
========================= */

function executarTurno(estado, payload = {}) {
  if (estado.finalizado) {
    throw new Error('Combate já finalizado');
  }

  switch (estado.fase) {
    case 'aguardandoRolagemIniciativa':
      executarRolagemIniciativa(estado);
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

module.exports = {
  criarEstadoInicial,
  executarTurno,
};
