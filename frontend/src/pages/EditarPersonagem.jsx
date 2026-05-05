import { useEffect, useState } from 'react';
import { listarPersonagens, atualizarPersonagem } from '../api/personagens';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function EditarPersonagem() {
  const [personagens, setPersonagens] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [form, setForm] = useState({
    id: null,
    nome: '',
    pontosDeVida: 0,

    stamina: 0,
    percepcao: 0,
    percepcaoVisual: 0,
    forca: 0,
    resistencia: 0,
    agilidade: 0,
    inteligencia: 0,
  });

  const [salvando, setSalvando] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const lista = await listarPersonagens();
    setPersonagens(lista);
  }

  function selecionar(p) {
    setSelecionado(p);

    setForm({
      id: p.id, // 👈 ESTA LINHA É A CHAVE
      nome: p.nome ?? '',
      pontosDeVida: p.pontosDeVida ?? 0,

      stamina: p.stamina ?? 0,
      percepcao: p.percepcao ?? 0,
      percepcaoVisual: p.percepcaoVisual ?? 0,
      forca: p.forca ?? 0,
      resistencia: p.resistencia ?? 0,
      agilidade: p.agilidade ?? 0,
      inteligencia: p.inteligencia ?? 0,
    });
  }

  function alterar(campo, valor) {
    setForm(prev => ({ ...prev, [campo]: valor }));
  }

  async function salvar() {
    try {
      setSalvando(true);

      console.log('📤 Enviando personagem para atualizar:', form);

      const resposta = await atualizarPersonagem(form.id, form);

      console.log('✅ Resposta da atualização:', resposta);

      setSelecionado(null);
      await carregar();
    } catch (erro) {
      console.error('❌ Erro ao salvar personagem:', erro);
      alert(erro.message || 'Erro ao salvar personagem');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="editor-personagem">
      <h1>✏️ Editar Personagem</h1>

      <div className="lista">
        {personagens.map(p => (
          <button key={p.id} onClick={() => selecionar(p)}>
            {p.nome}
          </button>
        ))}
      </div>

      {selecionado && (
        <div className="formulario">
          <h2>Editar personagem</h2>

          <label>
            🏷 Nome
            <input
              type="text"
              value={form.nome}
              onChange={e => alterar('nome', e.target.value)}
            />
          </label>

          {[
            ['pontosDeVida', '❤️ Vida'],

            ['stamina', '⚡ Stamina'],
            ['percepcao', '👁 Percepção'],
            ['percepcaoVisual', '🙈👀 Percepçāo Visual'],
            ['forca', '💪 Força'],
            ['agilidade', '⚡ Agilidade'],
            ['resistencia', '🛡 Resistência'],
            ['inteligencia', '🧠 Inteligência'],
          ].map(([campo, label]) => (
            <label key={campo}>
              {label}
              <input
                type="number"
                min={0}
                max={999}
                value={form[campo]}
                onChange={e => {
                  const valor = e.target.value;
                  alterar(campo, valor === '' ? 0 : Number(valor));
                }}
              />
            </label>
          ))}

          <button onClick={salvar} disabled={salvando}>
            💾 Salvar Alterações
          </button>
        </div>
      )}
    </div>
  );
}
