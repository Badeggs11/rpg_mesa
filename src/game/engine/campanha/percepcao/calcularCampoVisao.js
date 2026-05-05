const { mapaBase } = require('../../../world/mapas/mapaBase');

function verificarLocalNaPosicao(x, y) {
  let localMaisProximo = null;
  let menorDistancia = Infinity;

  for (const key in mapaBase) {
    const local = mapaBase[key];

    const dx = local.pos.x - x;
    const dy = local.pos.y - y;

    const distancia = Math.sqrt(dx * dx + dy * dy);

    if (distancia < menorDistancia) {
      menorDistancia = distancia;
      localMaisProximo = local;
    }
  }

  // 👇 limite de detecção (ajuste fino)
  const LIMITE_DETECCAO = 2;

  if (menorDistancia <= LIMITE_DETECCAO) {
    return {
      tipo: 'local',
      id: localMaisProximo.id,
      nome: localMaisProximo.nome,
    };
  }

  return null;
}

function calcularCampoVisao(posicaoJogador, alcancePercepcao) {
  console.log('🔎 calcularCampoVisao foi executado');

  const matriz = [];

  for (let dy = -alcancePercepcao; dy <= alcancePercepcao; dy++) {
    const linha = [];

    for (let dx = -alcancePercepcao; dx <= alcancePercepcao; dx++) {
      const distancia = Math.max(Math.abs(dx), Math.abs(dy));

      const xReal = posicaoJogador.x + dx;
      const yReal = posicaoJogador.y + dy;

      if (dx === 0 && dy === 0) {
        linha.push({
          x: posicaoJogador.x,
          y: posicaoJogador.y,
          tipo: 'jogador',
        });
      } else {
        const local = verificarLocalNaPosicao(xReal, yReal);

        if (local) {
          linha.push({
            x: xReal,
            y: yReal,
            tipo: 'local',
            nome: local.nome,
            distancia,
          });
        } else {
          linha.push({
            x: xReal,
            y: yReal,
            tipo: 'vazio',
            distancia,
          });
        }
      }
    }

    matriz.push(linha);
  }

  return matriz;
}

module.exports = { calcularCampoVisao };
