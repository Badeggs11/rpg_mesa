export default function Rolagem({ texto, onRolar, disabled }) {
  return (
    <div className="acoes">
      <button
        type="button"
        className="rolar"
        onClick={onRolar}
        disabled={disabled}
      >
        🎲 {texto}
      </button>
    </div>
  );
}
