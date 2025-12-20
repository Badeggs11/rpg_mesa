import { useState } from "react";
import { executarCombate } from "./api";

export default function CombatArena() {
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);

  async function atacar() {
    setErro(null);
    try {
      const res = await executarCombate({
        atacanteId: 1,
        defensorId: 2,
        armaAtacanteId: "longa",
        armaDefensorId: "longa",
        defesaEscolhida: "defesaFisica",
      });
      setResultado(res);
    } catch (e) {
      setErro(e.message);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>⚔️ Arena de Combate</h1>

      {resultado?.personagens && (
        <div style={{ marginBottom: 16 }}>
          {resultado.personagens.map((p) => (
            <div key={p.id}>
              <strong>{p.nome}</strong>❤️{p.vida}
            </div>
          ))}
        </div>
      )}

      <button onClick={atacar}>Atacar</button>

      {erro && <p style={{ color: "red" }}>{erro}</p>}

      {resultado?.log && (
        <pre style={{ marginTop: 20 }}>
          {JSON.stringify(resultado.log, null, 2)}
        </pre>
      )}
    </div>
  );
}
