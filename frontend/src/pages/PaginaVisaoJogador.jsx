import React, { useEffect, useState } from 'react';
import { obterLugarDetalhado } from '../api/mundo';
import './PaginaVisaoJogador.css';

export default function PaginaVisaoJogador() {
  const [estadoCampanha, setEstadoCampanha] = useState(null);
  const [jogadorId, setJogadorId] = useState(null);
  const [mapaBase, setMapaBase] = useState(null);
  const [modoVisao, setModoVisao] = useState('externo');
  const [localInternoAtual, setLocalInternoAtual] = useState(null);
  const [lugarDetalhado, setLugarDetalhado] = useState(null);

  useEffect(() => {
    const dados = sessionStorage.getItem('dadosMapaCampanha');

    if (!dados) return;

    const dadosParseados = JSON.parse(dados);

    setEstadoCampanha(dadosParseados.estadoCampanha);
    setJogadorId(dadosParseados.jogadorId);
    setMapaBase(dadosParseados.mapaBase);
    setModoVisao(dadosParseados.modoVisao || 'externo');
    setLocalInternoAtual(dadosParseados.localInternoAtual || null);
  }, []);

  useEffect(() => {
    async function carregarLugarDetalhado() {
      if (modoVisao !== 'interno') return;
      if (!localInternoAtual) return;

      try {
        const lugar = await obterLugarDetalhado(localInternoAtual);
        setLugarDetalhado(lugar);
      } catch (erro) {
        console.error('Erro ao carregar lugar detalhado:', erro);
        setLugarDetalhado(null);
      }
    }

    carregarLugarDetalhado();
  }, [modoVisao, localInternoAtual]);

  if (!estadoCampanha) {
    return (
      <div className="pagina-visao-container">
        <h1 className="titulo-visao">👁️ Visão do Jogador</h1>
        <div className="card-visao">
          <p>Nenhum dado da campanha foi encontrado.</p>
        </div>
      </div>
    );
  }

  const jogadorAtual = estadoCampanha?.jogadores?.find(j => j.id === jogadorId);

  const posicaoJogador =
    estadoCampanha?.mapa?.posicaoJogadores?.[jogadorId] || null;
  function buscarLocaisPorDirecao() {
    if (!posicaoJogador?.pos || !mapaBase) {
      return {
        norte: null,
        sul: null,
        leste: null,
        oeste: null,
      };
    }

    const locais = Object.values(mapaBase || {});

    const { x, y } = posicaoJogador.pos;

    let norte = null;
    let sul = null;
    let leste = null;
    let oeste = null;

    for (const local of locais) {
      if (!local?.pos) continue;

      const dx = local.pos.x - x;
      const dy = local.pos.y - y;

      if (dx === 0 && dy === 0) continue;

      // NORTE = y menor
      if (dy < 0) {
        const distancia = Math.abs(dy) + Math.abs(dx) * 0.2;

        if (!norte || distancia < norte.distancia) {
          norte = {
            nome: local.nome || local.id,
            id: local.id,
            distancia,
          };
        }
      }

      // SUL = y maior
      if (dy > 0) {
        const distancia = Math.abs(dy) + Math.abs(dx) * 0.2;

        if (!sul || distancia < sul.distancia) {
          sul = {
            nome: local.nome || local.id,
            id: local.id,
            distancia,
          };
        }
      }

      // LESTE = x maior
      if (dx > 0) {
        const distancia = Math.abs(dx) + Math.abs(dy) * 0.2;

        if (!leste || distancia < leste.distancia) {
          leste = {
            nome: local.nome || local.id,
            id: local.id,
            distancia,
          };
        }
      }

      // OESTE = x menor
      if (dx < 0) {
        const distancia = Math.abs(dx) + Math.abs(dy) * 0.2;

        if (!oeste || distancia < oeste.distancia) {
          oeste = {
            nome: local.nome || local.id,
            id: local.id,
            distancia,
          };
        }
      }
    }

    return { norte, sul, leste, oeste };
  }

  const visao = buscarLocaisPorDirecao();

  return (
    <div className="pagina-visao-container">
      <h1 className="titulo-visao">👁️ Visão do Jogador</h1>

      <div className="card-visao">
        <p>
          <strong>Jogador:</strong> {jogadorAtual?.nome || 'Desconhecido'}
        </p>

        <p>
          <strong>Local atual:</strong>{' '}
          {posicaoJogador?.localAtual || 'Não identificado'}
        </p>

        <p>
          <strong>Posição:</strong>{' '}
          {posicaoJogador?.pos
            ? `x: ${posicaoJogador.pos.x}, y: ${posicaoJogador.pos.y}`
            : 'Sem posição definida'}
        </p>

        <p>
          <strong>Modo de visão:</strong> {modoVisao}
        </p>

        <p>
          <strong>Local interno atual:</strong> {localInternoAtual || 'Nenhum'}
        </p>

        {modoVisao === 'interno' && lugarDetalhado ? (
          <>
            <hr />

            <h2>{lugarDetalhado.nome}</h2>

            {lugarDetalhado.imagem && (
              <img
                src={lugarDetalhado.imagem}
                alt={lugarDetalhado.nome}
                className="imagem-lugar-detalhado"
              />
            )}

            <p>{lugarDetalhado.descricaoCompleta}</p>
            <h3>Elementos visíveis</h3>
            <ul>
              {lugarDetalhado.elementosVisiveis?.map(elemento => (
                <li key={elemento}>{elemento}</li>
              ))}
            </ul>

            <h3>Pessoas presentes</h3>
            <ul>
              {lugarDetalhado.npcsPresentes?.map(npc => (
                <li key={npc.id}>
                  <strong>{npc.nome}</strong>: {npc.descricao}
                </li>
              ))}
            </ul>

            <h3>Sensações</h3>

            <p>
              <strong>Som:</strong> {lugarDetalhado.sensacoes?.som}
            </p>

            <p>
              <strong>Cheiro:</strong> {lugarDetalhado.sensacoes?.cheiro}
            </p>

            <p>
              <strong>Clima:</strong> {lugarDetalhado.sensacoes?.clima}
            </p>
          </>
        ) : (
          <>
            <hr />

            <p>
              <strong>Norte:</strong>{' '}
              {visao.norte ? visao.norte.nome : 'Nada visível ao norte'}
            </p>

            <p>
              <strong>Sul:</strong>{' '}
              {visao.sul ? visao.sul.nome : 'Nada visível ao sul'}
            </p>

            <p>
              <strong>Leste:</strong>{' '}
              {visao.leste ? visao.leste.nome : 'Nada visível a leste'}
            </p>

            <p>
              <strong>Oeste:</strong>{' '}
              {visao.oeste ? visao.oeste.nome : 'Nada visível a oeste'}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
