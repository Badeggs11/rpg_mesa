import { useEffect, useState } from 'react';
import { listarPersonagens } from '../api/personagens';

export default function ListarPersonagens({ onSelecionar }) {
  const [personagens, setPersonagens] = useState([]);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const data = await listarPersonagens();
        setPersonagens(data);
      } catch (e) {
        setErro(e.message);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);
  if (loading) return <p>Carregando personagens...</p>;
  if (erro) return <p style={{ color: 'red' }}>{erro}</p>;
  return (
    <div style={{ padding: 20 }}>
      <h1>📜 Personagens</h1>

      {personagens.length === 0 && <p>Nenhum personagem cadastrado.</p>}

      {personagens.map(p => (
        <div
          key={p.id}
          style={{
            border: '1px solid #ccc',
            padding: 12,
            marginBottom: 12,
            borderRadius: 6,
          }}
        >
          <strong>{p.nome}</strong>
          <div>❤️ Vida: {p.vida}</div>
          <div>⚡️ Stamina: {p.stamina}</div>
          <div>👁 Percepção: {p.percepcao}</div>

          <div>💪🏼 Força: {p.forca}</div>
          <div>⚡️ Agilidade: {p.agilidade}</div>
          <div>🛡 Resistência: {p.resistencia}</div>
          <div>🧠 Inteligência: {p.inteligencia}</div>

          {onSelecionar && (
            <button style={{ marginTop: 8 }} onClick={() => onSelecionar(p)}>
              Selecionar
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
