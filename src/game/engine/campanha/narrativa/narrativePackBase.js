const narrativePackBase = {
  ambiente: {
    tensao_baixa: [
      'O ambiente parece tranquilo, mas atento.',
      'Nada fora do comum chama sua atenção.',
    ],
    tensao_media: [
      'O ambiente parece instável, como se algo estivesse prestes a mudar.',
      'Uma leve tensão paira no ar, difícil de ignorar.',
    ],
    tensao_alta: [
      'O ar parece pesado e carregado.',
      'Há uma sensação de perigo iminente.',
    ],
  },

  exploracao: [
    'observa atentamente os arredores da vila.',
    'caminha lentamente entre as casas silenciosas.',
    'examina as ruas vazias da vila abandonada.',
  ],

  investigacao: [
    'examina cuidadosamente o chão entre as casas.',
    'analisa sinais estranhos nas paredes e no chão.',
    'procura pistas deixadas recentemente.',
  ],

  observacao: [
    'permanece em silêncio observando o ambiente.',
    'escuta atentamente os sons da vila.',
    'analisa cuidadosamente cada movimento ao redor.',
  ],

  descanso: [
    'decide descansar por alguns minutos.',
    'senta-se por um instante para recuperar o fôlego.',
    'faz uma pausa breve para reorganizar os pensamentos.',
  ],

  descoberta: {
    nenhuma: ['Você observa ao redor, mas nada relevante se revela.'],
    parcial: ['Pequenos detalhes sugerem algo fora do lugar.'],
    alta: ['Você percebe sinais claros de atividade recente.'],
  },

  npc: {
    assustado: [
      'A voz do NPC treme, carregada de medo.',
      'Ele hesita antes de qualquer resposta.',
    ],
    confiando: [
      'A postura do NPC relaxa levemente.',
      'Ele parece mais disposto a dialogar.',
    ],
  },

  cronicaRodada: [
    'O mundo avança silenciosamente para uma nova rodada.',
    'As engrenagens invisíveis da campanha continuam em movimento.',
    'Mesmo sem grandes eventos, o tempo do mundo não para.',
  ],
};

module.exports = { narrativePackBase };
