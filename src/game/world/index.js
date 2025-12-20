const rios = require("./ambientes/rios");
const muros = require("./ambientes/muros");
const espadas = require("./armas/espadas");
const poderesFogo = require("./poderes/fogo");

module.exports = {
  ambientes: { rios, muros },
  armas: { espadas },
  poderes: { fogo: poderesFogo },
};
