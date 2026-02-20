const { rolarIniciativa } = require('./iniciativa');
const { resolverAtaque } = require('./resolverAtaque');
const { resolverDefesa } = require('./resolverDefesa');
const rules = require('../../rules');
const golpesAtaque = require('../../world/golpesAtaque');
const golpesDefesa = require('../../world/golpesDefesa');
const { jogarDado } = require('../../dice');
const decidirAcaoCpu = require('../ia/decidirAcaoCpu');

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

    controlador: p.controlador || 'humano',

    pontosDeVida: Number.isFinite(p.pontosDeVida) ? p.pontosDeVida : 0,
    stamina: Number.isFinite(p.stamina) ? p.stamina : 0,
    percepcao: Number.isFinite(p.percepcao) ? p.percepcao : 0,
  });

  const a = fix(p1);
  const b = fix(p2);

  return {
    tempoLimite: null,
    tipoTempo: null,

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

    percepcaoDefensor: {
      valorRolado: 0,
      bonusAtributo: 0,
      total: 0,
      segundosInformacao: 0,
      direcaoRevelada: null,
    },

    log: [
      {
        tipo: 'instrucao',
        texto: '🎲 Jogue os dados para decidir a iniciativa do jogo.',
      },
    ],

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

    estado.log.push({
      tipo: 'instrucao',
      texto: '🎲 Jogue o dado para definir o tempo de ataque.',
    });

    return;
  }

  estado.atacanteAtual = iniciativa.primeiro.nome;
  estado.defensorAtual =
    iniciativa.primeiro.nome === p1.nome ? p2.nome : p1.nome;

  estado.turno = 1;
  estado.fase = 'aguardandoRolagemTempoAtaque';

  estado.log.push({
    tipo: 'instrucao',
    texto: '🎲 Jogue o dado para definir o tempo de ataque.',
  });

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

function executarRolagemTempoAtaque(estado) {
  estado.log.push({ tipo: 'rolagemTempoAtaqueIniciada' });

  estado.tempoLimite = jogarDado(20);
  estado.tipoTempo = 'ataque';

  estado.log.push({
    tipo: 'rolagemTempoAtaqueResultado',
    valor: estado.tempoLimite,
  });

  estado.fase = 'preContagemAtaque';
}

function executarRolagemTempoPercepcao(estado) {
  const defensor = estado.personagens[estado.defensorAtual];

  const d6 = jogarDado(6);
  const bonus = defensor.percepcao * 0.1;
  const total = d6 + bonus;

  estado.percepcaoDefensor = {
    valorRolado: d6,
    bonusAtributo: bonus,
    total,
    segundosInformacao: Math.floor(total),
    direcaoRevelada: estado.ataquePendente?.direcao || null,
  };

  estado.log.push({
    tipo: 'percepcaoRolada',
    defensor: estado.defensorAtual,
    d6,
    bonus,
    total,
  });

  estado.fase = 'preContagemPercepcao';
}

function iniciarTempoAtaque(estado) {
  estado.fase = 'tempoDeAtaque';
}

function tempoEsgotado(estado) {
  estado.log.push({ tipo: 'tempoEsgotado', quem: estado.atacanteAtual });

  // perde turno
  [estado.atacanteAtual, estado.defensorAtual] = [
    estado.defensorAtual,
    estado.atacanteAtual,
  ];

  estado.turno += 1;
  estado.fase = 'aguardandoRolagemTempoAtaque';

  estado.tempoLimite = null;
  estado.tipoTempo = null;
}

function executarRolagemTempoDefesa(estado) {
  estado.log.push({ tipo: 'rolagemTempoDefesaIniciada' });

  estado.tempoLimite = jogarDado(20);
  estado.tipoTempo = 'defesa';

  estado.percepcaoDefensor.ativa = true;
  estado.percepcaoDefensor.segundosRestantes =
    estado.percepcaoDefensor.segundosInformacao;

  estado.log.push({
    tipo: 'rolagemTempoDefesaResultado',
    valor: estado.tempoLimite,
  });

  estado.fase = 'preContagemDefesa';
}

function iniciarTempoDefesa(estado) {
  estado.fase = 'tempoDeDefesa';
}

function tempoDefesaEsgotado(estado) {
  const nomeAtacante = estado.atacanteAtual;
  const nomeDefensor = estado.defensorAtual;

  const defensor = estado.personagens[nomeDefensor];

  estado.log.push({
    tipo: 'tempoDefesaEsgotado',
    defensor: nomeDefensor,
  });

  // recebe dano total do ataque pendente
  const dano = estado.ataquePendente
    ? estado.rolagemAtaque + (estado.ataquePendente.intensidade ?? 0)
    : 0;

  defensor.pontosDeVida -= dano;

  estado.log.push({
    tipo: 'danoPorTempoEsgotado',
    defensor: nomeDefensor,
    dano,
    vidaRestante: defensor.pontosDeVida,
  });

  estado.rolagemAtaque = null;
  estado.rolagemDefesa = null;
  estado.ataquePendente = null;

  if (defensor.pontosDeVida <= 0) {
    estado.finalizado = true;
    estado.fase = 'finalizado';

    estado.log.push({
      tipo: 'fimCombate',
      vencedor: nomeAtacante,
      derrotado: nomeDefensor,
    });

    return;
  }

  // troca turno
  [estado.atacanteAtual, estado.defensorAtual] = [
    estado.defensorAtual,
    estado.atacanteAtual,
  ];

  estado.turno += 1;
  estado.fase = 'aguardandoRolagemTempoAtaque';

  estado.tempoLimite = null;
  estado.tipoTempo = null;
}

function finalizarTempoAtaque(estado) {
  estado.fase = 'aguardandoRolagemAtaque';

  estado.log.push({
    tipo: 'instrucao',
    texto: '🎲 Jogue o dado para iniciar o ataque.',
  });
}

function finalizarTempoDefesa(estado) {
  estado.fase = 'aguardandoRolagemDefesa';

  estado.log.push({
    tipo: 'instrucao',
    texto: '🎲 Jogue o dado para iniciar a defesa.',
  });
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
    direcaoOculta: true,
    intensidade: regraAtaque.intensidade,
    velocidade: regraAtaque.velocidade,
  });

  estado.log.push({
    tipo: 'rolagemAtaqueResultado',
    valor: estado.rolagemAtaque,
  });

  estado.fase = 'aguardandoRolagemTempoPercepcao';

  estado.log.push({
    tipo: 'instrucao',
    texto: '🎲 O defensor rola percepção para tentar antecipar o ataque.',
  });
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

  const defesaBemSucedida =
    resultadoDefesa.valorDefesa >= resultadoAtaqueFinal.valorAtaque;

  let resultadoDirecao = 'errouTudo';
  if (acertosDirecao === 2) resultadoDirecao = 'acertoTotal';
  else if (acertosDirecao === 1) resultadoDirecao = 'acertoParcial';

  let motivoDanoZero = null;

  if (dano === 0) {
    if (resultadoDefesa.evadiu) {
      motivoDanoZero = 'esquivou';
    } else if (defesaBemSucedida && acertosDirecao === 2) {
      motivoDanoZero = 'defesaSuperior';
    } else if (acertosDirecao === 0) {
      motivoDanoZero = 'direcaoErrada';
    }
  }

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
    resultadoDirecao,

    defesaBemSucedida,
    evadiu: resultadoDefesa.evadiu,
    neutralizouGolpe: resultadoDefesa.neutralizouGolpe,
    direcaoCorreta: resultadoDefesa.direcaoCorreta,

    dano,
    motivoDanoZero, // ⭐ chave nova
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

    // limpeza mínima
    estado.rolagemAtaque = null;
    estado.rolagemDefesa = null;
    estado.ataquePendente = null;

    return;
  }

  /* 7) stamina do atacante */
  const atacante = estado.personagens[nomeAtacante];
  const custoAtaque = resultadoAtaqueFinal.valorAtaque;

  /* 6) recuperação de stamina do defensor */
  const resistencia = Number.isFinite(defensor.resistencia)
    ? defensor.resistencia
    : 0;

  const recuperacao = Math.floor(resistencia / 2);

  const staminaAntes = defensor.stamina;

  defensor.stamina = Math.min(100, defensor.stamina + recuperacao);

  atacante.stamina = Math.max(0, atacante.stamina - custoAtaque);

  estado.log.push({
    tipo: 'staminaRecuperada',
    personagem: defensor.nome,
    resistencia,
    recuperacao,
    staminaAntes,
    staminaAtual: defensor.stamina,
  });

  estado.log.push({
    tipo: 'staminaGasta',
    personagem: atacante.nome,
    custo: custoAtaque,
    staminaRestante: atacante.stamina,
  });

  // limpa dados de rolagem
  estado.rolagemAtaque = null;
  estado.rolagemDefesa = null;

  // avança corretamente o fluxo
  estado.fase = 'pausaResolucaoTurno';
}

function executarAvaliacaoIniciativaExtra(estado) {
  const atacante = estado.personagens[estado.atacanteAtual];
  const defensor = estado.personagens[estado.defensorAtual];

  const intensidade = estado.ataquePendente?.intensidade ?? 0;
  const custoMaximo = 20 + intensidade;

  estado.log.push({
    tipo: 'avaliacaoIniciativaExtra',
    atacante: atacante.nome,
    staminaAtual: atacante.stamina,
    staminaNecessaria: custoMaximo,
    podeTentar: atacante.stamina >= custoMaximo,
  });

  estado.log.push({
    tipo: 'instrucao',
    texto: '🎲 Jogue o dado para tentar continuar atacando.',
  });

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

      estado.log.push({
        tipo: 'instrucao',
        texto: '🎲 Jogue o dado para continuar o ataque.',
      });

      estado.ataquePendente = null;
      estado.fase = 'aguardandoRolagemTempoAtaque';
      return;
    }
  }

  // ❌ não conseguiu iniciativa extra → troca turno
  estado.log.push({
    tipo: 'instrucao',
    texto: '🎲 Jogue o dado para definir o tempo de ataque.',
  });

  estado.ataquePendente = null;

  [estado.atacanteAtual, estado.defensorAtual] = [
    estado.defensorAtual,
    estado.atacanteAtual,
  ];

  estado.turno += 1;
  estado.fase = 'aguardandoRolagemTempoAtaque';
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
    case 'resolvendoIniciativa':
      executarFaseIniciativa(estado);
      break;

    case 'aguardandoRolagemTempoAtaque':
      executarRolagemTempoAtaque(estado);
      break;

    case 'preContagemAtaque':
      if (payload.iniciarTempoAtaque) iniciarTempoAtaque(estado);
      break;

    case 'tempoDeAtaque': {
      if (payload.tempoEsgotado) {
        tempoEsgotado(estado);
        break;
      }

      // ✅ Se o jogador escolheu golpe/direção durante o tempo, EXECUTA O ATAQUE AGORA
      if (payload.golpe && payload.direcao) {
        // encerra o timer (limpa)
        estado.tempoLimite = null;
        estado.tipoTempo = null;

        // executa o ataque (isso já rola o dado e muda fase para tempo da defesa)
        executarFaseAtaque(estado, payload);
        break;
      }

      // fallback: só finalizar tempo (sem golpe escolhido)
      if (payload.finalizarTempoAtaque) {
        finalizarTempoAtaque(estado);
        estado.tempoLimite = null;
        estado.tipoTempo = null;
      }

      break;
    }

    case 'aguardandoRolagemAtaque':
      executarRolagemAtaque(estado);
      break;

    case 'aguardandoAtaque':
      executarFaseAtaque(estado, payload);
      break;
    case 'aguardandoRolagemTempoPercepcao':
      executarRolagemTempoPercepcao(estado);
      break;

    case 'preContagemPercepcao':
      if (payload.iniciarTempoPercepcao) {
        estado.fase = 'tempoDePercepcaoInformacao';
      }
      break;

    case 'tempoDePercepcaoInformacao':
      if (payload.finalizarPercepcao) {
        estado.fase = 'aguardandoRolagemTempoDefesa';

        estado.log.push({
          tipo: 'instrucao',
          texto: '🎲 Jogue o dado para definir o tempo de defesa.',
        });
      }
      break;

    case 'aguardandoRolagemTempoDefesa':
      executarRolagemTempoDefesa(estado);
      break;

    case 'preContagemDefesa':
      if (payload.iniciarTempoDefesa) iniciarTempoDefesa(estado);
      break;

    case 'tempoDeDefesa': {
      if (payload.tempoEsgotado) {
        tempoDefesaEsgotado(estado);
        break;
      }

      // ✅ Se o jogador escolheu golpe/direção durante o tempo, EXECUTA A DEFESA AGORA
      if (payload.golpe && payload.direcao) {
        estado.tempoLimite = null;
        estado.tipoTempo = null;

        executarFaseDefesa(estado, payload);
        break;
      }

      if (payload.finalizarTempoDefesa) {
        finalizarTempoDefesa(estado);
        estado.tempoLimite = null;
        estado.tipoTempo = null;
      }

      break;
    }

    case 'aguardandoRolagemDefesa':
      executarRolagemDefesa(estado);
      break;

    case 'aguardandoDefesa':
      executarFaseDefesa(estado, payload);
      break;

    case 'pausaResolucaoTurno':
      if (payload.continuar) {
        estado.fase = 'avaliandoIniciativaExtra';
      }
      break;

    case 'avaliandoIniciativaExtra':
      executarAvaliacaoIniciativaExtra(estado);
      break;

    default:
      throw new Error(`Fase inválida: ${estado.fase}`);
  }
  // 🔥 AQUI É O LUGAR DA CPU 🔥

  return null;
}

module.exports = {
  criarEstadoInicial,
  executarTurno,
};
