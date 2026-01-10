import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* ======================
   CONFIG GLOBAL
====================== */
const SIZE = 120; // tamanho visual do canvas
const DADO_SCALE = 1.5; // escala do dado
const FACE_OFFSET = 0.06;

export default function DadoD20Three({ valor, delay = 4000 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    /* ======================
       CENA / CÂMERA / RENDER
    ====================== */
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setSize(SIZE, SIZE);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    mountRef.current.appendChild(renderer.domElement);

    /* ======================
       LUZ
    ====================== */
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(6, 10, 8);
    scene.add(mainLight);

    const highlightLight = new THREE.PointLight(0xffdddd, 0, 3);
    highlightLight.position.set(0, 0, 4);
    scene.add(highlightLight);

    /* ======================
       GRUPO DO DADO
    ====================== */
    const group = new THREE.Group();
    group.scale.set(DADO_SCALE, DADO_SCALE, DADO_SCALE);
    scene.add(group);

    /* ======================
       D20
    ====================== */
    const geometry = new THREE.IcosahedronGeometry(1).toNonIndexed();

    const material = new THREE.MeshStandardMaterial({
      color: 0xe8dcc3, // osso
      roughness: 0.55,
      metalness: 0.05,
      flatShading: true,
      side: THREE.FrontSide,
    });

    const d20 = new THREE.Mesh(geometry, material);
    group.add(d20);

    /* ======================
       ARESTAS
    ====================== */
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry),
      new THREE.LineBasicMaterial({ color: 0x6b5a3a })
    );
    group.add(edges);

    /* ======================
       FUNÇÃO: textura do número
    ====================== */
    function makeNumberTexture(n, destaque = false) {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      ctx.clearRect(0, 0, 256, 256);
      ctx.font = 'bold 150px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fillText(String(n), 128 + 4, 148 + 4);

      ctx.fillStyle = destaque ? '#9b111e' : '#5b1b1b';
      ctx.fillText(String(n), 128, 148);

      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      return tex;
    }

    /* ======================
       CRIAR NÚMEROS (20 FACES)
    ====================== */
    const pos = geometry.attributes.position;
    const faces = [];
    const planes = [];

    for (let i = 0; i < pos.count; i += 3) {
      const a = new THREE.Vector3().fromBufferAttribute(pos, i);
      const b = new THREE.Vector3().fromBufferAttribute(pos, i + 1);
      const c = new THREE.Vector3().fromBufferAttribute(pos, i + 2);

      const center = new THREE.Vector3().add(a).add(b).add(c).divideScalar(3);
      const normal = new THREE.Vector3()
        .subVectors(b, a)
        .cross(new THREE.Vector3().subVectors(c, a))
        .normalize();

      const faceNumber = faces.length + 1;

      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(0.62, 0.62),
        new THREE.MeshBasicMaterial({
          map: makeNumberTexture(faceNumber),
          transparent: true,
          depthTest: true,
          depthWrite: false,
          side: THREE.FrontSide,
          polygonOffset: true,
          polygonOffsetFactor: -2,
          polygonOffsetUnits: -2,
        })
      );

      plane.position.copy(
        center.clone().add(normal.clone().multiplyScalar(FACE_OFFSET))
      );
      plane.lookAt(center.clone().add(normal));

      group.add(plane);

      faces.push({ normal, plane, number: faceNumber });
      planes.push(plane);
    }

    /* ======================
       ANIMAÇÃO
    ====================== */
    let rolling = true;
    let frameId;

    const animate = () => {
      if (rolling) {
        group.rotation.x += 0.06;
        group.rotation.y += 0.08;
      }
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    /* ======================
       PARAR ROLAGEM
    ====================== */
    const stopTimeout = setTimeout(() => {
      rolling = false;

      const targetFace = faces.find(f => f.number === valor);
      if (!targetFace) return;

      const cameraDir = new THREE.Vector3(0, 0, 1);

      const quat = new THREE.Quaternion().setFromUnitVectors(
        targetFace.normal.clone().normalize(),
        cameraDir
      );

      group.quaternion.copy(quat);

      for (const f of faces) {
        f.plane.material.map.dispose();
        f.plane.material.map = makeNumberTexture(f.number, f.number === valor);
        f.plane.material.needsUpdate = true;
      }

      highlightLight.intensity = 1.4;
    }, delay);

    /* ======================
       CLEANUP
    ====================== */
    return () => {
      clearTimeout(stopTimeout);
      cancelAnimationFrame(frameId);

      planes.forEach(p => {
        p.material.map?.dispose();
        p.material.dispose();
        p.geometry.dispose();
      });

      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [valor, delay]);

  return (
    <div
      ref={mountRef}
      style={{
        width: SIZE,
        height: SIZE,
        display: 'inline-block',
        verticalAlign: 'middle',
      }}
    />
  );
}
