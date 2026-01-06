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
                  🎲 Dado A: <strong>{e.rolagemA}</strong>
                </p>

                <p>
                  🎲 Dado B: <strong>{e.rolagemB}</strong>
                </p>

                {e.bonusA > 0 && <p>✨ Bônus A: +{e.bonusA}</p>}

                {e.bonusB > 0 && <p>✨ Bônus B: +{e.bonusB}</p>}

                <p className="destaque">
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
                  {e.evadiu && (
                    <p className="sucesso">🤸 Esquiva perfeita! Nenhum dano.</p>
                  )}

                  {!e.evadiu && e.dano === 0 && (
                    <p className="sucesso">🛡 Golpe totalmente bloqueado!</p>
                  )}

                  {!e.evadiu && e.dano > 0 && (
                    <p className="alerta">💥 O golpe atravessa a defesa!</p>
                  )}

                  <p>
                    💥 Dano: <strong>{e.dano}</strong>
                  </p>
                  <p>
                    ❤️ Vida restante: <strong>{e.vidaRestante}</strong>
                  </p>
                </div>
              </div>
            );

          case 'staminaGasta':
            return (
              <div key={i} className="card card-stamina">
                ⚡ <strong>{e.personagem}</strong> gastou{' '}
                <strong>{e.custo}</strong> de stamina
                <br />
                🔋 Stamina restante: <strong>{e.staminaRestante}</strong>
              </div>
            );
          case 'rolagemIniciativaExtra':
            return (
              <div key={i} className="card card-iniciativa">
                <div className="card-title">🎲 Iniciativa Extra</div>
                <p>
                  {e.atacante}: <strong>{e.rolagemAtacante}</strong>
                </p>
                <p>
                  {e.defensor}: <strong>{e.rolagemDefensor}</strong>
                </p>
              </div>
            );
          case 'ataqueConsecutivo':
            return (
              <div key={i} className="card card-ataque">
                🔥 <strong>{e.atacante}</strong> força um ataque consecutivo!
                <br />
                🔋 Stamina restante: <strong>{e.staminaRestante}</strong>
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
