const fs = require('fs');
const path = require('path');

function tentarCarregar(caminhoArquivo) {
  try {
    if (!fs.existsSync(caminhoArquivo)) return null;

    const conteudo = fs.readFileSync(caminhoArquivo, 'utf-8');
    const estado = JSON.parse(conteudo);

    // Validação mínima de integridade
    if (!estado || !estado.meta || !estado.mundo) {
      throw new Error('Save inválido estruturalmente');
    }

    return estado;
  } catch (erro) {
    console.warn(`Falha ao carregar save: ${path.basename(caminhoArquivo)}`);
    return null;
  }
}

function carregarAutosaveMaisRecente() {
  const pastaSaves = path.join(process.cwd(), 'saves');

  const slots = [
    'autosave_1.json', // mais recente
    'autosave_2.json', // backup
    'autosave_3.json', // mais antigo estável
  ];

  for (const nomeArquivo of slots) {
    const caminho = path.join(pastaSaves, nomeArquivo);
    const estado = tentarCarregar(caminho);

    if (estado) {
      console.log(`🌍 Autosave carregado com sucesso: ${nomeArquivo}`);
      return estado;
    }
  }

  throw new Error(
    'Nenhum autosave válido encontrado. Campanha pode estar corrompida.'
  );
}

module.exports = carregarAutosaveMaisRecente;
