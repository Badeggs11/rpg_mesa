const {
  calcularCampoVisao,
} = require('../engine/campanha/percepcao/calcularCampoVisao');

const resultado = calcularCampoVisao({ x: 500, y: 300 }, 3);

console.log('🧪 RESULTADO DO CAMPO DE VISÃO:');
console.log(JSON.stringify(resultado, null, 2));
