const { alimentos } = require('./alimentos');

const itens = {
  ...alimentos,
};

module.exports = {
  itens,
  alimentos,
};
