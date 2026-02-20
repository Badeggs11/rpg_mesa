const fs = require('fs');
const path = require('path');
const serializarEstadoCampanha = require('./serializarEstadoCampanha');

function salvarEstadoCampanha(estado, nomeSave = 'save_campanha') {
  if (!estado) {
    throw new Error('Estado da campanha inválido para salvamento.');
  }

  // 📦 Serializa o estado (estrutura limpa)
  const estadoSerializado = serializarEstadoCampanha(estado);

  // 🗂 Caminho da pasta de saves
  const pastaSaves = path.join(
    process.cwd(),
    'saves'
  );

  // Cria a pasta se não existir
  if (!fs.existsSync(pastaSaves)) {
    fs.mkdirSync(pastaSaves, { recursive: true });
  }

  // 📝 Caminho do arquivo
  const caminhoArquivo = path.join(
    pastaSaves,
    `${nomeSave}.json`
  );

  // 💾 Salva em JSON (legível e debuggável)
  fs.writeFileSync(
    caminhoArquivo,
    JSON.stringify(estadoSerializado, null, 2),
    'utf-8'
  );

  return {
    sucesso: true,
    caminho: caminhoArquivo,
  };
}

module.exports = salvarEstadoCampanha;
