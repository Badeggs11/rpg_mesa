import { useState, useEffect, useRef, useCallback } from 'react';
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

  // ✅ Refs para o teclado sempre enxergar o estado mais recente
  const combateRef = useRef(null);
  const golpeRef = useRef(null);
  const alturaRef = useRef(null);
  const ladoRef = useRef(null);
  const mostrarGolpesRef = useRef(false);

  useEffect(() => {
    if (!combate) return;

    if (combate.fase === 'tempoDeAtaque' && combate.tempoLimite) {
      let tempo = combate.tempoLimite;

      const timer = setInterval(() => {
        tempo--;

        if (tempo <= 0) {
          clearInterval(timer);
          enviarAcao({ tempoEsgotado: true }); // 🔥 ESSA LINHA É O QUE ESTAVA FALTANDO
        }
      }, 1000);

      return () => clearInterval(timer);
    }

    if (combate.fase === 'tempoDeDefesa' && combate.tempoLimite) {
      let tempo = combate.tempoLimite;

      const timer = setInterval(() => {
        tempo--;

        if (tempo <= 0) {
          clearInterval(timer);
          enviarAcao({ tempoEsgotado: true });
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [combate?.fase, combate?.tempoLimite]);

  useEffect(() => {
    if (!combate) return;

    // ⏳ Quando o engine entra na pré-contagem, esperamos 3s e iniciamos o tempo
    if (combate.fase === 'preContagemAtaque') {
      const t = setTimeout(() => {
        enviarAcao({ iniciarTempoAtaque: true });
      }, 3000); // seus 3 segundos

      return () => clearTimeout(t);
    }

    if (combate.fase === 'preContagemDefesa') {
      const t = setTimeout(() => {
        enviarAcao({ iniciarTempoDefesa: true });
      }, 3000);

      return () => clearTimeout(t);
    }
  }, [combate?.fase]);

  useEffect(() => {
    combateRef.current = combate;
  }, [combate]);

  useEffect(() => {
    golpeRef.current = golpe;
  }, [golpe]);

  useEffect(() => {
    alturaRef.current = altura;
  }, [altura]);

  useEffect(() => {
    ladoRef.current = lado;
  }, [lado]);

  useEffect(() => {
    mostrarGolpesRef.current = mostrarGolpes;
  }, [mostrarGolpes]);

  const atacanteId = 1;
  const defensorId = 2;

  function direcaoCompletaAtual() {
    const a = alturaRef.current;
    const l = ladoRef.current;
    if (!a || !l) return null;
    return `${a}-${l}`;
  }

  function limparSelecao() {
    setGolpe(null);
    setAltura(null);
    setLado(null);
    setMostrarGolpes(false);
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
          controladorB: 'humano',
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
    const c = combateRef.current;
    if (!c) return;

    setErro(null);
    setCarregando(true);

    try {
      const res = await fetch('/api/combate/acao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          combateId: c.id,
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

  // ✅ Função estável: sempre lê refs (estado mais recente)
  const acaoDoBotaoDado = useCallback(() => {
    const c = combateRef.current;
    if (!c) return;

    const fase = c.fase;
    const mostrar = mostrarGolpesRef.current;
    const g = golpeRef.current;
    const dir = direcaoCompletaAtual();

    /* ===============================
   🎲 ROLAGENS DE DADO (ENGINE ROLA)
  =============================== */

    if (fase === 'aguardandoRolagemIniciativa') {
      enviarAcao({});
      return;
    }

    if (fase === 'aguardandoRolagemTempoAtaque') {
      enviarAcao({});
      return;
    }

    if (fase === 'aguardandoRolagemTempoDefesa') {
      enviarAcao({});
      return;
    }

    if (fase === 'aguardandoRolagemAtaque') {
      enviarAcao({});
      return;
    }

    if (fase === 'aguardandoRolagemDefesa') {
      enviarAcao({});
      return;
    }

    /* ===============================
   ⏳ PRÉ-CONTAGEM → COMEÇA O TEMPO
  =============================== */

    if (fase === 'preContagemAtaque') {
      enviarAcao({ iniciarTempoAtaque: true });
      return;
    }

    if (fase === 'preContagemDefesa') {
      enviarAcao({ iniciarTempoDefesa: true });
      return;
    }

    /* ===============================
   ⚔️ TEMPO ATIVO → JOGADOR AGE
  =============================== */

    if (fase === 'tempoDeAtaque') {
      if (mostrar && g && dir) {
        // jogador agiu a tempo
        enviarAcao({ golpe: g, direcao: dir, finalizarTempoAtaque: true });
        limparSelecao();
      }
      return;
    }

    if (fase === 'tempoDeDefesa') {
      if (mostrar && g && dir) {
        enviarAcao({ golpe: g, direcao: dir, finalizarTempoDefesa: true });
        limparSelecao();
      }
      return;
    }

    /* ===============================
   ⚔️ AÇÃO NORMAL (SEM TIMER)
  =============================== */

    if (fase === 'aguardandoAtaque') {
      if (mostrar && g && dir) {
        enviarAcao({ golpe: g, direcao: dir });
        limparSelecao();
      }
      return;
    }

    if (fase === 'aguardandoDefesa') {
      if (mostrar && g && dir) {
        enviarAcao({ golpe: g, direcao: dir });
        limparSelecao();
      }
      return;
    }

    /* ===============================
   🔁 QUALQUER OUTRA FASE
  =============================== */

    enviarAcao({});
  }, []);

  // ✅ Listener do teclado montado UMA vez, lendo refs
  useEffect(() => {
    function handleKey(e) {
      const c = combateRef.current;
      if (!c) return;

      if (e.repeat) return;

      const fase = c.fase;

      const emAtaqueOuDefesa =
        fase === 'aguardandoAtaque' ||
        fase === 'aguardandoDefesa' ||
        fase === 'tempoDeAtaque' ||
        fase === 'tempoDeDefesa' ||
        fase === 'aguardandoRolagemTempoAtaque' ||
        fase === 'aguardandoRolagemTempoDefesa';

      const teclasControladas = [
        'Space',
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'Enter',
        'KeyA',
        'KeyS',
        'KeyD',
      ];

      if (teclasControladas.includes(e.code)) e.preventDefault();

      if (e.code === 'Enter') {
        acaoDoBotaoDado();
        return;
      }

      if (!emAtaqueOuDefesa) return;

      setMostrarGolpes(true);

      if (e.code === 'ArrowUp') setAltura('alto');
      if (e.code === 'ArrowDown') setAltura('baixo');
      if (e.code === 'ArrowLeft') setLado('esquerda');
      if (e.code === 'ArrowRight') setLado('direita');
      if (e.code === 'Space') setLado('frontal');

      const podeEscolherGolpe =
        fase === 'aguardandoAtaque' ||
        fase === 'tempoDeAtaque' || // ⭐ ADICIONAR
        fase === 'aguardandoDefesa' ||
        fase === 'tempoDeDefesa'; // ⭐ ADICIONAR

      if (podeEscolherGolpe) {
        const golpesDisponiveis =
          fase === 'aguardandoDefesa'
            ? ['bloqueioSimples', 'esquivaSimples']
            : ['socoSimples', 'chuteSimples'];

        if (e.code === 'KeyA') setGolpe(golpesDisponiveis[0]);
        if (e.code === 'KeyS') setGolpe(golpesDisponiveis[1]);
      }
    }

    window.addEventListener('keydown', handleKey, { passive: false });
    return () =>
      window.removeEventListener('keydown', handleKey, { passive: false });
  }, [acaoDoBotaoDado]);

  useEffect(() => {
    setMostrarGolpes(false);
    setGolpe(null);
  }, [combate?.fase]);

  function direcaoCompleta() {
    if (!altura || !lado) return null;
    return `${altura}-${lado}`;
  }

  const prontoParaConfirmarAtaque =
    (combate?.fase === 'aguardandoAtaque' ||
      combate?.fase === 'tempoDeAtaque') &&
    mostrarGolpes &&
    golpe &&
    direcaoCompleta();

  const prontoParaConfirmarDefesa =
    (combate?.fase === 'aguardandoDefesa' ||
      combate?.fase === 'tempoDeDefesa') &&
    mostrarGolpes &&
    golpe &&
    direcaoCompleta();

  const podeConfirmar = prontoParaConfirmarAtaque || prontoParaConfirmarDefesa;

  function resolverCenaNarrativa(c) {
    if (!c) return cenaInicio;

    const { fase, atacanteAtual } = c;

    if (fase === 'aguardandoRolagemIniciativa' || fase === 'finalizado') {
      return cenaInicio;
    }

    if (
      fase === 'aguardandoRolagemAtaque' ||
      fase === 'aguardandoAtaque' ||
      fase === 'preContagemAtaque' ||
      fase === 'tempoDeAtaque'
    ) {
      return atacanteAtual === 'Jake' ? jakeAtaca : goblinAtaca;
    }

    if (
      fase === 'aguardandoRolagemDefesa' ||
      fase === 'aguardandoDefesa' ||
      fase === 'preContagemDefesa' ||
      fase === 'tempoDeDefesa'
    ) {
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
          <section className="arena-log">
            <h3>📜 Log do Combate</h3>
            <Log eventos={combate.log} />
          </section>

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

          {mostrarControle && (
            <ControleFlutuante>
              <ControleLateral
                fase={combate.fase}
                setAltura={setAltura}
                setLado={setLado}
                altura={altura}
                lado={lado}
                golpes={
                  combate.fase === 'aguardandoDefesa' ||
                  combate.fase === 'tempoDeDefesa'
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

      <button
        className="btn-toggle-controle"
        onClick={() => setMostrarControle(v => !v)}
      >
        🎮
      </button>
    </div>
  );
}
