import './log.css';
import DadoD20SVG from '../DadoD20SVG';
import DadoD20Three from '../DadoD20Three';
import { useLayoutEffect, useRef, useState } from 'react';

/* ⏱️ Ajuste aqui os tempos */
const TEMPO_DADO_SVG = 2500;
const TEMPO_DADO_THREE = 2500;
const TEMPO_RESPIRO = 300;

/* 🔍 busca evento futuro */
function buscarResultado(eventos, indice, tipo) {
  for (let j = indice + 1; j < eventos.length; j++) {
    if (eventos[j].tipo === tipo) return eventos[j];
  }
  return null;
}

/* ⏱️ Atraso seguro (sem quebrar regras de hooks) */
function Delayed({ delay = 2000, children }) {
  const [show, setShow] = useState(false);

  useLayoutEffect(() => {
    setShow(false);
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  if (!show) return null;
  return children;
}

export default function Log({ eventos }) {
  const logRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useLayoutEffect(() => {
    if (!autoScroll || !logRef.current) return;
    requestAnimationFrame(() => {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    });
  }, [eventos, autoScroll]);

  if (!eventos || eventos.length === 0) {
    return <p className="log-vazio">Nenhum evento ainda</p>;
  }

  return (
    <div
      className="log"
      ref={logRef}
      onScroll={() => {
        const el = logRef.current;
        if (!el) return;
        setAutoScroll(el.scrollTop + el.clientHeight >= el.scrollHeight - 5);
      }}
    >
      <button
        className={`btn-voltar-agora ${autoScroll ? 'ativo' : 'visivel'}`}
        onClick={() => {
          setAutoScroll(true);
          logRef.current.scrollTop = logRef.current.scrollHeight;
        }}
      >
        ⬇️ Voltar ao agora
      </button>

      {eventos.map((e, i) => {
        switch (e.tipo) {
          /* ===== INICIATIVA ===== */

          case 'rolagemIniciativaResultado':
            return (
              <div key={i} className="card card-iniciativa">
                <div className="card-title">🎲 Resultado da Iniciativa</div>
                <div>
                  {e.personagemA}:{' '}
                  <DadoD20SVG valor={e.rolagemA} delay={TEMPO_DADO_SVG} />
                </div>
                <div>
                  {e.personagemB}:{' '}
                  <DadoD20SVG valor={e.rolagemB} delay={TEMPO_DADO_SVG} />
                </div>
              </div>
            );

          case 'iniciativa':
            return (
              <div key={i} className="card card-iniciativa">
                🔥 <strong>{e.primeiro}</strong> toma a iniciativa!
              </div>
            );

          /* ===== ATAQUE ===== */

          case 'rolagemAtaqueIniciada': {
            const r = buscarResultado(eventos, i, 'rolagemAtaqueResultado');

            return (
              <div key={i} className="card card-ataque">
                🎲 Rolagem de Ataque
                <DadoD20Three
                  valor={r?.valor}
                  delay={TEMPO_DADO_THREE}
                  revelar={!!r}
                />
              </div>
            );
          }

          case 'rolagemAtaqueResultado':
            return (
              <Delayed key={i} delay={TEMPO_DADO_THREE + TEMPO_RESPIRO}>
                <div className="card card-ataque texto-narrativo">
                  🎯 Ataque alcança <strong>{e.valor}</strong>
                </div>
              </Delayed>
            );

          case 'ataque':
            return (
              <div key={i} className="card card-ataque texto-narrativo">
                <strong>{e.atacante}</strong> ataca com <em>{e.golpe}</em> (
                {e.direcao})
              </div>
            );

          /* ===== DEFESA ===== */

          case 'rolagemDefesaIniciada': {
            const r = buscarResultado(eventos, i, 'rolagemDefesaResultado');

            return (
              <div key={i} className="card card-defesa">
                🎲 Rolagem de Defesa
                <DadoD20Three
                  valor={r?.valor}
                  delay={TEMPO_DADO_THREE}
                  revelar={!!r}
                />
              </div>
            );
          }

          case 'rolagemDefesaResultado':
            return (
              <Delayed key={i} delay={TEMPO_DADO_THREE + TEMPO_RESPIRO}>
                <div className="card card-defesa texto-narrativo">
                  🛡 Defesa alcança <strong>{e.valor}</strong>
                </div>
              </Delayed>
            );

          case 'narrativaDefesa':
            return (
              <div key={i} className="card card-defesa texto-narrativo">
                <strong>{e.defensor}</strong> tenta {e.golpe} ({e.direcao})
                {!e.direcaoCorreta && <em> — direção incorreta</em>}
              </div>
            );

          /* ===== RESOLUÇÃO ===== */
          /* aparece depois da defesa parar (tempo do dado + respiro + extra) */

          case 'resolucaoTurno':
            return (
              <Delayed key={i} delay={TEMPO_DADO_THREE + TEMPO_RESPIRO + 400}>
                <div>
                  <div className="card">
                    <div className="card-title">⚔️ Resolução do Turno</div>

                    <p>
                      Ataque: 🎲 {e.rolagemAtaque} →{' '}
                      <strong>{e.valorAtaque}</strong>
                    </p>

                    <p>
                      Defesa: 🎲 {e.rolagemDefesa} →{' '}
                      <strong>{e.valorDefesa}</strong>
                    </p>

                    <p>
                      💥 Dano causado: <strong>{e.dano}</strong>
                    </p>

                    <p>
                      ❤️ Vida restante: <strong>{e.vidaRestante}</strong>
                    </p>
                  </div>
                  <div className="separador-turno" />
                </div>
              </Delayed>
            );

          /* ===== INICIATIVA EXTRA ===== */

          case 'rolagemIniciativaExtra':
            return (
              <div key={i} className="card card-iniciativa-extra">
                <div className="card-title">⚡ Iniciativa Extra</div>
                <div>
                  {e.atacante}:{' '}
                  <DadoD20SVG
                    valor={e.rolagemAtacante}
                    delay={TEMPO_DADO_SVG}
                  />
                </div>
                <div>
                  {e.defensor}:{' '}
                  <DadoD20SVG
                    valor={e.rolagemDefensor}
                    delay={TEMPO_DADO_SVG}
                  />
                </div>
              </div>
            );

          case 'resultadoIniciativaExtra':
            return (
              <Delayed key={i} delay={TEMPO_DADO_SVG + TEMPO_RESPIRO}>
                <div className="card card-iniciativa-extra">
                  {e.conseguiu ? (
                    <p className="sucesso">🔥 {e.atacante} mantém o ataque!</p>
                  ) : (
                    <p className="alerta">
                      🛑 {e.defensor} quebra o ritmo do combate.
                    </p>
                  )}
                </div>
              </Delayed>
            );

          case 'fimCombate':
            return (
              <div key={i} className="card card-fim">
                🏆 <strong>{e.vencedor}</strong> venceu o combate!
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
