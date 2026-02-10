import './log.css';
import DadoD20SVG from '../DadoD20SVG';
import DadoD20Three from '../DadoD20Three';

import DadoD6Three from '../dados/DadoD6Three';

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
function Delayed({ delay = 2000, onShow, children }) {
  const [show, setShow] = useState(false);

  useLayoutEffect(() => {
    setShow(false);
    const t = setTimeout(() => {
      setShow(true);
      onShow?.(); // 🔥 avisa o log
    }, delay);

    return () => clearTimeout(t);
  }, [delay]);

  if (!show) return null;
  return children;
}

export default function Log({ eventos }) {
  const logRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);

  function scrollParaAgora() {
    if (!logRef.current) return;
    requestAnimationFrame(() => {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    });
  }

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
          case 'instrucao':
            return (
              <div key={i} className="card card-instrucao texto-narrativo">
                {e.texto}
              </div>
            );

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
              <Delayed
                key={i}
                delay={TEMPO_DADO_SVG + TEMPO_RESPIRO}
                onShow={scrollParaAgora}
              >
                <div className="card card-iniciativa">
                  🔥 <strong>{e.primeiro}</strong> toma a iniciativa!
                </div>
              </Delayed>
            );

          case 'rolagemTempoAtaqueIniciada': {
            const r = buscarResultado(
              eventos,
              i,
              'rolagemTempoAtaqueResultado'
            );

            return (
              <div key={i} className="card card-tempo">
                ⏱️ Rolagem do Tempo de Ataque
                <DadoD20Three
                  key={`tempo-atk-${i}`}
                  valor={r?.valor}
                  delay={TEMPO_DADO_THREE}
                  revelar={!!r}
                />
              </div>
            );
          }

          case 'rolagemTempoAtaqueResultado':
            return (
              <Delayed
                key={i}
                delay={TEMPO_DADO_THREE + TEMPO_RESPIRO}
                onShow={() => {
                  window.dispatchEvent(new Event('iniciar-tempo-ataque'));
                }}
              >
                <div className="card card-tempo texto-narrativo">
                  ⏳ Você tem <strong>{e.valor}</strong> segundos para atacar!
                </div>
              </Delayed>
            );
          case 'percepcaoRolada': {
            return (
              <div key={i} className="card card-percepcao">
                👁️ Tentativa de Percepção de <strong>{e.defensor}</strong>
                <DadoD6Three
                  key={`perc-${i}`}
                  valor={e.d6}
                  delay={TEMPO_DADO_THREE}
                  revelar={true}
                />
              </div>
            );
          }

          case 'informacaoDirecaoLiberada':
            return (
              <Delayed key={i} delay={TEMPO_DADO_SVG + TEMPO_RESPIRO}>
                <div className="card card-percepcao texto-narrativo">
                  👁 <strong>{e.defensor}</strong> antecipa o golpe vindo de{' '}
                  <strong>{e.direcao}</strong> por <strong>{e.duracao}s</strong>
                </div>
              </Delayed>
            );

          case 'rolagemTempoDefesaIniciada': {
            const r = buscarResultado(
              eventos,
              i,
              'rolagemTempoDefesaResultado'
            );

            return (
              <div key={i} className="card card-tempo">
                ⏱️ Rolagem do Tempo de Defesa
                <DadoD20Three
                  key={`tempo-def-${i}`}
                  valor={r?.valor}
                  delay={TEMPO_DADO_THREE}
                  revelar={!!r}
                />
              </div>
            );
          }

          case 'rolagemTempoDefesaResultado':
            return (
              <Delayed key={i} delay={TEMPO_DADO_THREE + TEMPO_RESPIRO}>
                <div className="card card-tempo texto-narrativo">
                  🛡️ Você tem <strong>{e.valor}</strong> segundos para se
                  defender!
                </div>
              </Delayed>
            );

          case 'tempoEsgotado':
            return (
              <div key={i} className="card card-alerta">
                ⌛ Tempo de ataque esgotado! A vez passa.
              </div>
            );

          case 'tempoDefesaEsgotado':
            return (
              <div key={i} className="card card-alerta">
                💥 Tempo de defesa esgotado! O golpe acerta em cheio.
              </div>
            );

          /* ===== ATAQUE ===== */

          case 'rolagemAtaqueIniciada': {
            const r = buscarResultado(eventos, i, 'rolagemAtaqueResultado');

            return (
              <div key={i} className="card card-ataque">
                🎲 Rolagem de Ataque
                <DadoD20Three
                  key={`atk-${i}`}
                  valor={r?.valor}
                  delay={TEMPO_DADO_THREE}
                  revelar={!!r}
                />
              </div>
            );
          }

          case 'rolagemAtaqueResultado':
            return (
              <Delayed
                key={i}
                delay={TEMPO_DADO_THREE + TEMPO_RESPIRO}
                onShow={scrollParaAgora}
              >
                <div className="card card-ataque texto-narrativo">
                  🎯 Ataque alcança <strong>{e.valor}</strong> no dado
                </div>
              </Delayed>
            );

          case 'ataque':
            return (
              <div key={i} className="card card-ataque texto-narrativo">
                <strong>{e.atacante}</strong> ataca com <em>{e.golpe}</em>
              </div>
            );

          /* ===== DEFESA ===== */

          case 'rolagemDefesaIniciada': {
            const r = buscarResultado(eventos, i, 'rolagemDefesaResultado');

            return (
              <div key={i} className="card card-defesa">
                🎲 Rolagem de Defesa
                <DadoD20Three
                  key={`def-${i}`}
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
                  🛡 Defesa alcança <strong>{e.valor}</strong> no dado
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
            let explicacao = null;

            if (e.dano === 0) {
              if (e.evadiu) {
                explicacao =
                  '🤸 Defesa perfeita! O golpe foi totalmente esquivado.';
              } else if (e.defesaBemSucedida && e.acertosDirecao === 2) {
                explicacao =
                  '🛡 Defesa sólida! A direção foi correta e o ataque foi neutralizado.';
              } else if (e.acertosDirecao === 0) {
                explicacao =
                  '❌ Ataque mal direcionado — o golpe passou longe do alvo.';
              } else {
                explicacao =
                  '⚔️ A defesa resistiu ao ataque e absorveu todo o impacto.';
              }
            } else {
              if (e.acertosDirecao === 2) {
                explicacao =
                  '🔥 Golpe direto! Ataque e direção foram perfeitamente executados.';
              } else if (e.acertosDirecao === 1) {
                explicacao =
                  '⚠️ Acerto parcial — a defesa reduziu parte do impacto.';
              }
            }

            return (
              <Delayed
                key={i}
                delay={TEMPO_DADO_THREE + TEMPO_RESPIRO + 400}
                onShow={scrollParaAgora}
              >
                <div>
                  <div className="card">
                    <div className="card-title">⚔️ Resolução do Turno</div>

                    {/* 🆕 NARRAÇÃO DO GOLPE */}
                    <p className="texto-narrativo">
                      <strong>{e.atacante}</strong> atacou na direção{' '}
                      <strong>{e.direcaoAtaque}</strong>.
                    </p>

                    <p className="texto-narrativo">
                      <strong>{e.defensor}</strong> defendeu na direção{' '}
                      <strong>{e.direcaoDefesa}</strong>.
                    </p>

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

                    {/* 👇 AQUI entra a explicação */}
                    {explicacao && (
                      <p className="texto-narrativo destaque">{explicacao}</p>
                    )}
                    <p className="texto-narrativo">
                      <strong>{e.atacante}</strong> atacou na direção{' '}
                      <strong>{e.direcaoAtaque}</strong>.
                    </p>

                    <p className="texto-narrativo">
                      <strong>{e.defensor}</strong> defendeu na direção{' '}
                      <strong>{e.direcaoDefesa}</strong>.
                    </p>

                    <p>
                      ❤️ Vida restante: <strong>{e.vidaRestante}</strong>
                    </p>
                  </div>
                  <div className="separador-turno" />
                </div>
              </Delayed>
            );

          case 'staminaRecuperada':
            return (
              <div key={i} className="card card-stamina">
                🔋 <strong>{e.personagem}</strong> recupera{' '}
                <strong>{e.recuperacao}</strong> de stamina
                <br />
                (Resistência: {e.resistencia})<br />
                Stamina: {e.staminaAntes} → <strong>{e.staminaAtual}</strong>
              </div>
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

          case 'avaliacaoIniciativaExtra':
            return (
              <div
                key={i}
                className="card card-iniciativa-extra texto-narrativo"
              >
                ⚡ <strong>{e.atacante}</strong> avalia um ataque consecutivo:
                <br />
                Stamina atual: <strong>{e.staminaAtual}</strong>
                <br />
                Necessária: <strong>{e.staminaNecessaria}</strong>
                <br />
                {e.podeTentar ? (
                  <span className="sucesso">
                    🔥 Força suficiente para tentar!
                  </span>
                ) : (
                  <span className="alerta">
                    ❌ Cansado demais para continuar.
                  </span>
                )}
              </div>
            );

          case 'resultadoIniciativaExtra':
            return (
              <Delayed
                key={i}
                delay={TEMPO_DADO_SVG + TEMPO_RESPIRO}
                onShow={scrollParaAgora}
              >
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
