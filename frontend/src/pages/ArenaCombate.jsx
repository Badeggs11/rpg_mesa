import { useState, useEffect } from 'react';
import './ArenaCombate.css';
import Log from '../components/log/Log';

import Rolagem from '../components/Rolagem';
import EscolhaGolpe from '../components/EscolhaGolpe';
import EscolhaDirecao from '../components/EscolhaDirecao';

export default function ArenaCombate() {
  const [combate, setCombate] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const [golpe, setGolpe] = useState(null);
  const [altura, setAltura] = useState(null);
  const [lado, setLado] = useState(null);

  const atacanteId = 1;
  const defensorId = 3;

  useEffect(() => {
    if (combate?.fase === 'aguardandoIniciativa') {
      enviarAcao({});
    }
  }, [combate?.fase]);

  function direcaoCompleta() {
    if (!altura || !lado) return null;
    return `${altura}-${lado}`;
  }

  async function iniciarCombate() {
    setErro(null);
    setCarregando(true);

    try {
      const res = await fetch('/api/combate/iniciar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ atacanteId, defensorId }),
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
  function renderAcoes() {
    if (!combate || combate.finalizado) return null;

    switch (combate.fase) {
      case 'aguardandoRolagemIniciativa':
        return (
          <Rolagem
            texto="Rolar Iniciativa"
            onRolar={() => enviarAcao({})}
            disabled={carregando}
          />
        );

      case 'aguardandoIniciativa':
        // essa fase resolve a iniciativa automaticamente no backend
        return (
          <div className="acoes">
            <p>Resolvendo iniciativa...</p>
          </div>
        );

      case 'aguardandoRolagemAtaque':
        return (
          <Rolagem
            texto="Rolar Ataque"
            onRolar={() => enviarAcao({})}
            disabled={carregando}
          />
        );

      case 'aguardandoAtaque':
        return (
          <>
            <EscolhaGolpe
              titulo="Golpe de Ataque"
              golpes={[
                { id: 'socoSimples', label: '👊 Soco' },
                { id: 'chuteSimples', label: '🦵 Chute' },
              ]}
              selecionado={golpe}
              onSelecionar={setGolpe}
            />

            <EscolhaDirecao
              altura={altura}
              lado={lado}
              setAltura={setAltura}
              setLado={setLado}
            />

            <button
              className="confirmar"
              disabled={!golpe || !direcaoCompleta()}
              onClick={() => {
                enviarAcao({
                  golpe,
                  direcao: direcaoCompleta(),
                });
                setGolpe(null);
                setAltura(null);
                setLado(null);
              }}
            >
              Confirmar Ataque
            </button>
          </>
        );

      case 'aguardandoRolagemDefesa':
        return (
          <Rolagem
            texto="Rolar Defesa"
            onRolar={() => enviarAcao({})}
            disabled={carregando}
          />
        );

      case 'aguardandoDefesa':
        return (
          <>
            <EscolhaGolpe
              titulo="Golpe de Defesa"
              golpes={[
                { id: 'bloqueioSimples', label: '🛡 Bloqueio' },
                { id: 'esquivaSimples', label: '🤸 Esquiva' },
              ]}
              selecionado={golpe}
              onSelecionar={setGolpe}
            />

            <EscolhaDirecao
              altura={altura}
              lado={lado}
              setAltura={setAltura}
              setLado={setLado}
            />

            <button
              className="confirmar"
              disabled={!golpe || !direcaoCompleta()}
              onClick={() => {
                enviarAcao({
                  golpe,
                  direcao: direcaoCompleta(),
                });
                setGolpe(null);
                setAltura(null);
                setLado(null);
              }}
            >
              Confirmar Defesa
            </button>
          </>
        );

      default:
        return null;
    }
  }

  return (
    <div className="arena">
      <h1>⚔️ Arena de Combate</h1>

      {!combate && (
        <button onClick={iniciarCombate} disabled={carregando}>
          ⚡ Iniciar Combate
        </button>
      )}

      {erro && <p className="erro">{erro}</p>}

      {combate && (
        <>
          <section className="painel-combate">
            <div className="linha-turno">
              ⚔️ Turno <span>{combate.turno}</span>
            </div>

            <div className="linha-fase">
              Fase: <strong>{combate.fase}</strong>
            </div>

            <div className="linha-personagens">
              <div>
                🗡 <strong>Atacante:</strong> {combate.atacanteAtual}
              </div>
              <div>
                🛡 <strong>Defensor:</strong> {combate.defensorAtual}
              </div>
            </div>
          </section>

          {renderAcoes()}

          <div className="log-wrapper">
            <h3>📜 Log do Combate</h3>
            <Log eventos={combate.log} />
          </div>

          {combate.finalizado && <h2 className="fim">🏆 Combate Finalizado</h2>}
        </>
      )}
    </div>
  );
}
