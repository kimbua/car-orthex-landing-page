'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Interactive 3D cutaway of the BMW S58 — the M TwinPower Turbo straight-six
 * used in M2 / M3 / M4. Geometry follows the real engine architecture:
 *   2,993 cc · bore 84 mm × stroke 90 mm (undersquare) · closed-deck aluminium block
 *   DOHC 4 valves/cyl · Double VANOS · direct injection
 *   TWO mono-scroll turbochargers (3 cylinders each) · air-to-liquid intercooler
 *   integrated into the intake plenum · forged steel crank/rods · forged pistons
 * Animated: 120° crankshaft firing order 1-5-3-6-2-4, pistons, rods, turbos.
 */

const CYLINDERS = 6;
const SPACING = 0.16; // ≈ 1.1 × bore
const TOTAL_LEN = (CYLINDERS - 1) * SPACING; // 0.80
const CRANK_R = 0.045; // stroke/2 ≈ 90 mm
const BLOCK_Y = 0.07; // crank centre height
const CYL_H = 0.2;
const HEAD_Y = BLOCK_Y + CYL_H; // 0.27
const PISTON_R = 0.084; // bore 84 mm
const PISTON_H = 0.05;
const PISTON_CENTER = HEAD_Y - PISTON_H / 2 - 0.014;

// Inline-6 firing order 1-5-3-6-2-4 (120° crank throws: 0,240,120,120,240,0)
const PHASES = [0, (4 * Math.PI) / 3, (2 * Math.PI) / 3, (2 * Math.PI) / 3, (4 * Math.PI) / 3, 0];

// ---------- materials (real S58 look: dark cast alu, polished steel, carbon) ----------
const MAT = {
  block: { color: '#333a42', metalness: 0.55, roughness: 0.5 },
  head: { color: '#2a3038', metalness: 0.5, roughness: 0.52 },
  carbon: { color: '#171b20', metalness: 0.35, roughness: 0.42 },
  steel: { color: '#9aa4ad', metalness: 0.82, roughness: 0.32 },
  polish: { color: '#d9dee3', metalness: 0.9, roughness: 0.22 },
  alu: { color: '#c3cbd2', metalness: 0.78, roughness: 0.3 },
  cast: { color: '#565f67', metalness: 0.6, roughness: 0.55 },
  piston: { color: '#c8cfd6', metalness: 0.7, roughness: 0.35 },
  blue: { color: '#1c69d4', metalness: 0.4, roughness: 0.45 },
};

function Piston({ x, phase }: { x: number; phase: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const a = state.clock.elapsedTime * 5.4;
    const offset = CRANK_R * (1 - Math.cos(a + phase));
    if (ref.current) ref.current.position.y = PISTON_CENTER - offset;
  });
  return (
    <mesh ref={ref} position={[x, PISTON_CENTER, 0]}>
      <cylinderGeometry args={[PISTON_R, PISTON_R, PISTON_H, 28]} />
      <meshStandardMaterial {...MAT.piston} />
    </mesh>
  );
}

function Rod({ x, phase }: { x: number; phase: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const a = state.clock.elapsedTime * 5.4;
    const pinY = CRANK_R * Math.sin(a + phase);
    const pistonY = PISTON_CENTER - CRANK_R * (1 - Math.cos(a + phase));
    const len = pistonY - pinY;
    if (ref.current) {
      ref.current.position.set(x, pinY + len / 2, 0);
      ref.current.scale.y = len / 0.24;
    }
  });
  return (
    <mesh ref={ref} position={[x, 0, 0]}>
      <boxGeometry args={[0.026, 0.24, 0.022]} />
      <meshStandardMaterial {...MAT.steel} />
    </mesh>
  );
}

function CrankWebs({ x, phase }: { x: number; phase: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    const a = state.clock.elapsedTime * 5.4;
    if (ref.current) {
      ref.current.position.y = CRANK_R * Math.sin(a + phase);
      ref.current.rotation.z = a + phase;
    }
  });
  return (
    <group ref={ref} position={[x, 0, 0]}>
      <mesh position={[0, 0.032, -0.026]}>
        <boxGeometry args={[0.04, 0.07, 0.015]} />
        <meshStandardMaterial {...MAT.steel} />
      </mesh>
      <mesh position={[0, 0.032, 0.026]}>
        <boxGeometry args={[0.04, 0.07, 0.015]} />
        <meshStandardMaterial {...MAT.steel} />
      </mesh>
      <mesh position={[0, 0.064, 0]}>
        <cylinderGeometry args={[0.014, 0.014, 0.084, 12]} />
        <meshStandardMaterial {...MAT.polish} />
      </mesh>
    </group>
  );
}

function Turbo({ x, dir, speed = 1 }: { x: number; dir: 1 | -1; speed?: number }) {
  const wheel = useRef<THREE.Group>(null);
  useFrame((state) => {
    const a = state.clock.elapsedTime * 5.4 * speed;
    if (wheel.current) wheel.current.rotation.y = a * 6;
  });
  return (
    <group position={[x, BLOCK_Y + 0.1, dir * 0.155]} rotation={[0, 0, 0]}>
      {/* turbine housing (cast) */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.075, 0.03, 18, 36]} />
        <meshStandardMaterial {...MAT.cast} />
      </mesh>
      <mesh position={[0, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.055, 0.09, 22]} />
        <meshStandardMaterial {...MAT.cast} />
      </mesh>
      {/* compressor housing (polished alu) */}
      <mesh position={[0, 0.0, dir * 0.045]} rotation={[0, 0, Math.PI / 2]}>
        <sphereGeometry args={[0.052, 20, 16]} />
        <meshStandardMaterial {...MAT.alu} />
      </mesh>
      {/* spinning compressor wheel (visible through opening) */}
      <group ref={wheel} position={[0, 0, dir * 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <coneGeometry args={[0.03, 0.03, 12]} />
          <meshStandardMaterial {...MAT.polish} />
        </mesh>
      </group>
    </group>
  );
}

function ExhaustManifold({ xs }: { xs: number[] }) {
  // 3-1 manifolds: cylinders 1-3 -> front turbo, 4-6 -> rear turbo
  const banks = [xs.slice(0, 3), xs.slice(3)];
  return (
    <group>
      {banks.map((bank, bi) => {
        const center = (bank[0] + bank[2]) / 2;
        return (
          <group key={bi}>
            {bank.map((x, i) => (
              <mesh key={i} position={[x, BLOCK_Y + CYL_H * 0.5, 0.17]}>
                <cylinderGeometry args={[0.016, 0.016, 0.12, 10]} />
                <meshStandardMaterial {...MAT.steel} />
              </mesh>
            ))}
            {/* collector pipe toward turbo */}
            <mesh position={[center, BLOCK_Y + 0.12, 0.175]}>
              <boxGeometry args={[0.36, 0.045, 0.05]} />
              <meshStandardMaterial {...MAT.cast} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function EngineBlock() {
  const xs = useMemo(
    () => Array.from({ length: CYLINDERS }, (_, i) => -TOTAL_LEN / 2 + i * SPACING),
    [],
  );
  const half = TOTAL_LEN / 2;

  return (
    <group>
      {/* crankcase — closed-deck aluminium */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[TOTAL_LEN + 0.14, 0.09, 0.24]} />
        <meshStandardMaterial {...MAT.block} />
      </mesh>
      {/* oil pan */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[TOTAL_LEN + 0.08, 0.06, 0.19]} />
        <meshStandardMaterial color="#191d22" metalness={0.35} roughness={0.6} />
      </mesh>
      {/* cylinders */}
      {xs.map((x, i) => (
        <mesh key={`cyl-${i}`} position={[x, BLOCK_Y + CYL_H / 2, 0]}>
          <cylinderGeometry args={[0.088, 0.088, CYL_H, 28]} />
          <meshStandardMaterial {...MAT.block} />
        </mesh>
      ))}
      {/* pistons + rods + crank webs */}
      {xs.map((x, i) => (
        <group key={`mech-${i}`}>
          <Piston x={x} phase={PHASES[i]} />
          <Rod x={x} phase={PHASES[i]} />
          <CrankWebs x={x} phase={PHASES[i]} />
        </group>
      ))}
      {/* main crankshaft */}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.019, 0.019, TOTAL_LEN + 0.2, 16]} />
        <meshStandardMaterial {...MAT.polish} />
      </mesh>
      {/* cylinder head */}
      <mesh position={[0, HEAD_Y + 0.045, 0]}>
        <boxGeometry args={[TOTAL_LEN + 0.14, 0.09, 0.28]} />
        <meshStandardMaterial {...MAT.head} />
      </mesh>
      {/* DOHC camshafts */}
      {[0.08, -0.08].map((z, zi) => (
        <mesh key={`cam-${zi}`} rotation={[0, 0, Math.PI / 2]} position={[0, HEAD_Y + 0.05, z]}>
          <cylinderGeometry args={[0.022, 0.022, TOTAL_LEN + 0.1, 14]} />
          <meshStandardMaterial {...(zi === 0 ? MAT.polish : MAT.steel)} />
        </mesh>
      ))}
      {/* VANOS phasers at front of camshafts */}
      {[0.08, -0.08].map((z, zi) => (
        <mesh key={`vanos-${zi}`} position={[half + 0.055, HEAD_Y + 0.05, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.035, 20]} />
          <meshStandardMaterial {...MAT.steel} />
        </mesh>
      ))}
      {/* timing chain cover (front) */}
      <mesh position={[half + 0.035, BLOCK_Y + CYL_H / 2, 0]}>
        <boxGeometry args={[0.035, CYL_H + 0.1, 0.24]} />
        <meshStandardMaterial {...MAT.head} />
      </mesh>
      {/* valve cover */}
      <mesh position={[0, HEAD_Y + 0.095, 0]}>
        <boxGeometry args={[TOTAL_LEN + 0.1, 0.032, 0.2]} />
        <meshStandardMaterial {...MAT.head} />
      </mesh>
      {/* carbon intake cover with M tricolor (G80 S58 style) */}
      <mesh position={[0, HEAD_Y + 0.118, 0]}>
        <boxGeometry args={[TOTAL_LEN + 0.06, 0.022, 0.17]} />
        <meshStandardMaterial {...MAT.carbon} />
      </mesh>
      {[
        { x: -0.14, c: '#0066b1' },
        { x: -0.04, c: '#003e7e' },
        { x: 0.06, c: '#e01f26' },
      ].map((s, i) => (
        <mesh key={`m-${i}`} position={[s.x, HEAD_Y + 0.132, 0]}>
          <boxGeometry args={[0.095, 0.005, 0.16]} />
          <meshStandardMaterial color={s.c} metalness={0.15} roughness={0.5} />
        </mesh>
      ))}
      {/* direct-injection fuel rail (intake side) */}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0, HEAD_Y - 0.01, 0.15]}>
        <cylinderGeometry args={[0.014, 0.014, TOTAL_LEN + 0.06, 12]} />
        <meshStandardMaterial {...MAT.steel} />
      </mesh>
      {/* intake plenum with integrated air-to-liquid intercooler */}
      <mesh position={[0, HEAD_Y + 0.085, -0.17]}>
        <boxGeometry args={[TOTAL_LEN + 0.08, 0.11, 0.14]} />
        <meshStandardMaterial {...MAT.carbon} />
      </mesh>
      <mesh position={[0, HEAD_Y + 0.085, -0.12]}>
        <boxGeometry args={[TOTAL_LEN + 0.08, 0.07, 0.04]} />
        <meshStandardMaterial {...MAT.alu} />
      </mesh>
      {/* charge pipes turbo -> plenum */}
      {[half - 0.12, -half + 0.12].map((x, i) => (
        <mesh key={`cp-${i}`} position={[x, BLOCK_Y + 0.14, -0.1]}>
          <cylinderGeometry args={[0.026, 0.026, 0.28, 14]} />
          <meshStandardMaterial color="#3a4148" metalness={0.4} roughness={0.6} />
        </mesh>
      ))}
      {/* exhaust manifolds + TWO mono-scroll turbos */}
      <ExhaustManifold xs={xs} />
      <Turbo x={half - 0.22} dir={1} />
      <Turbo x={-half + 0.22} dir={1} />
    </group>
  );
}

export default function Engine3D({
  engineLabel,
  power,
  torque,
}: {
  engineLabel: string;
  power: string | null;
  torque: string | null;
}) {
  return (
    <div className="engine3d">
      <div className="engine3d__panel">
        <div className="engine3d__title">S58 · M TwinPower Turbo</div>
        <div className="engine3d__spec">{engineLabel}</div>
        {power && <div className="engine3d__spec">Công suất: {power}</div>}
        {torque && <div className="engine3d__spec">Mô-men xoắn: {torque}</div>}
        <div className="engine3d__spec">2 turbo mono-scroll · 9,3:1 · 7.200 rpm</div>
        <div className="engine3d__hint">Kéo để xoay · Cuộn để zoom · Mô phỏng theo kiến trúc S58 thật</div>
      </div>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [1.15, 0.5, 1.35], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[2.2, 3.2, 2.2]} intensity={1.5} />
        <directionalLight position={[-2, 1.2, -1.6]} intensity={0.5} color="#9cc0f0" />
        <spotLight position={[0, 2.6, 0]} intensity={0.7} angle={0.65} penumbra={1} />
        <EngineBlock />
        <ContactShadows position={[0, -0.14, 0]} opacity={0.5} scale={3.2} blur={2.6} far={0.5} color="#000000" />
        <OrbitControls
          enablePan={false}
          minDistance={0.75}
          maxDistance={2.7}
          minPolarAngle={0.15}
          maxPolarAngle={Math.PI / 2 + 0.2}
          autoRotate
          autoRotateSpeed={0.7}
        />
      </Canvas>
    </div>
  );
}
