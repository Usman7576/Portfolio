// Pure geometry for the hero "neural network": layered nodes and forward edges.
// Deterministic (seeded), so every visitor sees the same shape.

export type NeuralGraph = {
  /** xyz per node */
  positions: Float32Array;
  /** [from, to] node indices; edges only go from one layer to the next */
  edges: [number, number][];
  /** edge indices leaving each node */
  outgoing: number[][];
  /** edges that start in the first layer, where new pulses spawn */
  entryEdges: number[];
};

export const DENSITY = {
  high: [10, 18, 24, 18, 10],
  low: [5, 9, 12, 9, 5],
} as const;

const LAYER_SPACING = 1.5;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildNeuralGraph(layers: readonly number[], seed = 7): NeuralGraph {
  const rand = mulberry32(seed);
  const total = layers.reduce((a, b) => a + b, 0);
  const positions = new Float32Array(total * 3);
  const layerStart: number[] = [];

  let index = 0;
  layers.forEach((count, l) => {
    layerStart.push(index);
    const x = (l - (layers.length - 1) / 2) * LAYER_SPACING;
    const radius = 0.45 * Math.sqrt(count);
    for (let i = 0; i < count; i++) {
      // Sunflower spread across a disc, with jitter so it doesn't look machine-made.
      const r = radius * Math.sqrt((i + 0.5) / count);
      const a = i * GOLDEN_ANGLE + rand() * 0.6;
      positions[index * 3] = x + (rand() - 0.5) * 0.35;
      positions[index * 3 + 1] = r * Math.cos(a);
      positions[index * 3 + 2] = r * Math.sin(a);
      index++;
    }
  });

  const edges: [number, number][] = [];
  const outgoing: number[][] = Array.from({ length: total }, () => []);
  const entryEdges: number[] = [];

  for (let l = 0; l < layers.length - 1; l++) {
    const nextStart = layerStart[l + 1];
    const nextCount = layers[l + 1];
    for (let a = layerStart[l]; a < layerStart[l] + layers[l]; a++) {
      // Two nearest neighbours in the next layer plus one random long link.
      const byDistance = Array.from({ length: nextCount }, (_, j) => nextStart + j).sort(
        (p, q) => yzDistance(positions, a, p) - yzDistance(positions, a, q),
      );
      const targets = new Set([
        byDistance[0],
        byDistance[1],
        nextStart + Math.floor(rand() * nextCount),
      ]);
      for (const b of targets) {
        if (b === undefined) continue;
        outgoing[a].push(edges.length);
        if (l === 0) entryEdges.push(edges.length);
        edges.push([a, b]);
      }
    }
  }

  return { positions, edges, outgoing, entryEdges };
}

function yzDistance(p: Float32Array, a: number, b: number) {
  const dy = p[a * 3 + 1] - p[b * 3 + 1];
  const dz = p[a * 3 + 2] - p[b * 3 + 2];
  return dy * dy + dz * dz;
}
