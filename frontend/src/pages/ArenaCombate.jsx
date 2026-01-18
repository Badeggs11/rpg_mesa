import { useState, useEffect } from 'react';
import './ArenaCombate.css';
import Log from '../components/log/Log';
import ControleLateral from '../components/controle/ControleLateral';

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

  const [mostrarGolpes, setMostrarGolpes] = useState(false);

  useEffect(() => {
    setMostrarGolpes(false);
    setGolpe(null);
  }, [combate?.fase]);

  const atacanteId = 1;
  const defensorId = 2;
  function acaoDoBotaoDado() {
    if (!combate) return;

    // 🎲 confirmar ATAQUE
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

    // 🎲 confirmar DEFESA
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

    // 🎲 rolagens (iniciativa / ataque / defesa)
    enviarAcao({});
  }

  function limparSelecao() {
    setGolpe(null);
    setAltura(null);
    setLado(null);
    setMostrarGolpes(false);
  }

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
    return null;
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
            <div className="linha-status">
              {Object.values(combate.personagens).map(p => (
                <div key={p.nome} className="status-personagem">
                  <strong>{p.nome}</strong>
                  <br />
                  ❤️ Vida: {p.pontosDeVida}
                  <br />⚡ Stamina: {p.stamina}
                </div>
              ))}
            </div>
          </section>

          {renderAcoes()}

          <div className="painel-inferior">
            <div className="log-wrapper">
              <h3>📜 Log do Combate</h3>
              <Log eventos={combate.log} />
            </div>
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
          </div>

          {combate.finalizado && <h2 className="fim">🏆 Combate Finalizado</h2>}
        </>
      )}
    </div>
  );
}
