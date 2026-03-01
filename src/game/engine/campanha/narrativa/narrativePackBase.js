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
