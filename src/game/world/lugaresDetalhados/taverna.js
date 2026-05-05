const tavernaDetalhada = {
  id: 'taverna',
  nome: 'Taverna do Javali Risonho',
  tipo: 'ambiente_interno',
  imagem: '/imagens/lugares/taverna.png',
  descricaoCurta:
    'Uma taverna acolhedora, com cheiro de cerveja, madeira antiga e comida quente.',

  descricaoCompleta:
    'O interior da Taverna do Javali Risonho é quente e vivo. Mesas de madeira espalham-se pelo salão, algumas ocupadas por viajantes cansados, mercadores falantes e figuras encapuzadas em conversas discretas. Cadeiras rangem no assoalho gasto. No balcão, canecas, garrafas e pratos se acumulam sob a luz amarelada de lampiões. Atrás do balcão, o barman limpa um copo com expressão atenta. Uma garçonete circula entre as mesas levando bebidas e pratos, desviando com prática dos clientes e dos bancos apertados. O ar mistura cheiro de cerveja, ensopado, fumaça de lareira e rumores da vila.',

  elementosVisiveis: [
    'mesas de madeira',
    'cadeiras espalhadas pelo salão',
    'canecas e garrafas sobre as mesas',
    'pratos com restos de comida',
    'um balcão de atendimento',
    'prateleiras com bebidas',
    'lampiões iluminando o ambiente',
    'clientes conversando baixo',
    'uma garçonete atendendo as mesas',
    'um barman atrás do balcão',
  ],

  npcsPresentes: [
    {
      id: 'barman_taverna',
      nome: 'Barman da Taverna',
      funcao: 'atendente',
      descricao: 'Um homem atento, acostumado a ouvir mais do que fala.',
    },
    {
      id: 'garconete_taverna',
      nome: 'Garçonete da Taverna',
      funcao: 'atendente',
      descricao:
        'Uma atendente ágil que circula entre as mesas com equilíbrio e pressa.',
    },
  ],

  sensacoes: {
    som: 'Risadas baixas, canecas batendo, cadeiras arrastando e murmúrios de conversa.',
    cheiro: 'Cerveja, comida quente, madeira antiga e um leve traço de fumaça.',
    clima: 'Aconchegante, movimentado e ligeiramente barulhento.',
  },
};

module.exports = { tavernaDetalhada };
