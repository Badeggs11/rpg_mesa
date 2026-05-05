function calcularDistancia(origem, destino) {
  const dx = Math.abs(destino.x - origem.x);
  const dy = Math.abs(destino.y - origem.y);

  return Math.max(dx, dy);
}

function calcularQuantidadeDeD6(distanciaTotal) {
  return Math.max(1, Math.ceil(distanciaTotal / 6));
}

function calcularCustoMovimento({
  origem,
  destino,
  progressoAtual = 0,
  resultadoDado = 0,
}) {
  if (!origem || typeof origem.x !== 'number' || typeof origem.y !== 'number') {
    throw new Error('Origem inválida');
  }

  if (
    !destino ||
    typeof destino.x !== 'number' ||
    typeof destino.y !== 'number'
  ) {
    throw new Error('Destino inválido');
  }

  const distanciaTotal = calcularDistancia(origem, destino);
  const quantidadeDeD6 = calcularQuantidadeDeD6(distanciaTotal);

  const progressoAcumulado = progressoAtual + resultadoDado;
  const faltando = Math.max(0, distanciaTotal - progressoAcumulado);
  const conseguiuMover = progressoAcumulado >= distanciaTotal;

  return {
    distanciaTotal,
    quantidadeDeD6,
    progressoAnterior: progressoAtual,
    resultadoDado,
    progressoAcumulado,
    faltando,
    conseguiuMover,
  };
}

module.exports = {
  calcularDistancia,
  calcularQuantidadeDeD6,
  calcularCustoMovimento,
};
