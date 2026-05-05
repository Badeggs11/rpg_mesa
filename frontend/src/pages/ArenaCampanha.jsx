import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  iniciarCampanha,
  executarAcaoCampanha,
  moverJogadorCampanha,
} from '../api/campanha';
import { listarPersonagens } from '../api/personagens';
import './ArenaCampanha.css';
import { obterMapa } from '../api/mundo';

export default function ArenaCampanha() {
  const [estado, setEstado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [mapaBase, setMapaBase] = useState(null);
  const [destino, setDestino] = useState('');
  const [resultadoDado, setResultadoDado] = useState(null);

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
      const jogadores = personagens.slice(0, 3).map(p => {
        let background = null;

        if (p.nome === 'Jake') {
          background = `
Jake é um garoto de 13 anos que vive com sua mãe em uma pequena casa na vila.

Seu pai foi convocado pelo rei para a guerra e nunca mais retornou.

Desde então, Jake se tornou o responsável pela casa. Sua mãe, já debilitada e doente, depende dele para sobreviver.

Nos últimos dias, a falta de alimento começou a se tornar um problema real.

Jake sente o peso da responsabilidade, o medo da escassez e a urgência de encontrar uma forma de sustentar sua casa.
`;
        }

        return {
          id: p.id,
          nome: p.nome,

          pontosDeVida: p.pontosDeVida ?? 100,
          stamina: p.stamina ?? 0,
          percepcao: p.percepcao ?? 0,
          percepcaoVisual: p.percepcaoVisual ?? 0,
          forca: p.forca ?? 0,
          agilidade: p.agilidade ?? 0,
          resistencia: p.resistencia ?? 0,
          inteligencia: p.inteligencia ?? 0,

          fome: p.fome ?? 12,

          // 🧠 BACKGROUND PERSONALIZADO
          background,
        };
      });

      // 3️⃣ iniciar campanha com esses personagens
      const data = await iniciarCampanha({
        jogadores,
        historiaId: 'vila_abandonada',
      });

      setEstado(data.estadoCampanha);

      sessionStorage.setItem(
        'estadoCampanha',
        JSON.stringify(data.estadoCampanha)
      );

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

      sessionStorage.setItem(
        'estadoCampanha',
        JSON.stringify(data.estadoCampanha)
      );
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

      sessionStorage.setItem('estadoCampanha', JSON.stringify(data.estado));
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

  function prepararDadosMapa() {
    const dadosMapa = {
      estadoCampanha: estado,
      jogadorId: estado?.ciclo?.jogadorDaVez,
      mapaBase: mapaBase,
    };

    sessionStorage.setItem('dadosMapaCampanha', JSON.stringify(dadosMapa));
  }

  function prepararDadosVisao(modo = 'externo') {
    const jogadorId = estado?.ciclo?.jogadorDaVez;
    const localAtual =
      estado?.mapa?.posicaoJogadores?.[jogadorId]?.localAtual || null;

    const dadosVisao = {
      estadoCampanha: estado,
      jogadorId,
      mapaBase,
      modoVisao: modo,
      localInternoAtual: modo === 'interno' ? localAtual : null,
    };

    sessionStorage.setItem('dadosMapaCampanha', JSON.stringify(dadosVisao));
  }

  return (
    <div className="arena-campanha-container">
      <h1 className="titulo-campanha">🏚️ Campanha: Vila Abandonada</h1>

      {/* 👥 JOGADORES DA CAMPANHA */}
      <div className="card card-jogadores">
        <h2>👥 Jogadores</h2>

        <ul>
          {(estado?.jogadores || []).map(j => (
            <li key={j.id} className="jogador-item">
              <div className="linha-jogador">
                <strong>{j.nome}</strong>

                {estado?.ciclo?.jogadorDaVez === j.id && (
                  <span> 🎯 (vez atual)</span>
                )}

                {j.pronto && <span> ✅</span>}

                <button
                  className="btn-memoria"
                  onClick={() => {
                    sessionStorage.setItem(
                      'dadosMemoriaJogador',
                      JSON.stringify(j)
                    );
                    window.open('/memoria', '_blank');
                  }}
                >
                  🧠
                </button>
              </div>

              <div className="barra-fome-container">
                <div className="barra-fome-label">
                  🍖 Energia/Fome: {j.fome ?? 0}/24
                </div>

                <div className="barra-fome-fundo">
                  <div
                    className="barra-fome-preenchida"
                    style={{
                      width: `${Math.max(
                        0,
                        Math.min(100, ((j.fome ?? 0) / 24) * 100)
                      )}%`,
                    }}
                  />
                </div>
              </div>
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

        <div style={{ marginBottom: '10px' }}>
          {/* DESTINO */}
          <input
            type="text"
            placeholder="Ex: taverna, igreja..."
            value={destino}
            onChange={e => setDestino(e.target.value)}
            style={{ marginRight: '8px', padding: '4px' }}
          />

          {/* 🎲 ROLAR DADO */}
          <button
            onClick={() => {
              const roll = Math.floor(Math.random() * 6) + 1;
              setResultadoDado(roll);
            }}
            style={{ marginRight: '8px' }}
          >
            🎲 Rolar D6
          </button>

          {/* RESULTADO */}
          {resultadoDado && (
            <span style={{ marginRight: '8px' }}>🎯 {resultadoDado}</span>
          )}

          {/* 🧭 MOVER */}
          <button
            disabled={carregando}
            onClick={async () => {
              if (!destino) {
                alert('Digite um destino');
                return;
              }

              if (!resultadoDado) {
                alert('Role o dado primeiro!');
                return;
              }

              try {
                const data = await executarAcaoCampanha({
                  campaignId: estado.id,
                  jogadorId: estado.ciclo.jogadorDaVez,
                  tipoAcao: 'mover',
                  destino,
                  resultadoDado,
                });

                setEstado(data.estadoCampanha);

                sessionStorage.setItem(
                  'dadosMapaCampanha',
                  JSON.stringify({
                    estadoCampanha: data.estadoCampanha,
                    jogadorId: estado.ciclo.jogadorDaVez,
                    mapaBase: mapaBase,
                  })
                );

                sessionStorage.setItem(
                  'estadoCampanha',
                  JSON.stringify(data.estadoCampanha)
                );

                setResultadoDado(null);
              } catch (e) {
                console.error(e);
                alert('Erro ao mover');
              }
            }}
          >
            🧭 Mover
          </button>
          <button
            style={{ marginLeft: '8px' }}
            onClick={() => {
              prepararDadosVisao('interno');
              window.open('/visao', '_blank');
            }}
          >
            🚪 Entrar
          </button>
          <button
            style={{ marginLeft: '8px' }}
            disabled={carregando}
            onClick={async () => {
              if (!destino) {
                alert('Digite o id do NPC. Ex: jose_barman');
                return;
              }

              try {
                const jogadorId = estado.ciclo.jogadorDaVez;

                const jogadorAtual = estado.jogadores.find(
                  j => j.id === jogadorId
                );

                const data = await executarAcaoCampanha({
                  campaignId: estado.id,
                  jogadorId,
                  tipoAcao: 'conversar',
                  npcId: destino,
                });

                setEstado(data.estadoCampanha);

                sessionStorage.setItem(
                  'estadoCampanha',
                  JSON.stringify(data.estadoCampanha)
                );

                sessionStorage.setItem(
                  'dadosDialogoNPC',
                  JSON.stringify({
                    estadoCampanha: data.estadoCampanha,
                    jogadorId,
                    jogadorNome: jogadorAtual?.nome || 'Jogador',
                    npcId: destino,
                    npcNome:
                      destino === 'jose_barman' ? 'José Barman' : destino,
                    falaInicial:
                      data.estadoCampanha?.logMundo?.slice(-1)[0]?.descricao ||
                      'A conversa começou.',
                  })
                );

                setDestino('');

                window.open('/dialogo-npc', '_blank');
              } catch (e) {
                console.error(e);
                alert(e.message || 'Erro ao conversar');
              }
            }}
          >
            🗣️ Conversar
          </button>

          <button
            style={{ marginLeft: '8px' }}
            disabled={carregando}
            onClick={() => enviarAcao('encerrar_turno')}
          >
            ⏭️ Encerrar Turno
          </button>
        </div>
      </div>

      <div className="card card-info">
        <h2>🧠 Informações do Jogador da Vez</h2>

        <div className="botoes-info-jogador">
          <button
            onClick={() => {
              prepararDadosVisao();
              window.open('/visao', '_blank');
            }}
          >
            👁️ O que vejo
          </button>
          <button
            onClick={() => {
              prepararDadosVisao();
              window.open('/sentimentos', '_blank');
            }}
          >
            💓 O que sinto
          </button>
          <button
            onClick={() => {
              prepararDadosVisao();
              window.open('/desejos', '_blank');
            }}
          >
            🔥 O que quero
          </button>
          <button
            onClick={() => {
              prepararDadosVisao();
              window.open('/efeitos', '_blank');
            }}
          >
            ⚡ O que está me afetando
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
      <button
        onClick={() => {
          prepararDadosMapa();
          window.open('/mapa', '_blank');
        }}
      >
        Abrir mapa da campanha
      </button>
    </div>
  );
}
