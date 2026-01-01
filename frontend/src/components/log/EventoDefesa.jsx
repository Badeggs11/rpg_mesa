export default function EventoDefesa({ evento }) {
  return (
    <div className="card card-defesa">
      <div className="card-title">🛡 Defesa</div>

      <p>
        <strong>{evento.defensor}</strong> se defende
      </p>

      <p>
        🧤 Defesa total: <strong>{evento.valorDefesa}</strong>
      </p>

      <div className="destaque">
        💔 Dano recebido: <strong>{evento.dano}</strong>
        <br />
        ❤️ Vida restante: <strong>{evento.vidaRestante}</strong>
      </div>

      {evento.evadiu && <p className="sucesso">✨ Esquivou com sucesso!</p>}
    </div>
  );
}
