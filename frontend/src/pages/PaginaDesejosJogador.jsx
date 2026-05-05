import React, { useEffect, useState } from 'react';
import { obterDesejo } from '../api/mundo';
import './PaginaDesejosJogador.css';

export default function PaginaDesejosJogador() {
  const [estadoCampanha, setEstadoCampanha] = useState(null);
  const [jogadorId, setJogadorId] = useState(null);
  const [desejoComer, setDesejoComer] = useState(null);

  useEffect(() => {
    const dados = sessionStorage.getItem('dadosMapaCampanha');

    if (!dados) return;

    const dadosParseados = JSON.parse(dados);

    setEstadoCampanha(dadosParseados.estadoCampanha);
    setJogadorId(dadosParseados.jogadorId);
  }, []);

  useEffect(() => {
    async function carregarDesejo() {
      if (!estadoCampanha || !jogadorId) return;

      const jogadorAtual = estadoCampanha?.jogadores?.find(
        j => j.id === jogadorId
      );

      const fomeAtual = jogadorAtual?.fome ?? 12;

      try {
        const desejo = await obterDesejo('quero_comer', fomeAtual);
        setDesejoComer(desejo);
      } catch (erro) {
        console.error('Erro ao carregar desejo:', erro);
        setDesejoComer(null);
      }
    }

    carregarDesejo();
  }, [estadoCampanha, jogadorId]);

  if (!estadoCampanha) {
    return (
      <div className="pagina-desejos-container">
        <h1>🔥 O que quero</h1>
        <div className="card-desejos">
          <p>Nenhum dado da campanha foi encontrado.</p>
        </div>
      </div>
    );
  }

  const jogadorAtual = estadoCampanha?.jogadores?.find(j => j.id === jogadorId);

  const fome = jogadorAtual?.fome ?? 12;

  const intensidade = desejoComer?.intensidade || null;
  const quantidade = desejoComer?.quantidadeNecessaria ?? null;

  return (
    <div className="pagina-desejos-container">
      <h1 className="titulo-desejos">🔥 O que quero</h1>

      <div className="card-desejos">
        <p>
          <strong>Jogador:</strong> {jogadorAtual?.nome || 'Desconhecido'}
        </p>

        <hr />

        <h2>🍖 Desejo de comer</h2>

        <p>
          <strong>Intensidade:</strong> {intensidade || '...'}
        </p>

        <p>
          <strong>Quantidade necessária:</strong>{' '}
          {quantidade !== null ? quantidade : '...'}
        </p>

        <p className="descricao-desejo">
          {desejoComer?.descricao || 'Descrição não carregada.'}
        </p>
      </div>
    </div>
  );
}
