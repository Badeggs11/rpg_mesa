import { useEffect, useState } from 'react';
import './DadoD20SVG.css';

export default function DadoD20SVG({ valor, delay = 3000 }) {
  const [rolando, setRolando] = useState(true);

  useEffect(() => {
    setRolando(true);
    const t = setTimeout(() => setRolando(false), delay);
    return () => clearTimeout(t);
  }, [valor, delay]);

  return (
    <div className={`d20-svg ${rolando ? 'rolando' : ''}`}>
      <svg viewBox="0 0 100 100">
        <polygon points="50,5 95,35 80,90 20,90 5,35" className="face" />
        {!rolando && (
          <text x="50" y="60" textAnchor="middle" className="numero">
            {valor}
          </text>
        )}
      </svg>
    </div>
  );
}
