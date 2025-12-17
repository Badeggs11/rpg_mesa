const { jogarDado } = require("./dice");

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
    nome: "Atravessar Rio",
    testes: 1,
    dado: 20,
    dificuldade: valorSolicitado,
    atributos: ["forca", "agilidade", "habilidade"],
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
    nome: "Abrir Porta Antiga",
    testes: 1,
    dado: 20,
    dificuldade: valorSolicitado,
    atributos: ["forca"],
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
    nome: "Escalar Muro",
    testes: altura > 3 ? 3 : 2,
    dado: 20,
    dificuldade: valorSolicitado,
    atributos: ["forca", "agilidade"],
    descricao: "O personagem tenta escalar um muro",
  };
}
function defesaFisica(personagem) {
  const rolagem = jogarDado(20);

  const valorDefesa =
    rolagem + (personagem.forca || 0) + (personagem.resistencia || 0);

  return {
    tipo: "defesaFisica",
    rolagem,
    valorDefesa,
    descricao: "O personagem tenta bloquear ou absorver o ataque.",
  };
}
function esquivar(personagem) {
  const rolagem = jogarDado(20);

  const valorDefesa =
    rolagem + (personagem.agilidade || 0) + (personagem.sorte || 0);

  return {
    tipo: "esquiva",
    rolagem,
    valorDefesa,
    descricao: "O personagem tenta desviar do ataque.",
  };
}
function resistirMagia(personagem) {
  const rolagem = jogarDado(20);

  const valorDefesa =
    rolagem + (personagem.inteligencia || 0) + (personagem.poder || 0);

  return {
    tipo: "resistirMagia",
    rolagem,
    valorDefesa,
    descricao: "O personagem tenta resistir ao efeito mágico.",
  };
}
function resistirVeneno(personagem) {
  const rolagem = jogarDado(20);

  const valorDefesa =
    rolagem + (personagem.resistencia || 0) + (personagem.vigor || 0);

  return {
    tipo: "resistirVeneno",
    rolagem,
    valorDefesa,
    descricao: "O corpo tenta neutralizar o veneno.",
  };
}
function defesaFugir(personagem) {
  const rolagem = jogarDado(20);

  const valorDefesa =
    rolagem + (personagem.agilidade || 0) + (personagem.sorte || 0);

  return {
    tipo: "fuga",
    rolagem,
    valorDefesa,
    sucesso: valorDefesa >= 15,
    descricao: "O personagem tenta fugir do combate.",
  };
}
function ataqueFisico(atacante, ataque, defesaFn, defensor) {
  const { precisao = 1, forca = 1 } = ataque;

  const rolagemAtaque = jogarDado(20);

  const bonusAtributos = (atacante.forca || 0) + (atacante.sorte || 0);

  const valorAtaque = rolagemAtaque + bonusAtributos + precisao + forca;

  const defesa = defesaFn(defensor);
  const diferenca = valorAtaque - defesa.valorDefesa;

  const danoCausado = Math.max(0, valorAtaque - defesa.valorDefesa);

  return {
    tipo: "ataqueFisico",

    ataque: {
      rolagem: rolagemAtaque,
      bonusAtributos,
      precisao,
      forca,
      valorAtaque,
    },

    defesa,

    resultado: {
      diferenca,
      danoCausado,
    },

    descricao: "O atacante desfere um golpe físico contra o inimigo.",
  };
}
function ataqueMagico(atacante, magia, defesaFn, defensor) {
  const { precisao = 1, qtdPoder = 1 } = magia;

  const rolagemAtaque = jogarDado(20);

  const valorAtaque =
    rolagemAtaque +
    (atacante.inteligencia || 0) +
    (atacante.poder || 0) +
    precisao +
    qtdPoder;

  const defesa = defesaFn(defensor);

  const danoCausado = Math.max(0, valorAtaque - defesa.valorDefesa);

  return {
    tipo: "ataqueMagico",

    ataque: {
      rolagem: rolagemAtaque,
      precisao,
      qtdPoder,
      valorAtaque,
    },
    defesa,

    resultado: {
      danoCausado,
    },
    descricao: "O atacante conjura uma magia contra o inimigo.",
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
  defesaFugir,
  ataqueFisico,
  ataqueMagico,
};
