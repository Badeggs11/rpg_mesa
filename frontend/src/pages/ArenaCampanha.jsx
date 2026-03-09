import React, { useEffect, useState } from 'react';
import {
  iniciarCampanha,
  executarAcaoCampanha,
  moverJogadorCampanha,
} from '../api/campanha';
import { listarPersonagens } from '../api/personagens';
import './ArenaCampanha.css';
import MapaCampanha from '../pages/MapaCampanha';
import { obterMapa } from '../api/mundo';

export default function ArenaCampanha() {
  const [estado, setEstado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [mapaBase, setMapaBase] = useState(null);

  useEffect(() => {
    bootCampanha();
  }, []);

  async function bootCampanha() {
    try {
      setCarregando(true);
      setErro(null);

      // 1️⃣ buscar personagens do sistema
      const personagens = await listarPersonagens();

      // 2️⃣ escolher 3 personagens para a campanha
      const jogadores = personagens.slice(0, 3).map(p => ({
        id: p.id,
        nome: p.nome,
      }));

      // 3️⃣ iniciar campanha com esses personagens
      const data = await iniciarCampanha({
        jogadores,
        historiaId: 'vila_abandonada',
      });

      setEstado(data.estadoCampanha);

      const mapa = await obterMapa();
      setMapaBase(mapa);
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

      const jogadorId = estado?.ciclo?.jogadorDaVez;

      const data = await executarAcaoCampanha({
        campaignId: estado.id,
        jogadorId,
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

  async function moverJogador(destino) {
    if (!estado) return;

    try {
      setCarregando(true);
      setErro(null);

      const jogadorId = estado?.ciclo?.jogadorDaVez;

      const data = await moverJogadorCampanha({
        estadoCampanha: estado,
        jogadorId,
        destino,
      });

      setEstado(data.estado);
    } catch (e) {
      console.error(e);
      setErro(e.message || 'Erro ao mover jogador');
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

  const apr =
    estado?.jogadores?.find(j => j.id === estado?.ciclo?.jogadorDaVez)
      ?.aprAtual || 0;

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

      {/* 👥 JOGADORES DA CAMPANHA */}
      <div className="card card-jogadores">
        <h2>👥 Jogadores</h2>

        <ul>
          {(estado?.jogadores || []).map(j => (
            <li key={j.id}>
              <strong>{j.nome}</strong>

              {estado?.ciclo?.jogadorDaVez === j.id && (
                <span> 🎯 (vez atual)</span>
              )}

              {j.pronto && <span> ✅</span>}
            </li>
          ))}
        </ul>
      </div>

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
        <h2>🎮 Ação do Jogador da vez</h2>
        <p>
          🎯 Turno de:{' '}
          {
            estado?.jogadores?.find(j => j.id === estado?.ciclo?.jogadorDaVez)
              ?.nome
          }
        </p>
        <p>⚡ APR: {'⚡'.repeat(apr)}</p>

        <p>
          ⚡ APR restante:{' '}
          {
            estado?.jogadores?.find(j => j.id === estado?.ciclo?.jogadorDaVez)
              ?.aprAtual
          }
        </p>

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
          <button
            disabled={carregando}
            onClick={() => enviarAcao('encerrar_turno')}
          >
            ⏹ Encerrar Turno
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
      {/* 🗺️ MAPA DA CAMPANHA */}
      {/* 🗺️ MAPA DA CAMPANHA */}
      <div className="card card-mapa">
        <h2>🗺️ Mapa da Região</h2>

        {!mapaBase ? (
          <p>Carregando mapa...</p>
        ) : (
          <MapaCampanha
            estadoCampanha={estado}
            jogadorId={estado?.ciclo?.jogadorDaVez}
            mapaBase={mapaBase}
            onMover={moverJogador}
          />
        )}
      </div>
    </div>
  );
}
