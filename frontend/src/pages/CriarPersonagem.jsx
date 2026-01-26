import { useState } from 'react';
import { criarPersonagem } from '../api/personagens';
import './CriarPersonagem.css';

export default function CriarPersonagem() {
  const [form, setForm] = useState({
    nome: '',
    pontosDeVida: 100,
    stamina: 100,
    percepcao: 10,
    forca: 10,
    resistencia: 10,
    agilidade: 8,
    inteligencia: 6,
  });

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(false);

  function handleChange(e) {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === 'number' ? Number(value) : value,
    });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    console.log('Personagem', form);
    setErro(null);
    setSucesso(false);
    setLoading(true);

    try {
      await criarPersonagem(form);
      setSucesso(true);
      setForm({
        nome: '',
        pontosDeVida: 100,
        stamina: 100,
        percepcao: 10,
        forca: 10,
        resistencia: 10,
        agilidade: 8,
        inteligencia: 6,
      });
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="criar-personagem">
      <h1>Criar Personagem</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Nome
          <input
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Vida
          <input
            type="number"
            name="pontosDeVida"
            value={form.pontosDeVida}
            onChange={handleChange}
          />
        </label>
        <label>
          Stamina
          <input
            type="number"
            name="stamina"
            value={form.stamina}
            onChange={handleChange}
          />
        </label>

        <label>
          Percepção
          <input
            type="number"
            name="percepcao"
            value={form.percepcao}
            onChange={handleChange}
          />
        </label>

        <label>
          Forca
          <input
            type="number"
            name="forca"
            value={form.forca}
            onChange={handleChange}
          />
        </label>
        <label>
          Resistencia
          <input
            type="number"
            name="resistencia"
            value={form.resistencia}
            onChange={handleChange}
          />
        </label>
        <label>
          Agilidade
          <input
            type="number"
            name="agilidade"
            value={form.agilidade}
            onChange={handleChange}
          />
        </label>
        <label>
          Inteligencia
          <input
            type="number"
            name="inteligencia"
            value={form.inteligencia}
            onChange={handleChange}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Criando...' : 'Criar Personagem'}
        </button>
      </form>
      {erro && <p className="erro">❌ {erro}</p>}
      {sucesso && <p className="sucesso">✅ Personagem criado com sucesso!</p>}
    </div>
  );
}
