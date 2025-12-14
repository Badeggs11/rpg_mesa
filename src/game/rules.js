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
function resistirVeneno(personagem, veneno) {
  const { toxicidade = 1, persistente = false } = veneno;
  let dificuldadeBase = 3 + toxicidade;
  if (persistente) dificuldadeBase += 3;

  const predisposicaoPersonagem =
    (personagem.resistencia || 0) + (personagem.vigor || 0);

  let valorSolicitado = dificuldadeBase - predisposicaoPersonagem;

  valorSolicitado = limitar(valorSolicitado, 3, 20);

  return {
    nome: "Resistir Veneno",
    testes: 2,
    dado: 20,
    dificuldade: valorSolicitado,
    atributos: ["resistencia", "vigor"],
    descricao: "O corpo do personagem tenta neutralizar o veneno",
  };
}
function resistirMagia(personagem, magia) {
  const { intensidade = 1, tipo = "sombria", persistente = false } = magia;
  let dificuldadeBase = 2 * intensidade;
  if (persistente) dificuldadeBase += 2;

  const predisposicaoPersonagem =
    (personagem.inteligencia || 0) + (personagem.poder || 0);

  let valorSolicitado = dificuldadeBase - predisposicaoPersonagem;
  valorSolicitado = limitar(valorSolicitado, 3, 20);
  return {
    nome: "Resistir Magia",
    testes: 2,
    dado: 20,
    dificuldade: valorSolicitado,
    atributos: ["inteligencia", "poder"],
    descricao: `O personagem tenta resistir a uma magia ${tipo} que afeta a mente ou o corpo`,
  };
}

function esquivar(personagem, ataqueInimigo) {
  const { precisao = 1, velocidade = 1, bonusDificuldade = 0 } = ataqueInimigo;
  const penalidadeFerimento = personagem.ferido ? 2 : 0;
  let dificuldadeBase =
    1 + precisao + velocidade + bonusDificuldade + penalidadeFerimento;
  const predisposicaoPersonagem =
    (personagem.agilidade || 0) + (personagem.sorte || 0);
  let valorSolicitado = dificuldadeBase - predisposicaoPersonagem;
  valorSolicitado = limitar(valorSolicitado, 2, 20);
  return {
    nome: "Esquivar",
    testes: 1,
    dado: 20,
    dificuldade: valorSolicitado,
    atributos: ["agilidade", "sorte"],
    descricao: "O personagem tenta desviar de um ataque iminente",
  };
}
function ataqueFisico(atacante, defensor, ataque, defesaEscolhida) {
  const {
    precisao = 1,
    velocidade = 1,
    forca = 1,
    bonusDificuldade = 0,
  } = ataque;

  // parâmetros do “sistema” (padrões do ataque físico)
  const testes = 1;
  const dado = 20;

  const bonusDefesa = (defensor.forca || 0) + (defensor.sorte || 0);

  const defesaValor = bonusDefesa + (defesaEscolhida?.valor || 0);

  // dificuldade base de acertar
  const dificuldadeBase = 10 + defesaValor + velocidade + bonusDificuldade;

  const predisposicaoAtacante =
    (atacante.forca || 0) + (atacante.sorte || 0) + precisao + forca;

  // saldo ofensivo (pode ser negativo)
  const dificuldade = predisposicaoAtacante - dificuldadeBase;

  return {
    nome: "Ataque Físico",
    tipo: "ataque",
    subtipo: "fisico",
    testes,
    dado,
    dificuldade,
    atributos: ["forca", "sorte"],
    descricao: "O atacante desfere um golpe físico contra o inimigo",
  };
}
function ataqueMagico(atacante, defensor, magia, defesaEscolhida) {
  const {
    precisao = 1,
    velocidade = 1,
    qtdPoder = 1,
    bonusDificuldade = 0,
  } = magia;

  // padrões do sistema
  const testes = 1;
  const dado = 20;

  const bonusDefesa = (defensor.inteligencia || 0) + (defensor.poder || 0);

  const defesaValor = bonusDefesa + (defesaEscolhida?.valor || 0);

  const dificuldadeBase = 10 + defesaValor + velocidade + bonusDificuldade;

  const predisposicaoAtacante =
    (atacante.inteligencia || 0) + (atacante.poder || 0) + precisao + qtdPoder;

  const dificuldade = predisposicaoAtacante - dificuldadeBase;

  return {
    nome: "Ataque Mágico",
    tipo: "ataque",
    subtipo: "magico",
    testes,
    dado,
    dificuldade,
    atributos: ["inteligencia", "poder"],
    descricao: "O atacante conjura uma magia contra o inimigo",
  };
}

const regras = {
  atravessarRio,
  abrirPortaAntiga,
  escalarMuro,
  resistirVeneno,
  resistirMagia,
  esquivar,
  ataqueFisico,
  ataqueMagico,
};
function getRegra(nome) {
  const regra = regras[nome];
  if (!regra) {
    throw new Error(`Regra '${nome}' não encontrada.`);
  }
  return regra;
}

module.exports = {
  regras,
  getRegra,
};
