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

  const MIN = 3;
  const MAX = 20;

  valorSolicitado = Math.min(MAX, Math.max(MIN, valorSolicitado));

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

  valorSolicitado = Math.min(MAX, Math.max(MIN, valorSolicitado));

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
  const MIN = 3;
  const MAX = 20;
  valorSolicitado = Math.min(MAX, Math.max(MIN, valorSolicitado));
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

  const MIN = 3;
  const MAX = 20;
  valorSolicitado = Math.min(MAX, Math.max(MIN, valorSolicitado));

  return {
    nome: "Resistir Veneno",
    teste: 2,
    dado: 20,
    dificuldade: valorSolicitado,
    atributos: ["resistencia", "vigor"],
    descricao: "O corpo do personagem tenta neutralizar o veneno",
  };
}
function ataqueFisico(atacante, ataque, defesa) {
  const { poder = 1, precisao = 1 } = ataque;
  const { bloqueio = 0, esquiva = 0 } = defesa;
  const ataqueTotal =
    poder + (atacante.forca || 0) + (atacante.sorte || 0) + precisao;
  const defesaTotal = bloqueio + esquiva;

  const danoCausado = Math.max(0, ataqueTotal - defesaTotal);

  return {
    nome: "Ataque Físico",
    danoCausado,
    tipo: "fisico",
    descricao: "O atacante desfere um golpe físico contra o inimigo",
  };
}
function ataqueMagico(atacante, magia, defesa) {
  const { poder = 1, controle = 1 } = magia;
  const { resistenciaMagica = 0 } = defesa;
  const ataqueTotal =
    poder + (atacante.inteligencia || 0) + (atacante.poder || 0) + controle;
  const defesaTotal = resistenciaMagica;

  const danoCausado = Math.max(0, ataqueTotal - defesaTotal);

  return {
    nome: "Ataque Mágico",
    danoCausado,
    tipo: "magico",
    descriçao: "O atacante conjura uma magia contra o inimigo",
  };
}
