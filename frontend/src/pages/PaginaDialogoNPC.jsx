import React, { useEffect, useState } from 'react';
import './PaginaDialogoNPC.css';
import { executarAcaoCampanha } from '../api/campanha';

export default function PaginaDialogoNPC() {
  const [dados, setDados] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [falaJogador, setFalaJogador] = useState('');

  useEffect(() => {
    const dadosSalvos = sessionStorage.getItem('dadosDialogoNPC');

    if (!dadosSalvos) return;

    const dadosParseados = JSON.parse(dadosSalvos);
    setDados(dadosParseados);

    setMensagens([
      {
        autor: dadosParseados.npcNome || 'NPC',
        texto: dadosParseados.falaInicial || 'Você começa a conversa.',
      },
    ]);
  }, []);

  async function enviarMensagem() {
    if (!falaJogador.trim()) return;
    if (!dados) return;

    const textoDigitado = falaJogador;

    setMensagens(prev => [
      ...prev,
      {
        autor: dados?.jogadorNome || 'Jogador',
        texto: textoDigitado,
      },
    ]);

    setFalaJogador('');

    try {
      const data = await executarAcaoCampanha({
        campaignId: dados.estadoCampanha.id,
        jogadorId: dados.jogadorId,
        tipoAcao: 'conversar',
        npcId: dados.npcId,
        falaJogador: textoDigitado,
      });

      const ultimoLog = data.estadoCampanha?.logMundo?.slice(-1)[0];

      setMensagens(prev => [
        ...prev,
        {
          autor: dados?.npcNome || 'NPC',
          texto: ultimoLog?.descricao || 'O NPC permanece em silêncio.',
        },
      ]);

      const novosDados = {
        ...dados,
        estadoCampanha: data.estadoCampanha,
      };

      setDados(novosDados);

      sessionStorage.setItem('dadosDialogoNPC', JSON.stringify(novosDados));
      sessionStorage.setItem(
        'estadoCampanha',
        JSON.stringify(data.estadoCampanha)
      );
    } catch (e) {
      console.error(e);

      setMensagens(prev => [
        ...prev,
        {
          autor: 'Sistema',
          texto: e.message || 'Erro ao enviar fala.',
        },
      ]);
    }
  }

  if (!dados) {
    return (
      <div className="pagina-dialogo">
        <div className="dialogo-card">
          <h1>🗣️ Diálogo</h1>
          <p>Nenhum dado de conversa encontrado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pagina-dialogo">
      <div className="dialogo-card">
        <h1>🗣️ Conversa com {dados.npcNome}</h1>

        <div className="dialogo-info">
          <p>
            <strong>Jogador:</strong> {dados.jogadorNome}
          </p>
          <p>
            <strong>NPC:</strong> {dados.npcNome}
          </p>
        </div>

        <div className="janela-chat">
          {mensagens.map((msg, index) => (
            <div
              key={index}
              className={
                msg.autor === dados.jogadorNome
                  ? 'mensagem jogador'
                  : 'mensagem npc'
              }
            >
              <strong>{msg.autor}</strong>
              <p>{msg.texto}</p>
            </div>
          ))}
        </div>

        <div className="area-digitacao">
          <input
            type="text"
            value={falaJogador}
            onChange={e => setFalaJogador(e.target.value)}
            placeholder="Digite sua fala..."
            onKeyDown={e => {
              if (e.key === 'Enter') enviarMensagem();
            }}
          />

          <button onClick={enviarMensagem}>Enviar</button>
        </div>
      </div>
    </div>
  );
}
