function limitar(valor, min = 3, max = 20) {
  return Math.min(max, Math.max(min, valor));
}

function atravessarRio(personagem, rio) {
  const {
    correnteza = 1,
    largura = 1,
    obstaculos = 0,
    predadores = 0,
    chuva = false,
  } = rio;

  let dificuldadeBase = correnteza + largura + obstaculos + predadores;
  if (chuva) dificuldadeBase += 2;
  const predisposicaoPersonagem =
    (personagem.forca || 0) +
    (personagem.agilidade || 0) +
    (personagem.habilidade || 0);

  let valorSolicitado = dificuldadeBase - predisposicaoPersonagem;

  valorSolicitado = limitar(valorSolicitado, 3, 20);

  return {
    tipo: "desafio",
    nome: "Atravessar Rio",
    testes: 1,
    dado: 20,
    dificuldade: valorSolicitado,
    descricao:
      "O personagem tenta atravessar um rio perigoso enfrentando correnteza, largura, obstáculos e predadores naturais.",
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
    tipo: "desafio",
    nome: "Abrir Porta Antiga",
    testes: 1,
    dado: 20,
    dificuldade: valorSolicitado,
    descricao: "Uma porta de madeira antiga reforçada com metal enferrujado",
  };
}
function escalarMuro(personagem, muro) {
  const { altura = 2, superficieEscorregadia = false } = muro;
  let dificuldadeBase = 2 + altura;
  if (superficieEscorregadia) dificuldadeBase += 3;
  const predisposicaoPersonagem =
    (personagem.forca || 0) + (personagem.agilidade || 0);

  let valorSolicitado = dificuldadeBase - predisposicaoPersonagem;

  valorSolicitado = limitar(valorSolicitado, 3, 20);
  return {
    tipo: "desafio",
    nome: "Escalar Muro",
    testes: altura > 3 ? 3 : 2,
    dado: 20,
    dificuldade: valorSolicitado,
    descricao: "O personagem tenta escalar um muro",
  };
}
function defesaFisica(personagem) {
  const base = (personagem.forca || 0) + (personagem.resistencia || 0);
  return {
    tipo: "defesa",
    estilo: "fisica",
    dado: 20,
    base,
    descricao: "O personagem tenta bloquear ou absorver o ataque.",
  };
}
function esquivar(personagem) {
  const base = (personagem.agilidade || 0) + (personagem.sorte || 0);
  return {
    tipo: "defesa",
    estilo: "esquiva",
    dado: 20,
    base,
    descricao: "O personagem tenta desviar do ataque.",
  };
}

function resistirMagia(personagem) {
  const base = (personagem.resistencia || 0) + (personagem.forca || 0);
  return {
    tipo: "defesa",
    estilo: "resisteMagia",
    dado: 20,
    base,
    descricao: "O personagem tenta resistir ao efeito mágico.",
  };
}
function resistirVeneno(personagem) {
  const base = (personagem.resistencia || 0) + (personagem.forca || 0);
  return {
    tipo: "defesa",
    estilo: "resisteVeneno",
    dado: 20,
    base,
    descricao: "O corpo tenta neutralizar o veneno.",
  };
}
function fugir(personagem) {
  const base = (personagem.agilidade || 0) + (personagem.sorte || 0);
  return {
    tipo: "defesa",
    estilo: "fuga",
    dado: 20,
    base,
    limiarSucesso: 15,
    descricao: "O personagem tenta fugir do combate.",
  };
}

function ataqueFisico(personagem, arma) {
  const base =
    (personagem.forca || 0) +
    (personagem.inteligencia || 0) +
    (personagem.agilidade || 0);
  return {
    tipo: "ataque",
    estilo: "fisico",
    ataque: {
      base,
      dado: 20,
      parametros: {
        precisao: arma.precisao,
        poder: arma.poder,
        velocidade: arma.velocidade,
      },
    },
    dano: {
      dado: arma.dadoDano,
    },
    defesaAlvo: ["fisica", "esquiva"],
    descricao: `O personagem ataca com ${arma.nome}.`,
  };
}
function ataqueMagico(personagem, magia) {
  const base = (personagem.poder || 0) + (personagem.inteligencia || 0);
  return {
    tipo: "ataque",
    estilo: "magico",
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
    defesaAlvo: ["resisteMagia", "esquiva", "fuga"],
    descricao: `O personagem ataca com ${magia.nome}.`,
  };
}

module.exports = {
  atravessarRio,
  abrirPortaAntiga,
  escalarMuro,
  defesaFisica,
  esquivar,
  resistirMagia,
  resistirVeneno,
  fugir,
  ataqueFisico,
  ataqueMagico,
};
