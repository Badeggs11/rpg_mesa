import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import MapaCampanha from './MapaCampanha';
import './PaginaMapaCampanha.css';

export default function PaginaMapaCampanha() {
  const location = useLocation();

  const [carregando, setCarregando] = useState(true);
  const [estadoCampanha, setEstadoCampanha] = useState(null);
  const [jogadorId, setJogadorId] = useState(null);
  const [mapaBase, setMapaBase] = useState(null);

  useEffect(() => {
    const dadosSalvos = sessionStorage.getItem('dadosMapaCampanha');

    if (dadosSalvos) {
      const dadosMapa = JSON.parse(dadosSalvos);

      setEstadoCampanha(
        location.state?.estadoCampanha || dadosMapa?.estadoCampanha
      );

      setJogadorId(location.state?.jogadorId || dadosMapa?.jogadorId);

      setMapaBase(location.state?.mapaBase || dadosMapa?.mapaBase);
    }

    setCarregando(false);
  }, [location.state]);
  if (carregando) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>🗺️ Mapa da Região</h1>
        <p>Carregando mapa...</p>
      </div>
    );
  }

  if (!estadoCampanha || !mapaBase || !jogadorId) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>🗺️ Mapa da Região</h1>
        <p>Não foi possível carregar os dados do mapa.</p>
        <Link to="/campanha">⬅ Voltar para campanha</Link>
      </div>
    );
  }
  return (
    <div className="pagina-mapa">
      <MapaCampanha
        estadoCampanha={estadoCampanha}
        jogadorId={jogadorId}
        mapaBase={mapaBase}
        onMover={() => {}}
      />
    </div>
  );
}
