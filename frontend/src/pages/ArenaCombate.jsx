import { useState, useEffect } from 'react';
import './ArenaCombate.css';
import Log from '../components/log/Log';
import ControleLateral from '../components/controle/ControleLateral';
import cenaInicio from '../assets/cenas/inicio.png';
import jakeAtaca from '../assets/cenas/jake_ataca.png';
import goblinAtaca from '../assets/cenas/goblin_ataca.png';

import jakeDefende from '../assets/cenas/jake_defende.png';
import goblinDefende from '../assets/cenas/goblin_defende.png';

import ControleFlutuante from '../components/controle/ControleFlutuante';

export default function ArenaCombate() {
  const [combate, setCombate] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const [golpe, setGolpe] = useState(null);
  const [altura, setAltura] = useState(null);
  const [lado, setLado] = useState(null);

  const [mostrarGolpes, setMostrarGolpes] = useState(false);

  const [mostrarControle, setMostrarControle] = useState(true);

  useEffect(() => {
    setMostrarGolpes(false);
    setGolpe(null);
  }, [combate?.fase]);

  const atacanteId = 1;
  const defensorId = 2;

  function direcaoCompleta() {
    if (!altura || !lado) return null;
    return `${altura}-${lado}`;
  }

  function limparSelecao() {
    setGolpe(null);
    setAltura(null);
    setLado(null);
    setMostrarGolpes(false);
  }

  function acaoDoBotaoDado() {
    if (!combate) return;

    if (
      combate.fase === 'aguardandoAtaque' &&
      mostrarGolpes &&
      golpe &&
      direcaoCompleta()
    ) {
      enviarAcao({ golpe, direcao: direcaoCompleta() });
      limparSelecao();
      return;
    }

    if (
      combate.fase === 'aguardandoDefesa' &&
      mostrarGolpes &&
      golpe &&
      direcaoCompleta()
    ) {
      enviarAcao({ golpe, direcao: direcaoCompleta() });
      limparSelecao();
      return;
    }

    enviarAcao({});
  }

  async function iniciarCombate() {
    setErro(null);
    setCarregando(true);

    try {
      const res = await fetch('/api/combate/iniciar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          atacanteId,
          defensorId,
          controladorA: 'humano',
          controladorB: 'cpu',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.erro);

      setCombate(data);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  async function enviarAcao(payload) {
    if (!combate) return;

    setErro(null);
    setCarregando(true);

    try {
      const res = await fetch('/api/combate/acao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          combateId: combate.id,
          ...payload,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.erro);

      setCombate(data);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  const prontoParaConfirmarAtaque =
    combate?.fase === 'aguardandoAtaque' &&
    mostrarGolpes &&
    golpe &&
    direcaoCompleta();

  const prontoParaConfirmarDefesa =
    combate?.fase === 'aguardandoDefesa' &&
    mostrarGolpes &&
    golpe &&
    direcaoCompleta();

  const podeConfirmar = prontoParaConfirmarAtaque || prontoParaConfirmarDefesa;
  function cena(path) {
    return new URL(path, import.meta.url).href;
  }

  function resolverCenaNarrativa(combate) {
    if (!combate) return cenaInicio;

    const { fase, atacanteAtual } = combate;

    // Início / encerramento
    if (fase === 'aguardandoRolagemIniciativa' || fase === 'finalizado') {
      return cenaInicio;
    }

    // ATAQUE
    if (fase === 'aguardandoRolagemAtaque' || fase === 'aguardandoAtaque') {
      return atacanteAtual === 'Jake' ? jakeAtaca : goblinAtaca;
    }

    // DEFESA
    if (fase === 'aguardandoRolagemDefesa' || fase === 'aguardandoDefesa') {
      return atacanteAtual === 'Jake' ? goblinDefende : jakeDefende;
    }

    return cenaInicio;
  }

  return (
    <div className="arena">
      {combate && (
        <header className="arena-header">
          <div className="titulo">⚔️ Arena de Combate</div>

          <div className="status-header">
            {Object.values(combate.personagens).map(p => (
              <span key={p.nome} className="status-mini">
                <strong>{p.nome}</strong>{' '}
                <span className="vida">❤️ {p.pontosDeVida}</span>{' '}
                <span className="stamina">⚡ {p.stamina}</span>
              </span>
            ))}
          </div>
        </header>
      )}

      <h1 className="titulo-pre">⚔️ Arena de Combate</h1>

      {!combate && (
        <button onClick={iniciarCombate} disabled={carregando}>
          ⚡ Iniciar Combate
        </button>
      )}

      {erro && <p className="erro">{erro}</p>}

      {combate && (
        <div className="arena-main">
          {/* LOG À ESQUERDA */}
          <section className="arena-log">
            <h3>📜 Log do Combate</h3>
            <Log eventos={combate.log} />
          </section>

          {/* CENA À DIREITA */}
          <section className="arena-cena">
            <img
              className="cena-imagem"
              src={resolverCenaNarrativa(combate)}
              alt="Cena do combate"
            />

            <div className="cena-legenda">
              {combate.atacanteAtual} encara {combate.defensorAtual}
            </div>
          </section>

          {/* CONTROLE FLUTUANTE (FORA DO FLUXO) */}
          {mostrarControle && (
            <ControleFlutuante>
              <ControleLateral
                fase={combate.fase}
                setAltura={setAltura}
                setLado={setLado}
                golpes={
                  combate.fase === 'aguardandoDefesa'
                    ? [
                        { id: 'bloqueioSimples', label: '🛡 Bloqueio' },
                        { id: 'esquivaSimples', label: '🤸 Esquiva' },
                      ]
                    : [
                        { id: 'socoSimples', label: '👊 Soco' },
                        { id: 'chuteSimples', label: '🦵 Chute' },
                      ]
                }
                golpeSelecionado={golpe}
                onSelecionarGolpe={setGolpe}
                mostrarGolpes={mostrarGolpes}
                onToggleGolpes={() => setMostrarGolpes(v => !v)}
                onRolar={acaoDoBotaoDado}
                podeConfirmar={podeConfirmar}
              />
            </ControleFlutuante>
          )}
        </div>
      )}
      {/* BOTÃO PARA MOSTRAR / ESCONDER O CONTROLE */}
      <button
        className="btn-toggle-controle"
        onClick={() => setMostrarControle(v => !v)}
      >
        🎮
      </button>
    </div>
  );
}
