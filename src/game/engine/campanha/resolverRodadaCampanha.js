const interpretarHistoricoAcoes = require('./interpretarHistoricoAcoes');
const sistemaConsequencias = require('./sistemas/sistemaConsequencias');
const sistemaEventosDinamicos = require('./sistemas/sistemaEventosDinamicos');
const sistemaMemoriaMundo = require('./sistemas/sistemaMemoriaMundo');
const sistemaAgentesMundo = require('./sistemas/sistemaAgentesMundo');
const autosaveCampanha = require('./persistencia/autosaveCampanha');
const { aplicarAPRNaNovaRodada } = require('./sistemas/sistemaAPR');
const { iniciarTempoRodada } = require('./sistemas/sistemaTempoRodada');
const sistemaNarrativaDinamica = require('./sistemas/sistemaNarrativaDinamica');

function resolverRodadaCampanha(estado) {
  // Garantia de segurança
  if (!estado) return estado;

  // Inicializa estruturas futuras (sandbox ready)
  if (!estado.eventosDisparados) {
    estado.eventosDisparados = [];
  }

  if (!estado.eventoDramaticoAtivo) {
    estado.eventoDramaticoAtivo = null;
  }

  if (!estado.logMundo) {
    estado.logMundo = [];
  }

  // 🌍 REGRA 1 — O mundo reage ao tempo
  estado.logMundo.push({
    tipo: 'mundo_processado',
    rodada: estado.rodadaGlobal,
    descricao: `O mundo reagiu às ações dos jogadores na rodada ${estado.rodadaGlobal}`,
  });

  // 🧠 NOVO: cérebro sandbox (INTERPRETA O JOGADOR)
  interpretarHistoricoAcoes(estado);

  // 🌍 2. Aplicar consequências reais (reação)
  sistemaConsequencias(estado);

  // 🎭 3. Gera acontecimentos narrativos emergentes (NOVO)
  sistemaEventosDinamicos(estado);

  // 4️⃣ Memória histórica do universo (CRÔNICA DO MUNDO) ⭐
  sistemaMemoriaMundo(estado);

  // 🎭 NARRATIVA (SEMPRE DEPOIS DA MEMÓRIA)
  sistemaNarrativaDinamica(estado);

  // 5. 🌍 Agentes autônomos do mundo (NPCs vivos) ⭐
  sistemaAgentesMundo(estado);

  // 💾 AUTOSAVE DO MUNDO (após processamento completo da rodada)
  autosaveCampanha(estado);

  // após avançar rodadaGlobal
  aplicarAPRNaNovaRodada(estado);

  // ⏳ reinicia o relógio da nova rodada (mundo nunca para)
  iniciarTempoRodada(estado);

  // 🌱 (HOOK SANDBOX FUTURO)
  // Aqui entrarão:
  // - eventos dinâmicos
  // - reações de facções
  // - evolução do mapa
  // - consequências das escolhas

  return estado;
}

module.exports = resolverRodadaCampanha;
