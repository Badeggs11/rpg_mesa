const fs = require('fs');
const path = require('path');
const serializarEstadoCampanha = require('./serializarEstadoCampanha');

function moverSeExistir(origem, destino) {
  if (fs.existsSync(origem)) {
    fs.renameSync(origem, destino);
  }
}

function autosaveCampanha(estado) {
  if (!estado) return;

  try {
    const pastaSaves = path.join(process.cwd(), 'saves');

    // Garante que a pasta existe
    if (!fs.existsSync(pastaSaves)) {
      fs.mkdirSync(pastaSaves, { recursive: true });
    }

    const caminhoSave1 = path.join(pastaSaves, 'autosave_1.json');
    const caminhoSave2 = path.join(pastaSaves, 'autosave_2.json');
    const caminhoSave3 = path.join(pastaSaves, 'autosave_3.json');

    // 🔁 ROTAÇÃO DE BACKUPS (do mais recente para o mais antigo)
    // autosave_2 → autosave_3
    moverSeExistir(caminhoSave2, caminhoSave3);

    // autosave_1 → autosave_2
    moverSeExistir(caminhoSave1, caminhoSave2);

    // 📦 Serializa estado atual
    const estadoSerializado = serializarEstadoCampanha(estado);

    // 💾 Salva como autosave_1 (estado mais recente)
    fs.writeFileSync(
      caminhoSave1,
      JSON.stringify(estadoSerializado, null, 2),
      'utf-8'
    );

    // 📜 Log técnico do mundo (opcional mas valioso para debug)
    if (Array.isArray(estado.logMundo)) {
      estado.logMundo.push({
        tipo: 'autosave_rotativo',
        rodada: estado.rodadaGlobal,
        descricao: `Autosave rotativo realizado (slot 1 atualizado na rodada ${estado.rodadaGlobal}).`,
      });
    }
  } catch (erro) {
    console.error('Erro no autosave rotativo da campanha:', erro);
  }
}

module.exports = autosaveCampanha;
