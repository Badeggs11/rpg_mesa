export default function Log({ eventos }) {
  if (!eventos || eventos.length === 0) {
    return <p className="log-vazio">Nenhum evento ainda</p>;
  }

  return (
    <div className="log">
      {eventos.map((e, i) => {
        switch (e.tipo) {
          case 'rolagemIniciativa':
            return (
              <div key={i} className="card card-iniciativa">
                <div className="card-title">🎲 Rolagem de Iniciativa</div>
                <p>
                  {e.personagemA}: <strong>{e.rolagemA}</strong>
                </p>
                <p>
                  {e.personagemB}: <strong>{e.rolagemB}</strong>
                </p>
              </div>
            );

          case 'empateIniciativa':
            return (
              <div key={i} className="card card-iniciativa">
                <div className="card-title">⚠️ Empate</div>
                <p>Ambos tiraram {e.iniciativaA}. Nova rolagem!</p>
              </div>
            );

          case 'iniciativa':
            return (
              <div key={i} className="card card-iniciativa">
                <div className="card-title">🏁 Iniciativa</div>
                <p>
                  A: {e.rolagemA} + {e.bonusA} ={' '}
                  <strong>{e.iniciativaA}</strong>
                </p>
                <p>
                  B: {e.rolagemB} + {e.bonusB} ={' '}
                  <strong>{e.iniciativaB}</strong>
                </p>
                <p>
                  🔥 Primeiro: <strong>{e.primeiro}</strong>
                </p>
              </div>
            );

          case 'rolagemAtaque':
            return (
              <div key={i} className="card card-ataque">
                🎲 Rolagem de Ataque: <strong>{e.valor}</strong>
              </div>
            );

          case 'rolagemDefesa':
            return (
              <div key={i} className="card card-defesa">
                🎲 Rolagem de Defesa: <strong>{e.valor}</strong>
              </div>
            );
          case 'narrativaDefesa':
            return (
              <div key={i} className="card card-defesa">
                <div className="card-title">🛡 Defesa</div>
                <p>
                  <strong>{e.defensor}</strong> tenta {e.golpe} ({e.direcao})
                </p>
                {e.direcaoCorreta ? (
                  <p className="destaque">🎯 Defesa na direção correta!</p>
                ) : (
                  <p className="destaque">❌ Defesa fora da direção!</p>
                )}
                case 'narrativaDefesa':
              </div>
            );

          case 'resolucaoTurno':
            return (
              <div key={i} className="card">
                <div className="card-title">⚔️ Resolução do Turno</div>

                <p>
                  <strong>{e.atacante}</strong> atacou com{' '}
                  <em>{e.golpeAtaque}</em> ({e.direcao})
                </p>

                <p>
                  Ataque: 🎲 {e.rolagemAtaque} →{' '}
                  <strong>{e.valorAtaque}</strong>
                </p>
                <p>
                  Defesa: 🎲 {e.rolagemDefesa} →{' '}
                  <strong>{e.valorDefesa}</strong>
                </p>

                <div className="destaque">
                  💥 Dano: <strong>{e.dano}</strong>
                  <br />
                  ❤️ Vida restante: <strong>{e.vidaRestante}</strong>
                </div>
              </div>
            );

          case 'fimCombate':
            return (
              <div key={i} className="card card-fim">
                🏆 <strong>{e.vencedor}</strong> venceu o combate!
              </div>
            );

          default:
            return (
              <div key={i} className="card">
                Evento desconhecido: {e.tipo}
              </div>
            );
        }
      })}
    </div>
  );
}
