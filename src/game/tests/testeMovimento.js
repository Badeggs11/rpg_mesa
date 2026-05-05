const {
  calcularCustoMovimento,
} = require('../engine/campanha/movimento/calcularCustoMovimento');

const origem = { x: 500, y: 300 };
const destino = { x: 506, y: 300 };

// turno 1
const resultado1 = calcularCustoMovimento({
  origem,
  destino,
  progressoAtual: 0,
  resultadoDado: 3,
});

console.log('TURNO 1');
console.log(resultado1);

// turno 2
const resultado2 = calcularCustoMovimento({
  origem,
  destino,
  progressoAtual: resultado1.progressoAcumulado,
  resultadoDado: 3,
});

console.log('TURNO 2');
console.log(resultado2);
