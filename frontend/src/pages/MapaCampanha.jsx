import React, { useEffect, useState } from 'react';
import './MapaCampanha.css';

function MapaCampanha({ onMover }) {
  const [estadoCampanha, setEstadoCampanha] = useState(null);
  const [jogadorId, setJogadorId] = useState(null);
  const [mapaBase, setMapaBase] = useState(null);
  const [campoVisao, setCampoVisao] = useState(null);

  useEffect(() => {
    function carregarDados() {
      const dados = sessionStorage.getItem('dadosMapaCampanha');

      if (!dados) return;

      const dadosMapa = JSON.parse(dados);

      setEstadoCampanha(dadosMapa.estadoCampanha);
      setJogadorId(dadosMapa.jogadorId);
      setMapaBase(dadosMapa.mapaBase);
    }

    carregarDados();

    const interval = setInterval(carregarDados, 500); // 🔁 atualiza a cada 0.5s

    return () => clearInterval(interval);
  }, []);

  console.log('DEBUG:', {
    estadoCampanha,
    jogadorId,
    mapaBase,
  });

  if (!estadoCampanha || !mapaBase) {
    return <div>Carregando mapa...</div>;
  }

  function getIconeLocal(id) {
    if (id.includes('taverna')) return '🍺';
    if (id.includes('igreja')) return '⛪';
    if (id.includes('loja_armas')) return '⚔️';
    if (id.includes('loja_pocoes')) return '🧪';
    if (id.includes('restaurante')) return '🍽️';
    if (id.includes('prefeitura')) return '🏛️';
    if (id.includes('praca')) return '🧿';
    if (id.includes('casa')) return '🏠';

    return '⬛';
  }

  const exploracaoJogador = estadoCampanha.exploracao[jogadorId];

  if (!exploracaoJogador) {
    return <div>Exploração não encontrada</div>;
  }

  const locaisDescobertos = exploracaoJogador.locaisDescobertos || [];
  const posicaoAtual = estadoCampanha?.mapa?.posicaoJogadores?.[jogadorId];

  function montarGridDoMapa() {
    const locais = Object.values(mapaBase);

    const minX = Math.min(...locais.map(local => local.pos.x));
    const maxX = Math.max(...locais.map(local => local.pos.x));
    const minY = Math.min(...locais.map(local => local.pos.y));
    const maxY = Math.max(...locais.map(local => local.pos.y));

    const grid = [];

    for (let y = minY; y <= maxY; y++) {
      const linha = [];

      for (let x = minX; x <= maxX; x++) {
        const localEncontrado = locais.find(
          local => local.pos.x === x && local.pos.y === y
        );

        if (localEncontrado) {
          linha.push(localEncontrado);
        } else {
          linha.push(null);
        }
      }

      grid.push(linha);
    }

    return grid;
  }

  const gridMapa = montarGridDoMapa();

  return (
    <div className="mapa-container">
      <h2>Mapa da Campanha</h2>

      <div className="grid-mapa-real">
        {gridMapa.map((linha, y) =>
          linha.map((local, x) => {
            if (!local) {
              return (
                <div key={`${x}-${y}`} className="tile-real tile-vazio">
                  <div className="tile-icone">·</div>
                </div>
              );
            }

            const estaAqui = posicaoAtual?.localAtual === local.id;

            return (
              <button
                key={local.id}
                className={`tile-real ${estaAqui ? 'tile-atual' : ''}`}
                onClick={() => onMover(local.id)}
              >
                <div className="tile-icone">
                  {estaAqui ? '🧍' : getIconeLocal(local.id)}
                </div>

                <div className="tile-nome">{local.nome}</div>

                {estaAqui && (
                  <div className="tile-status">📍 Você está aqui</div>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* 👁️ AQUI ENTRA O PASSO 8.3 */}
      {campoVisao && (
        <div
          className="grid-mapa"
          style={{
            gridTemplateColumns: `repeat(${campoVisao[0].length}, 1fr)`,
          }}
        >
          {campoVisao.flat().map((tile, index) => (
            <div key={index} className="tile">
              {tile}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MapaCampanha;
