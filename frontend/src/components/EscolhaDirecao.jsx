export default function EscolhaDirecao({ altura, lado, setAltura, setLado }) {
  return (
    <div className="acoes">
      <h3>Altura</h3>
      {['alto', 'medio', 'baixo'].map(a => (
        <button
          key={a}
          className={altura === a ? 'ativo' : ''}
          onClick={() => setAltura(a)}
        >
          {a.toUpperCase()}
        </button>
      ))}

      <h3>Direção</h3>
      {['esquerda', 'frontal', 'direita'].map(l => (
        <button
          key={l}
          className={lado === l ? 'ativo' : ''}
          onClick={() => setLado(l)}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
