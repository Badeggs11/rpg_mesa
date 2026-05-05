import React, { useEffect, useState } from 'react';
import './PaginaMemoriaJogador.css';

export default function PaginaMemoriaJogador() {
  const [jogador, setJogador] = useState(null);

  useEffect(() => {
    const dados = sessionStorage.getItem('dadosMemoriaJogador');

    if (!dados) return;

    setJogador(JSON.parse(dados));
  }, []);

  if (!jogador) {
    return (
      <div className="pagina-memoria-container">
        <h1>🧠 Memória do Jogador</h1>
        <div className="card-memoria">
          <p>Nenhuma memória encontrada.</p>
        </div>
      </div>
    );
  }

  const memoria = jogador.memoria || {};
  const eventos = memoria.eventos || [];
  const conhecimentos = memoria.conhecimentos || [];

  return (
    <div className="pagina-memoria-container">
      <h1 className="titulo-memoria">🧠 Memória de {jogador.nome}</h1>

      <div className="card-memoria">
        <h2>📜 Background</h2>
        <p>
          {memoria.background ||
            'Este personagem ainda não tem passado definido.'}
        </p>

        <hr />

        <h2>🧩 Eventos vividos</h2>

        {eventos.length === 0 ? (
          <p>Nenhum evento registrado ainda.</p>
        ) : (
          <ul>
            {eventos.map((evento, index) => (
              <li key={index}>
                <strong>Rodada {evento.rodada}:</strong> {evento.descricao}
              </li>
            ))}
          </ul>
        )}

        <hr />

        <h2>💡 Conhecimentos</h2>

        {conhecimentos.length === 0 ? (
          <p>Nenhum conhecimento registrado ainda.</p>
        ) : (
          <ul>
            {conhecimentos.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
