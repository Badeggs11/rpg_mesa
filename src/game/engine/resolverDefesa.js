const { jogarDado } = require("../dice");

function resolverDefesa(defesa) {
  const rolagem = jogarDado(defesa.dado);
  const valorDefesa = rolagem + defesa.base;

  let sucesso = true;

  if (defesa.limiarSucesso !== undefined) {
    sucesso = valorDefesa >= defesa.limiarSucesso;
  }

  return {
    tipo: "resultadoDefesa",
    estilo: defesa.estilo,
    rolagem,
    base: defesa.base,
    valorDefesa,
    sucesso,
    descricao: defesa.descricao,
  };
}

module.exports = { resolverDefesa };
