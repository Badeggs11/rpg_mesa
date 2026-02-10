import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function DadoD6Three({ valor, delay = 2000, revelar }) {
  const mountRef = useRef();

  useEffect(() => {
    if (!revelar || !mountRef.current) return;

    mountRef.current.innerHTML = '';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(120, 120);
    mountRef.current.appendChild(renderer.domElement);

    // 🎲 GEOMETRIA DO D6 (cubo)
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    function criarFace(numero) {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 256, 256);

      ctx.fillStyle = '#111111';
      ctx.font = 'bold 180px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(numero, 128, 150);

      return new THREE.CanvasTexture(canvas);
    }

    const materials = [
      new THREE.MeshStandardMaterial({ map: criarFace(3) }),
      new THREE.MeshStandardMaterial({ map: criarFace(4) }),
      new THREE.MeshStandardMaterial({ map: criarFace(1) }),
      new THREE.MeshStandardMaterial({ map: criarFace(6) }),
      new THREE.MeshStandardMaterial({ map: criarFace(2) }),
      new THREE.MeshStandardMaterial({ map: criarFace(5) }),
    ];

    const cube = new THREE.Mesh(geometry, materials);

    scene.add(cube);

    const light = new THREE.DirectionalLight(0xffffff, 1.8);
    light.position.set(3, 4, 5);
    scene.add(light);

    const rimLight = new THREE.DirectionalLight(0x88aaff, 0.6);
    rimLight.position.set(-3, -2, -5);
    scene.add(rimLight);

    const ambient = new THREE.AmbientLight(0x888888);
    scene.add(ambient);

    camera.position.z = 3;

    let frameId;
    const animate = () => {
      cube.rotation.x += 0.1;
      cube.rotation.y += 0.1;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    // 🧠 PARA NO RESULTADO
    setTimeout(() => {
      cancelAnimationFrame(frameId);

      // posições fixas simulando resultado
      const rotacoes = {
        1: [0, 0],
        2: [Math.PI / 2, 0],
        3: [0, Math.PI / 2],
        4: [0, -Math.PI / 2],
        5: [-Math.PI / 2, 0],
        6: [Math.PI, 0],
      };

      const r = rotacoes[valor] || [0, 0];
      cube.rotation.x = r[0];
      cube.rotation.y = r[1];

      renderer.render(scene, camera);
    }, delay);

    return () => {
      cancelAnimationFrame(frameId);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [valor, delay, revelar]);

  return <div ref={mountRef} className="dado-3d" />;
}
