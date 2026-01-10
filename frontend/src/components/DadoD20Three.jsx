import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function DadoD20Three({ valor, delay = 4000 }) {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const [mostrarNumero, setMostrarNumero] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    setMostrarNumero(false);

    // Cena
    const scene = new THREE.Scene();

    // Câmera
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.z = 4;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setSize(80, 80);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Luz
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(5, 5, 5);
    scene.add(light);

    // D20
    const geometry = new THREE.IcosahedronGeometry(1);
    const material = new THREE.MeshStandardMaterial({
      color: 0xf0f0f0,
      roughness: 0.35,
      metalness: 0.15,
    });

    const d20 = new THREE.Mesh(geometry, material);
    scene.add(d20);

    let rolling = true;
    let frameId;

    const animate = () => {
      if (rolling) {
        d20.rotation.x += 0.06;
        d20.rotation.y += 0.08;
      }
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    const stopTimeout = setTimeout(() => {
      rolling = false;
      d20.rotation.x = (valor * 37 * Math.PI) / 180;
      d20.rotation.y = (valor * 61 * Math.PI) / 180;
      setMostrarNumero(true);
    }, delay);

    return () => {
      clearTimeout(stopTimeout);
      cancelAnimationFrame(frameId);

      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (rendererRef.current.domElement?.parentNode) {
          rendererRef.current.domElement.parentNode.removeChild(
            rendererRef.current.domElement
          );
        }
      }

      rendererRef.current = null;
    };
  }, [valor, delay]);

  return (
    <div
      style={{
        position: 'relative',
        width: 80,
        height: 80,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        verticalAlign: 'middle',
      }}
    >
      <div ref={mountRef} />

      {mostrarNumero && (
        <span
          style={{
            position: 'absolute',
            fontSize: 22,
            fontWeight: 700,
            color: '#111',
            textShadow: '0 1px 2px rgba(0,0,0,0.4)',
            pointerEvents: 'none',
          }}
        >
          {valor}
        </span>
      )}
    </div>
  );
}
