import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/*  Props                                                             */
/* ------------------------------------------------------------------ */

interface ThreadSceneProps {
  scrollProgress?: number;
}

/* ------------------------------------------------------------------ */
/*  Thread mesh                                                       */
/* ------------------------------------------------------------------ */

function SilkThread({ scrollProgress = 0 }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Build a gentle CatmullRom curve for the ribbon
  const geometry = useMemo(() => {
    const points = [
      new THREE.Vector3(-1.5, 0.3, 0),
      new THREE.Vector3(-0.7, -0.4, 0.3),
      new THREE.Vector3(0.0, 0.2, -0.2),
      new THREE.Vector3(0.8, -0.3, 0.4),
      new THREE.Vector3(1.5, 0.1, 0),
    ];
    const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);
    return new THREE.TubeGeometry(curve, 64, 0.03, 8, false);
  }, []);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#C9B18A'),
        metalness: 0.3,
        roughness: 0.6,
        side: THREE.DoubleSide,
      }),
    [],
  );

  // Animate: gentle float + scroll-driven tilt
  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const t = clock.getElapsedTime();

    // Sine-wave float on Y
    mesh.position.y = Math.sin(t * 0.6) * 0.1;

    // Slow rotation
    mesh.rotation.y = t * 0.15;

    // Scroll-driven tilt on X
    mesh.rotation.x = THREE.MathUtils.lerp(
      mesh.rotation.x,
      scrollProgress * 0.3 - 0.15,
      0.05,
    );
  });

  return <mesh ref={meshRef} geometry={geometry} material={material} />;
}

/* ------------------------------------------------------------------ */
/*  Exported scene (consumed via React.lazy in FloatingThread.tsx)     */
/* ------------------------------------------------------------------ */

export function ThreadScene({ scrollProgress = 0 }: ThreadSceneProps) {
  return (
    <div
      className="pointer-events-none absolute"
      style={{ width: 200, height: 200 }}
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 3], fov: 35 }}
        style={{ background: 'transparent' }}
        shadows={false}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 5]} intensity={0.8} />
        <SilkThread scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
