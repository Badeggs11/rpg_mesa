function limitar(valor, min = 3, max = 20) {
  return Math.min(max, Math.max(min, valor));
}

function atravessarRio(personagem, rio) {
  const dificuldadeBase =
    rio.correnteza + rio.largura + rio.obstaculos + rio.predadores;

  const predisposicaoPersonagem =
    (personagem.forca || 0) +
    (personagem.agilidade || 0) +
    (personagem.habilidade || 0);

  let valorSolicitado = dificuldadeBase - predisposicaoPersonagem;

  valorSolicitado = limitar(valorSolicitado, 3, 20);

  return {
    tipo: 'desafio',
    nome: 'Atravessar Rio',
    testes: 1,
    dado: 20,
    dificuldade: valorSolicitado,
    descricao:
      'O personagem tenta atravessar um rio perigoso enfrentando correnteza, largura, obstáculos e predadores naturais.',
  };
}
function abrirPortaAntiga(personagem, porta) {
  const { peso = 2, desgaste = 0, trancada = false } = porta;

  let dificuldadeBase = peso + desgaste;
  if (trancada) dificuldadeBase += 10;

  const predisposicaoPersonagem = personagem.forca || 0;
  let valorSolicitado = dificuldadeBase - predisposicaoPersonagem;

  valorSolicitado = limitar(valorSolicitado, 2, 20);

  return {
    tipo: 'desafio',
    nome: 'Abrir Porta Antiga',
    testes: 1,
    dado: 20,
    dificuldade: valorSolicitado,
    descricao: 'Uma porta de madeira antiga reforçada com metal enferrujado',
  };
}
function escalarMuro(personagem, muro) {
  const dificuldadeBase = muro.altura + muro.irregularidades;
  if (muro.superficieEscorregadia) dificuldadeBase += 2;
  const predisposicaoPersonagem =
    (personagem.forca || 0) + (personagem.agilidade || 0);

  let valorSolicitado = dificuldadeBase - predisposicaoPersonagem;

  valorSolicitado = limitar(valorSolicitado, 3, 20);
  return {
    tipo: 'desafio',
    nome: 'Escalar Muro',
    testes: muro.altura > 3 ? 3 : 2,
    dado: 20,
    dificuldade: valorSolicitado,
    descricao: 'O personagem tenta escalar um muro',
  };
}

function defesaFisica({ defensor, golpe, direcao }) {
  const intensidade =
    golpe.intensidadeBase *
      defensor.resistencia *
      golpe.intensidadeBase *
      defensor.forca +
    golpe.bonusIntensidade;

  const velocidade =
    golpe.velocidadeBase * (defensor.agilidade + defensor.percepcao) +
    golpe.bonusVelocidade;

  return {
    tipo: 'defesaFisica',
    estilo: golpe.nome,
    direcao,

    intensidade,
    velocidade,
  };
}

function esquiva(personagem) {
  const base = (personagem.agilidade || 0) + (personagem.sorte || 0);
  return {
    tipo: 'defesa',
    estilo: 'esquiva',
    dado: 20,
    base,
    descricao: 'O personagem tenta desviar do ataque.',
  };
}

function defesaMagica(personagem) {
  const base = (personagem.resistencia || 0) + (personagem.inteligencia || 0);
  return {
    tipo: 'defesa',
    estilo: 'magica',
    dado: 20,
    base,
    descricao: 'O personagem tenta resistir ao efeito mágico.',
  };
}
function resistirVeneno(personagem) {
  const base = (personagem.resistencia || 0) + (personagem.forca || 0);
  return {
    tipo: 'defesa',
    estilo: 'resisteVeneno',
    dado: 20,
    base,
    descricao: 'O corpo tenta neutralizar o veneno.',
  };
}
function fugir(personagem) {
  const base = (personagem.agilidade || 0) + (personagem.sorte || 0);
  return {
    tipo: 'defesa',
    estilo: 'fuga',
    dado: 20,
    base,
    limiarSucesso: 15,
    descricao: 'O personagem tenta fugir do combate.',
  };
}

function ataqueFisico({ atacante, golpe, direcao }) {
  const intensidade =
    golpe.intensidadeBase * atacante.forca +
    golpe.intensidadeBase * atacante.agilidade +
    golpe.bonusIntensidade;

  const velocidade =
    golpe.velocidadeBase * (atacante.agilidade + atacante.percepcao) +
    golpe.bonusVelocidade;

  return {
    tipo: 'ataqueFisico',
    estilo: golpe.nome,
    direcao,

    intensidade,
    velocidade,
  };
}

function ataqueMagico(personagem, magia) {
  const base = (personagem.poder || 0) + (personagem.inteligencia || 0);
  return {
    tipo: 'ataque',
    estilo: 'magico',
    ataque: {
      base,
      dado: 20,
      parametros: {
        precisao: magia.precisao,
        poder: magia.poder,
        velocidade: magia.velocidade,
      },
    },
    dano: {
      dado: magia.dadoDano,
    },
    defesaAlvo: ['magica', 'esquiva', 'fuga'],
    descricao: `O personagem ataca com ${magia.nome}.`,
  };
}

module.exports = {
  atravessarRio,
  abrirPortaAntiga,
  escalarMuro,
  defesaFisica,
  esquiva,
  defesaMagica,
  resistirVeneno,
  fugir,
  ataqueFisico,
  ataqueMagico,
};
