import React, { useEffect, useState } from 'react';
import { obterEfeitoFome } from '../api/mundo';
import './PaginaEfeitosJogador.css';

export default function PaginaEfeitosJogador() {
  const [estadoCampanha, setEstadoCampanha] = useState(null);
  const [jogadorId, setJogadorId] = useState(null);
  const [efeitoFome, setEfeitoFome] = useState(null);

  useEffect(() => {
    const dados = sessionStorage.getItem('dadosMapaCampanha');

    if (!dados) return;

    const dadosParseados = JSON.parse(dados);

    setEstadoCampanha(dadosParseados.estadoCampanha);
    setJogadorId(dadosParseados.jogadorId);
  }, []);

  useEffect(() => {
    async function carregarEfeito() {
      if (!estadoCampanha || !jogadorId) return;

      const jogadorAtual = estadoCampanha?.jogadores?.find(
        j => j.id === jogadorId
      );

      console.log('JOGADOR ATUAL COMPLETO:', jogadorAtual);

      const fomeAtual = jogadorAtual?.fome ?? 12;

      try {
        const efeito = await obterEfeitoFome(jogadorAtual, fomeAtual);
        setEfeitoFome(efeito);
      } catch (erro) {
        console.error('Erro ao carregar efeito da fome:', erro);
        setEfeitoFome(null);
      }
    }

    carregarEfeito();
  }, [estadoCampanha, jogadorId]);

  if (!estadoCampanha) {
    return (
      <div className="pagina-efeitos-container">
        <h1>⚡ O que está me afetando</h1>
        <div className="card-efeitos">
          <p>Nenhum dado da campanha foi encontrado.</p>
        </div>
      </div>
    );
  }

  const jogadorAtual = estadoCampanha?.jogadores?.find(j => j.id === jogadorId);
  const fome = jogadorAtual?.fome ?? 12;
  const atributos = efeitoFome?.atributosAfetados || {};

  return (
    <div className="pagina-efeitos-container">
      <h1 className="titulo-efeitos">⚡ O que está me afetando</h1>

      <div className="card-efeitos">
        <p>
          <strong>Jogador:</strong> {jogadorAtual?.nome || 'Desconhecido'}
        </p>

        <hr />

        <h2>🍖 Efeito da fome</h2>

        <p>
          <strong>Fome atual:</strong> {fome}/24
        </p>

        <p>
          <strong>Penalidade aplicada:</strong>{' '}
          {efeitoFome ? `-${efeitoFome.penalidade}` : '...'}
        </p>

        <h3>Atributos após efeito</h3>

        <ul>
          <li>💪 Força: {atributos.forca ?? '...'}</li>
          <li>⚡ Agilidade: {atributos.agilidade ?? '...'}</li>
          <li>🛡 Resistência: {atributos.resistencia ?? '...'}</li>
          <li>👁 Percepção: {atributos.percepcao ?? '...'}</li>
          <li>👁️‍🗨️ Percepção Visual: {atributos.percepcaoVisual ?? '...'}</li>
          <li>🧠 Inteligência: {atributos.inteligencia ?? '...'}</li>
          <li>🔥 Stamina: {atributos.stamina ?? '...'}</li>
        </ul>
      </div>
    </div>
  );
}
