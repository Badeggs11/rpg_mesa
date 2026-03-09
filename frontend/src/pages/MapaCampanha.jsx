import React from 'react';

function MapaCampanha({ estadoCampanha, jogadorId, mapaBase, onMover }) {
  if (!estadoCampanha) {
    return <div>Carregando mapa...</div>;
  }

  const exploracaoJogador = estadoCampanha.exploracao[jogadorId];

  if (!exploracaoJogador) {
    return <div>Exploração não encontrada</div>;
  }

  const locaisDescobertos = exploracaoJogador.locaisDescobertos || [];
  const posicaoAtual = estadoCampanha?.mapa?.posicaoJogadores?.[jogadorId];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Mapa da Campanha</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {locaisDescobertos.map(localId => {
          const local = mapaBase[localId];
          if (!local) return null;

          const estaAqui = posicaoAtual === localId;

          return (
            <button
              key={localId}
              onClick={() => onMover(localId)}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #444',
                backgroundColor: estaAqui ? '#4CAF50' : '#eee',
                cursor: 'pointer',
                minWidth: '140px',
              }}
            >
              <div>
                <strong>{local.nome}</strong>
              </div>

              <div style={{ fontSize: '12px' }}>
                {estaAqui ? '📍 Você está aqui' : 'Mover'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MapaCampanha;
