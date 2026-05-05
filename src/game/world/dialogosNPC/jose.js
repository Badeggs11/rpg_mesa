const dialogosJose = {
  npcId: 'jose_barman',

  falasPorConfianca: {
    baixa: [
      'José olha desconfiado: "Não te conheço. O que você quer?"',
      'José seca um copo devagar: "Se veio causar problema, escolha outra taverna."',
    ],

    media: [
      'José responde com cautela: "Se for rápido, posso ouvir."',
      'José apoia as mãos no balcão: "Fale. Mas seja direto."',
    ],

    alta: [
      'José relaxa um pouco: "Se precisar de trabalho ou comida, talvez eu tenha algo pra você."',
      'José baixa a voz: "Você parece precisar de ajuda. Talvez eu possa arrumar alguma coisa."',
    ],
  },

  respostasPorIntencao: {
    aceitar_comida: {
      baixa:
        'José encara você por um instante: "Certo. Eu te dou umas sobras. Mas depois você vai me dever um favor."',

      media:
        'José pega um pequeno prato nos fundos: "Aqui estão as sobras. Coma. Depois preciso que você resolva uma coisa para mim."',

      alta: 'José entrega as sobras com discrição: "Pegue. Você vai precisar de força. Depois conversamos sobre o favor."',
    },
    pedir_comida: {
      baixa:
        'José olha para você por alguns segundos: "Comida não sobra fácil por aqui. Mas talvez tenha um pedaço de pão velho nos fundos."',

      media:
        'José suspira: "Tenho umas sobras da cozinha. Não é banquete, mas mata a fome."',

      alta: 'José abaixa a voz: "Tenho um ensopado guardado. Sente ali. Mas depois talvez eu precise de um favor."',
    },

    pedir_trabalho: {
      baixa:
        'José cruza os braços: "Trabalho? Para alguém que acabou de entrar? Prove que não vai me dar dor de cabeça."',

      media:
        'José aponta para o salão: "Tem barris para carregar e mesas para limpar. Pago pouco, mas pago."',

      alta: 'José se aproxima: "Tenho um serviço mais delicado. Mas não posso falar alto sobre isso."',
    },

    pedir_informacao: {
      baixa: 'José desvia o olhar: "Informação custa. E confiança também."',

      media:
        'José fala baixo: "Tem coisa estranha acontecendo perto da capela. Só isso que vou dizer."',

      alta: 'José olha para a porta antes de responder: "A vila não está vazia. Só parece vazia."',
    },

    cumprimento: {
      baixa:
        'José responde sem sorrir: "Boa noite. Vai querer alguma coisa ou só ocupar espaço?"',

      media: 'José acena com a cabeça: "Boa noite. Fale."',

      alta: 'José sorri de canto: "Boa noite. Bom te ver vivo de novo."',
    },

    despedida: {
      baixa: 'José volta a limpar o balcão: "Então vá."',

      media: 'José diz: "Cuidado lá fora."',

      alta: 'José fala com seriedade: "Volte inteiro. A vila anda engolindo gente."',
    },

    nao_entendi: {
      baixa:
        'José franze a testa: "Não entendi o que você quer. Fale direito ou não vou poder ajudar."',

      media:
        'José inclina a cabeça: "Explique melhor. Não estou conseguindo entender."',

      alta: 'José responde com calma: "Desculpa, não consegui entender. Me diga de outro jeito e talvez eu possa ajudar."',
    },
  },
};

module.exports = { dialogosJose };
