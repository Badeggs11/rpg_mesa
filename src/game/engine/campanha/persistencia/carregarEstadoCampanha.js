const fs = require('fs');
const path = require('path');

function carregarEstadoCampanha(nomeSave = 'save_campanha') {
  const caminhoArquivo = path.join(process.cwd(), 'saves', `${nomeSave}.json`);

  if (!fs.existsSync(caminhoArquivo)) {
    throw new Error(`Save não encontrado: ${nomeSave}`);
  }

  const conteudo = fs.readFileSync(caminhoArquivo, 'utf-8');
  const estadoCarregado = JSON.parse(conteudo);

  return estadoCarregado;
}

module.exports = carregarEstadoCampanha;
