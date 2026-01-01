export default function EventoAtaque({ evento }) {
  return (
    <div className="card card-ataque">
      <div className="card-title">⚔️ Ataque</div>

      <p>
        <strong>{evento.atacante}</strong> ataca
      </p>

      {evento.rolagem !== undefined && (
        <p>
          🎲 Rolagem: <strong>{evento.rolagem}</strong>
        </p>
      )}

      <p>
        💫 Ataque total: <strong>{evento.valorAtaque}</strong>
      </p>
    </div>
  );
}
