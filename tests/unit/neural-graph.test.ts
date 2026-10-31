import { describe, expect, it } from "vitest";
import { buildNeuralGraph, DENSITY } from "@/lib/neural-graph";

describe("buildNeuralGraph", () => {
  it("is deterministic for the same seed", () => {
    const a = buildNeuralGraph(DENSITY.high, 7);
    const b = buildNeuralGraph(DENSITY.high, 7);
    expect(Array.from(a.positions)).toEqual(Array.from(b.positions));
    expect(a.edges).toEqual(b.edges);
  });

  it("creates one node per layer slot", () => {
    const g = buildNeuralGraph(DENSITY.low);
    expect(g.positions.length / 3).toBe(DENSITY.low.reduce((s, n) => s + n, 0));
  });

  it("only connects each layer to the next one, so pulses always move forward", () => {
    const layers = DENSITY.low;
    const layerOf: number[] = [];
    layers.forEach((n, l) => {
      for (let i = 0; i < n; i++) layerOf.push(l);
    });
    const g = buildNeuralGraph(layers);
    for (const [from, to] of g.edges) expect(layerOf[to]).toBe(layerOf[from] + 1);
  });

  it("gives every non-final node at least one outgoing edge", () => {
    const layers = DENSITY.high;
    const g = buildNeuralGraph(layers);
    const lastLayerStart = layers.slice(0, -1).reduce((s, n) => s + n, 0);
    g.outgoing.slice(0, lastLayerStart).forEach((out) => expect(out.length).toBeGreaterThan(0));
    expect(g.entryEdges.length).toBeGreaterThan(0);
  });
});
