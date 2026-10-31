"use client";

import { Canvas } from "@react-three/fiber";
import { NeuralNet, type Palette } from "@/components/three/neural-net";

const palettes: Record<"dark" | "light", Palette> = {
  dark: { node: "#a5b4fc", halo: "#6366f1", edge: "#818cf8", pulse: "#67e8f9", additive: true },
  light: { node: "#4f46e5", halo: "#818cf8", edge: "#6366f1", pulse: "#0891b2", additive: false },
};

// Loaded with next/dynamic (ssr: false), so three.js never ships with the first paint.
export default function HeroCanvas({
  active,
  density,
  theme,
}: {
  active: boolean;
  density: "high" | "low";
  theme: "dark" | "light";
}) {
  return (
    <Canvas
      className="hero-canvas"
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 9.5], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      // Track the cursor across the whole page, not only over the canvas.
      eventSource={document.body}
      eventPrefix="client"
    >
      <NeuralNet density={density} palette={palettes[theme]} />
    </Canvas>
  );
}
