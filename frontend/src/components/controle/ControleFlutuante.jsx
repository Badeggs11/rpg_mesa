import { useState } from 'react';
import './ControleFlutuante.css';

export default function ControleFlutuante({ children }) {
  const [pos, setPos] = useState({ x: 40, y: 120 });

  function iniciarArrasto(e) {
    const startX = e.clientX;
    const startY = e.clientY;
    const { x, y } = pos;

    function mover(ev) {
      setPos({
        x: x + ev.clientX - startX,
        y: y + ev.clientY - startY,
      });
    }

    function parar() {
      window.removeEventListener('mousemove', mover);
      window.removeEventListener('mouseup', parar);
    }

    window.addEventListener('mousemove', mover);
    window.addEventListener('mouseup', parar);
  }

  return (
    <div className="controle-flutuante" style={{ left: pos.x, top: pos.y }}>
      <div className="barra-arrasto" onMouseDown={iniciarArrasto}>
        ⠿
      </div>
      {children}
    </div>
  );
}
