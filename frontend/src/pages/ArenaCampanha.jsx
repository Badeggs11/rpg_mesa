import React, { useEffect, useState } from 'react';
import { iniciarCampanha, executarAcaoCampanha } from '../api/campanha';
import './ArenaCampanha.css';

export default function ArenaCampanha() {
  const [estado, setEstado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    bootCampanha();
  }, []);

  async function bootCampanha() {
    try {
      setCarregando(true);
      setErro(null);

      const data = await iniciarCampanha({
        storyId: 'vila_abandonada',
      });

      setEstado(data.estadoCampanha);
    } catch (e) {
      console.error(e);
      setErro(e.message || 'Erro ao iniciar campanha');
    } finally {
      setCarregando(false);
    }
  }

  async function enviarAcao(tipoAcao) {
    if (!estado) return;

    try {
      setCarregando(true);
      setErro(null);

      const data = await executarAcaoCampanha({
        campaignId: estado.id,
        tipoAcao,
      });

      setEstado(data.estadoCampanha);
    } catch (e) {
      console.error(e);
      setErro(e.message || 'Erro ao enviar ação');
    } finally {
      setCarregando(false);
    }
  }

  if (carregando && !estado) {
    return <div className="estado-carregando">🌍 Iniciando campanha...</div>;
  }

  if (erro) {
    return <div className="estado-erro">❌ {erro}</div>;
  }

  if (!estado) {
    return (
      <div className="estado-carregando">
        Nenhum estado de campanha carregado.
      </div>
    );
  }

  const rodada = estado.rodadaGlobal ?? 0;
  const tensao = estado?.reacaoMundo?.nivelTensaoGlobal ?? 0;

  const cronica =
    estado?.narrativa?.cronicasPorRodada?.slice(-1)[0]?.resumo ||
    'O mundo aguarda ações dos jogadores.';

  const narrativaGlobal =
    estado?.narrativa?.narrativaGlobal?.slice(-1)[0]?.descricao ||
    'O silêncio domina a vila abandonada.';

  const ultimosLogs = estado?.logMundo?.slice(-6).reverse() || [];
  const encontro = estado?.encontroPendente;

  return (
    <div className="arena-campanha-container">
      <h1 className="titulo-campanha">🏚️ Campanha: Vila Abandonada</h1>

      {/* 🌍 ESTADO DO MUNDO */}
      <div className="card card-mundo">
        <h2>🌍 Estado do Mundo</h2>
        <p>🕰️ Rodada: {rodada}</p>
        <p>🔥 Tensão Global: {tensao}</p>

        <hr />

        <p>
          <strong>📜 Crônica Sistêmica:</strong>
          <br />
          {cronica}
        </p>

        <p>
          <strong>🎭 Narrativa do Mundo:</strong>
          <br />
          {narrativaGlobal}
        </p>
      </div>

      {/* 🎮 AÇÕES */}
      <div className="card card-acoes">
        <h2>🎮 Ações do Grupo</h2>

        <div className="botoes-acoes">
          <button disabled={carregando} onClick={() => enviarAcao('explorar')}>
            🧭 Explorar a vila
          </button>

          <button
            disabled={carregando}
            onClick={() => enviarAcao('investigar')}
          >
            🔎 Investigar rumores de goblins
          </button>

          <button disabled={carregando} onClick={() => enviarAcao('observar')}>
            👁️ Observar o ambiente
          </button>

          <button disabled={carregando} onClick={() => enviarAcao('descansar')}>
            🛌 Descansar
          </button>
        </div>
      </div>

      {/* 🚨 ENCONTRO DINÂMICO */}
      {encontro && (
        <div className="card card-encontro">
          <h2>🚨 Encontro Perigoso!</h2>
          <p>
            <strong>Tipo:</strong> {encontro.tipo}
          </p>
          <p>
            <strong>Local:</strong> {encontro.local}
          </p>
          <p>
            <strong>Perigo:</strong> {encontro.perigo}
          </p>
          <p>
            <strong>Inimigos:</strong> {encontro.inimigos}
          </p>
          <p>
            <strong>Líder:</strong> {encontro.lider}
          </p>

          <h3>⚔️ Decisão do Grupo:</h3>
          <div className="botoes-encontro">
            {encontro.escolhas?.map(escolha => (
              <button
                key={escolha}
                disabled={carregando}
                onClick={() => enviarAcao(`decisao_${escolha}`)}
              >
                {escolha.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 📡 LOGS DO MUNDO */}
      <div className="card card-logs">
        <h2>📡 Logs do Mundo (Narrativa Emergente)</h2>

        {ultimosLogs.length === 0 ? (
          <p>O mundo ainda observa em silêncio...</p>
        ) : (
          ultimosLogs.map((log, index) => (
            <div key={index} className="log-item">
              <strong>Rodada {log.rodada}:</strong> {log.descricao}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
