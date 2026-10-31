"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { buildNeuralGraph, DENSITY } from "@/lib/neural-graph";

export type Palette = {
  node: string;
  halo: string;
  edge: string;
  pulse: string;
  /** Additive glow looks right on dark backgrounds and washes out on light ones. */
  additive: boolean;
};

type Pulse = { edge: number; t: number; speed: number };

const dummy = new THREE.Object3D();
const from = new THREE.Vector3();
const to = new THREE.Vector3();

export function NeuralNet({
  density,
  palette,
}: {
  density: keyof typeof DENSITY;
  palette: Palette;
}) {
  const graph = useMemo(() => buildNeuralGraph(DENSITY[density]), [density]);
  const nodeCount = graph.positions.length / 3;
  const pulseCount = Math.min(12, Math.round(graph.edges.length / 8));

  const group = useRef<THREE.Group>(null);
  const nodes = useRef<THREE.InstancedMesh>(null);
  const halos = useRef<THREE.InstancedMesh>(null);
  const pulsesMesh = useRef<THREE.InstancedMesh>(null);
  const pulses = useRef<Pulse[]>([]);

  const edgeGeometry = useMemo(() => {
    const points = new Float32Array(graph.edges.length * 6);
    graph.edges.forEach(([a, b], i) => {
      points.set(graph.positions.subarray(a * 3, a * 3 + 3), i * 6);
      points.set(graph.positions.subarray(b * 3, b * 3 + 3), i * 6 + 3);
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(points, 3));
    return geometry;
  }, [graph]);

  useLayoutEffect(() => () => edgeGeometry.dispose(), [edgeGeometry]);

  // Place nodes once, and seed pulses at random points along entry edges.
  useLayoutEffect(() => {
    for (let i = 0; i < nodeCount; i++) {
      dummy.position.fromArray(graph.positions, i * 3);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      nodes.current?.setMatrixAt(i, dummy.matrix);
      halos.current?.setMatrixAt(i, dummy.matrix);
    }
    if (nodes.current) nodes.current.instanceMatrix.needsUpdate = true;
    if (halos.current) halos.current.instanceMatrix.needsUpdate = true;

    pulses.current = Array.from({ length: pulseCount }, (_, i) => ({
      edge: graph.entryEdges[(i * 7) % graph.entryEdges.length],
      t: Math.random(),
      speed: 0.45 + Math.random() * 0.35,
    }));
  }, [graph, nodeCount, pulseCount]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(delta, 0.05);
    const px = THREE.MathUtils.clamp(state.pointer.x, -1, 1);
    const py = THREE.MathUtils.clamp(state.pointer.y, -1, 1);

    // Slow spin, gentle tilt toward the cursor, and a soft float.
    g.rotation.y += dt * 0.08;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, py * 0.15, 0.05);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, -px * 0.1, 0.05);
    g.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.12;

    // Pulses travel forward through the layers like a signal, then restart at the input layer.
    const mesh = pulsesMesh.current;
    if (!mesh) return;
    pulses.current.forEach((p, i) => {
      p.t += dt * p.speed;
      if (p.t >= 1) {
        const end = graph.edges[p.edge][1];
        const next = graph.outgoing[end];
        p.edge =
          next.length > 0
            ? next[Math.floor(Math.random() * next.length)]
            : graph.entryEdges[Math.floor(Math.random() * graph.entryEdges.length)];
        p.t = 0;
      }
      const [a, b] = graph.edges[p.edge];
      from.fromArray(graph.positions, a * 3);
      to.fromArray(graph.positions, b * 3);
      dummy.position.lerpVectors(from, to, p.t);
      dummy.scale.setScalar(0.5 + Math.sin(Math.PI * p.t) * 0.8);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  const blending = palette.additive ? THREE.AdditiveBlending : THREE.NormalBlending;

  return (
    <group ref={group}>
      <lineSegments geometry={edgeGeometry}>
        <lineBasicMaterial color={palette.edge} transparent opacity={0.22} depthWrite={false} />
      </lineSegments>

      <instancedMesh ref={halos} args={[undefined, undefined, nodeCount]}>
        <sphereGeometry args={[0.17, 12, 12]} />
        <meshBasicMaterial
          color={palette.halo}
          transparent
          opacity={palette.additive ? 0.2 : 0.14}
          blending={blending}
          depthWrite={false}
        />
      </instancedMesh>

      <instancedMesh ref={nodes} args={[undefined, undefined, nodeCount]}>
        <sphereGeometry args={[0.065, 12, 12]} />
        <meshBasicMaterial color={palette.node} />
      </instancedMesh>

      <instancedMesh ref={pulsesMesh} args={[undefined, undefined, pulseCount]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshBasicMaterial
          color={palette.pulse}
          transparent
          blending={blending}
          depthWrite={false}
        />
      </instancedMesh>
    </group>
  );
}
