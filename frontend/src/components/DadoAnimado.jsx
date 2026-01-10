import { useEffect, useState } from 'react';
import './DadoAnimado.css';

export default function DadoAnimado({ valor, delay = 3000, lados = 20 }) {
  const [mostrandoFinal, setMostrandoFinal] = useState(false);
  const [faceAtual, setFaceAtual] = useState(null);

  useEffect(() => {
    setMostrandoFinal(false);

    // troca rápida de faces (ilusão de rolagem)
    const interval = setInterval(() => {
      const fake = Math.floor(Math.random() * lados) + 1;
      setFaceAtual(fake);
    }, 80);

    // após o delay, para no valor real
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setFaceAtual(valor);
      setMostrandoFinal(true);
    }, delay);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [valor, delay, lados]);

  return (
    <span className={`dado ${!mostrandoFinal ? 'dado-rolando' : ''}`}>
      {faceAtual ?? '—'}
    </span>
  );
}
