import { useEffect, useState } from 'react';
import './ArenaCombate.css';

export default function ArenaCombate() {
  const [combate, setCombate] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [acaoSelecionada, setAcaoSelecionada] = useState(null);

  const atacanteId = 1;
  const defensorId = 3;

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

    if (combate.fase === 'aguardandoIniciativa') {
      return (
        <div className="acoes">
          <button className="rolar" onClick={() => enviarAcao({})}>
            🎲 Rolar Iniciativa
          </button>
        </div>
      );
    }

    if (combate.fase === 'aguardandoAtaque') {
      return (
        <div className="acoes">
          <button onClick={() => setAcaoSelecionada({ acao: 'ataqueFisico' })}>
            ⚔️ Escolher Ataque Fisico
          </button>
          <button onClick={() => setAcaoSelecionada({ acao: 'ataqueMagico' })}>
            🔮 Escolher Ataque Mágico
          </button>
        </div>
      );
    }
    if (combate.fase === 'aguardandoDefesa') {
      return (
        <div className="acoes">
          <button
            onClick={() =>
              setAcaoSelecionada({ defesaEscolhida: 'defesaFisica' })
            }
          >
            🛡 Defesa Fisica
          </button>
          <button
            onClick={() =>
              setAcaoSelecionada({ defesaEscolhida: 'defesaMagica' })
            }
          >
            ✨ Defesa Mágica
          </button>
          <button
            onClick={() => setAcaoSelecionada({ defesaEscolhida: 'esquiva' })}
          >
            🤸🏼‍♀️ Esquiva
          </button>
        </div>
      );
    }
    return null;
  }
  return (
    <div className="arena">
      <h1>⚔️ Arena de Combate</h1>

      {!combate && (
        <button onClick={iniciarCombate} disabled={carregando}>
          ⚡️Iniciar Combate
        </button>
      )}

      {erro && <p className="erro">{erro}</p>}

      {combate && (
        <>
          <div className="status">
            <p>Turno: {combate.turno}</p>
            <p>Fase: {combate.fase}</p>
            <p>Atacante: {combate.atacanteAtual}</p>
            <p>Defensor: {combate.defensorAtual}</p>
          </div>
          <div className="vidas">
            {Object.values(combate.personagens).map(p => (
              <div key={p.nome} className="personagem">
                <strong>{p.nome}</strong>
                <span>❤️ {p.pontosDeVida}</span>
              </div>
            ))}
          </div>
          {renderAcoes()}

          {/* 🎲 ROLAR DADO */}
          {acaoSelecionada && !combate.finalizado && (
            <div className="acoes">
              <button
                className="rolar"
                disabled={carregando}
                onClick={() => {
                  enviarAcao(acaoSelecionada);
                  setAcaoSelecionada(null);
                }}
              >
                🎲 Rolar Dado
              </button>
            </div>
          )}
          <div className="log">
            <h3>📜 Log do Combate</h3>
            {combate.log.map((evento, i) => (
              <pre key={i}>{JSON.stringify(evento, null, 2)}</pre>
            ))}
          </div>

          {combate.finalizado && <h2 className="fim">🏆 Combate Finalizado</h2>}
        </>
      )}
    </div>
  );
}
