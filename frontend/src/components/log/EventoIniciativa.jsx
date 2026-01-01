export default function EventoIniciativa({ evento }) {
  return (
    <div className="card card-iniciativa">
      <div className="card-title">🎲 Iniciativa</div>

      <div className="linha">
        <span>A:</span> <strong>{evento.iniciativaA}</strong>
        <span className="sep">.</span>
        <span>B:</span> <strong>{evento.iniciativaB}</strong>
      </div>

      <div className="destaque">
        Comeca: <strong>{evento.primeiro}</strong>
      </div>
    </div>
  );
}
