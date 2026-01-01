export default function EscolhaGolpe({
  titulo,
  golpes,
  selecionado,
  onSelecionar,
}) {
  return (
    <div className="acoes">
      <h3>{titulo}</h3>
      {golpes.map(g => (
        <button
          key={g.id}
          className={selecionado === g.id ? 'ativo' : ''}
          onClick={() => onSelecionar(g.id)}
        >
          {g.label}
        </button>
      ))}
    </div>
  );
}
