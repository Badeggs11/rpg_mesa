/* =========================================================
   🏟️ ARENACOMBATE
   ---------------------------------------------------------
   Esse componente é o COCKPIT do combate.

   Ele NÃO contém regras de jogo.
   Ele é responsável por:
   🎮 Input do jogador
   🖥️ Estado visual da luta
   📡 Comunicação com a API/Engine
   ⏳ Temporização visual
   🎭 Renderização da cena e do log
========================================================= */

import { useState, useEffect, useRef, useCallback } from 'react';
import './ArenaCombate.css';
import Log from '../components/log/Log';
import ControleLateral from '../components/controle/ControleLateral';
import { iniciarCombate, executarAcaoCombate } from '../api/combates';

import cenaInicio from '../assets/cenas/inicio.png';
import jakeAtaca from '../assets/cenas/jake_ataca.png';
import goblinAtaca from '../assets/cenas/goblin_ataca.png';
import jakeDefende from '../assets/cenas/jake_defende.png';
import goblinDefende from '../assets/cenas/goblin_defende.png';

import ControleFlutuante from '../components/controle/ControleFlutuante';

/* =========================================================
     🧠 1. ESTADO VISUAL (useState)
     Tudo aqui afeta o que é desenhado na tela
  ========================================================= */

export default function ArenaCombate() {
  const [combate, setCombate] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const [golpe, setGolpe] = useState(null);
  const [altura, setAltura] = useState(null);
  const [lado, setLado] = useState(null);

  const [mostrarGolpes, setMostrarGolpes] = useState(false);
  const [mostrarControle, setMostrarControle] = useState(true);

  const [tempoRestante, setTempoRestante] = useState(null);

  const [tempoPreContagem, setTempoPreContagem] = useState(null);

  const [direcaoVisivel, setDirecaoVisivel] = useState(null);

  console.log(combate);

  //console.log('RENDER combate:', combate);

  /* =========================================================
     🧠 2. REFS (memória invisível)
     Permitem que o teclado sempre enxergue o estado atual
     sem recriar listeners
  ========================================================= */

  const combateRef = useRef(null);
  const golpeRef = useRef(null);
  const alturaRef = useRef(null);
  const ladoRef = useRef(null);
  const mostrarGolpesRef = useRef(false);

  useEffect(() => {
    if (!combate) return;

    if (combate.fase === 'tempoDePercepcaoInformacao') {
      const info = combate.percepcaoDefensor;

      setDirecaoVisivel(info.direcaoRevelada);

      const timer = setTimeout(() => {
        setDirecaoVisivel(null);
        enviarAcao({ finalizarPercepcao: true });
      }, info.segundosInformacao * 1000);

      return () => clearTimeout(timer);
    }
  }, [combate?.fase]);

  useEffect(() => {
    if (!combate) return;

    const fase = combate.fase;

    const faseMostraPercepcao = fase === 'tempoDeDefesa';

    if (!faseMostraPercepcao) {
      setDirecaoVisivel(null); // 🔥 LIMPA AUTOMATICAMENTE
    }
  }, [combate?.fase]);

  useEffect(() => {
    console.log('TEMPO PRE:', tempoPreContagem);
  }, [tempoPreContagem]);

  useEffect(() => {
    console.log('FASE:', combate?.fase);
  }, [combate?.fase]);

  /* =========================================================
     ⏳ 4. TIMER VISUAL (quando a fase é tempoDeAtaque/Defesa)
     O ENGINE define o tempo.
     O FRONTEND apenas mostra e dispara tempoEsgotado.
  ========================================================= */
  useEffect(() => {
    if (!combate) return;

    if (combate.fase === 'tempoDeAtaque' && combate.tempoLimite) {
      let tempo = combate.tempoLimite;
      setTempoRestante(tempo);

      const timer = setInterval(() => {
        tempo--;
        setTempoRestante(tempo);

        if (tempo <= 0) {
          clearInterval(timer);
          enviarAcao({ tempoEsgotado: true }); // 🔥 ESSA LINHA É O QUE ESTAVA FALTANDO
        }
      }, 1000);

      return () => clearInterval(timer);
    } else {
      if (combate.fase !== 'preContagemAtaque') {
        setTempoRestante(null);
      }
    }

    if (combate.fase === 'tempoDeDefesa' && combate.tempoLimite) {
      let tempo = combate.tempoLimite;
      setTempoRestante(tempo);

      const perc = combate.percepcaoDefensor;

      const timer = setInterval(() => {
        tempo--;
        setTempoRestante(tempo);

        const perc = combate.percepcaoDefensor;

        if (
          perc?.segundosInformacao > 0 &&
          tempo <= perc.segundosInformacao &&
          tempo > 0
        ) {
          setDirecaoVisivel(perc.direcaoRevelada);
        } else {
          setDirecaoVisivel(null);
        }

        if (tempo <= 0) {
          clearInterval(timer);
          enviarAcao({ tempoEsgotado: true });
        }
      }, 1000);

      return () => clearInterval(timer);
    } else {
      if (combate.fase !== 'preContagemDefesa') {
        setTempoRestante(null);
      }
    }
  }, [combate?.fase, combate?.tempoLimite]);

  /* =========================================================
     ⏳ 5. PRÉ-CONTAGEM VISUAL
     O engine entra em preContagem.
     A UI espera e depois manda iniciarTempo.
  ========================================================= */

  useEffect(() => {
    if (!combate) return;

    if (
      combate.fase === 'preContagemAtaque' ||
      combate.fase === 'preContagemDefesa' ||
      combate.fase === 'preContagemPercepcao'
    ) {
      let tempo = 10; // duração da pré-contagem visual
      setTempoPreContagem(tempo);

      const timer = setInterval(() => {
        tempo--;
        setTempoPreContagem(tempo);

        if (tempo <= 0) {
          clearInterval(timer);

          if (combate.fase === 'preContagemAtaque') {
            enviarAcao({ iniciarTempoAtaque: true });
          }

          if (combate.fase === 'preContagemPercepcao') {
            enviarAcao({ iniciarTempoPercepcao: true });
          } else {
            enviarAcao({ iniciarTempoDefesa: true });
          }
        }
      }, 1000);

      return () => clearInterval(timer);
    }

    setTempoPreContagem(null);
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

  /* =========================================================
     🧰 6. FUNÇÕES AUXILIARES
  ========================================================= */

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

  async function iniciarCombateHandler() {
    setErro(null);
    setCarregando(true);

    try {
      const data = await iniciarCombate({
        atacanteId,
        defensorId,
        controladorA: 'humano',
        controladorB: 'cpu',
      });

      setCombate(data);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  /* =========================================================
     🚀 7. COMUNICAÇÃO COM O BACKEND
     Porta oficial para falar com o engine
  ========================================================= */

  async function enviarAcao(payload) {
    const c = combateRef.current;
    if (!c) return;

    setErro(null);
    setCarregando(true);

    try {
      const data = await executarAcaoCombate({
        combateId: c.id,
        ...payload,
      });

      setCombate(data);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  /* =========================================================
     🎲 8. BOTÃO PRINCIPAL (interpreta a fase atual)
  ========================================================= */
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

    if (fase === 'tempoDePercepcaoInformacao') {
      enviarAcao({ finalizarPercepcao: true });
      return;
    }

    if (fase === 'aguardandoRolagemTempoAtaque') {
      enviarAcao({});
      return;
    }

    if (fase === 'aguardandoRolagemTempoPercepcao') {
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

    if (fase === 'pausaResolucaoTurno') {
      enviarAcao({ continuar: true });
      return;
    }

    enviarAcao({});
  }, []);
  /* =========================================================
     ⌨️ 9. LISTENER DE TECLADO (input de jogo)
  ========================================================= */
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
        fase === 'aguardandoRolagemTempoDefesa' ||
        fase === 'tempoDePercepcaoInformacao';

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
          fase === 'aguardandoDefesa' || fase === 'tempoDeDefesa'
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
        <button onClick={iniciarCombateHandler} disabled={carregando}>
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

            {/* ⏳ PRÉ-CONTAGEM */}
            {tempoPreContagem !== null &&
              combate.fase === 'preContagemAtaque' && (
                <div className="timer-pre">
                  ⚠️ Seu ataque começa em: {tempoPreContagem}
                </div>
              )}

            {tempoPreContagem !== null &&
              combate.fase === 'preContagemDefesa' && (
                <div className="timer-pre">
                  🛡 Sua defesa começa em: {tempoPreContagem}
                </div>
              )}

            {tempoPreContagem !== null &&
              combate.fase === 'preContagemPercepcao' && (
                <div className="timer-pre percepcao">
                  👁 Analisando o movimento do inimigo...
                </div>
              )}

            {/* ⏱ TEMPO REAL DE AÇÃO */}
            {tempoRestante !== null && (
              <div
                className={`timer-ataque ${tempoRestante <= 3 ? 'perigo' : ''}`}
              >
                ⏳ {tempoRestante}s
              </div>
            )}

            {direcaoVisivel && (
              <div className="direcao-revelada">
                👁 Ataque vindo de: <strong>{direcaoVisivel}</strong>
              </div>
            )}

            {/* 🧊 PAUSA NA RESOLUÇÃO */}
            {combate?.fase === 'pausaResolucaoTurno' && (
              <div className="msg-continuar">
                ⌨️ Aperte ENTER para continuar a batalha
              </div>
            )}

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
