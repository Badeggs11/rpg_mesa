import React, { useEffect, useState } from 'react';
import { obterSentimento } from '../api/mundo';
import './PaginaSentimentosJogador.css';

export default function PaginaSentimentosJogador() {
  const [estadoCampanha, setEstadoCampanha] = useState(null);
  const [jogadorId, setJogadorId] = useState(null);
  const [sentimentoFome, setSentimentoFome] = useState(null);

  useEffect(() => {
    const dados = sessionStorage.getItem('dadosMapaCampanha');

    if (!dados) return;

    const dadosParseados = JSON.parse(dados);

    setEstadoCampanha(dadosParseados.estadoCampanha);
    setJogadorId(dadosParseados.jogadorId);
  }, []);

  useEffect(() => {
    async function carregarSentimentoFome() {
      try {
        const sentimento = await obterSentimento('fome');
        setSentimentoFome(sentimento);
      } catch (erro) {
        console.error('Erro ao carregar sentimento fome:', erro);
        setSentimentoFome(null);
      }
    }

    carregarSentimentoFome();
  }, []);

  if (!estadoCampanha) {
    return (
      <div className="pagina-sentimentos-container">
        <h1>💓 O que sinto</h1>
        <div className="card-sentimentos">
          <p>Nenhum dado da campanha foi encontrado.</p>
        </div>
      </div>
    );
  }

  const jogadorAtual = estadoCampanha?.jogadores?.find(j => j.id === jogadorId);

  const fome = jogadorAtual?.fome ?? 12;

  return (
    <div className="pagina-sentimentos-container">
      <h1 className="titulo-sentimentos">💓 O que sinto</h1>

      <div className="card-sentimentos">
        <p>
          <strong>Jogador:</strong> {jogadorAtual?.nome || 'Desconhecido'}
        </p>

        <hr />

        <h2>🍖 Fome</h2>

        <p>
          <strong>Nível atual:</strong> {fome}/24
        </p>

        <div className="barra-fome">
          <div
            className="preenchimento-fome"
            style={{ width: `${(fome / 24) * 100}%` }}
          />
        </div>

        <p className="descricao-sentimento">
          {sentimentoFome?.descricao || 'Descrição da fome não carregada.'}
        </p>
      </div>
    </div>
  );
}
