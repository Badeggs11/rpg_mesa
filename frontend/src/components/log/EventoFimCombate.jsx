export default function EventoFimCombate({ evento }) {
  return (
    <div className="card card-fim">
      <div className="card-title">🏁 Fim de Combate</div>

      <p>
        <strong>{evento.vencedor}</strong> venceu o combate
      </p>
      <p>
        <em>{evento.derrotado}</em> foi derrotado
      </p>
    </div>
  );
}
