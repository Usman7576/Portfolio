import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

// The preview card shown when the site is shared on LinkedIn, WhatsApp, X, etc.
export const alt = `${site.name}, ${site.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const nodes = [
    [880, 170],
    [960, 260],
    [1040, 180],
    [900, 380],
    [1010, 360],
    [1100, 280],
    [960, 470],
    [1080, 450],
  ];
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "linear-gradient(135deg, #0b1020 0%, #121a35 60%, #1b1650 100%)",
        color: "#f1f5f9",
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      {nodes.map(([x, y], i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: 18,
            height: 18,
            borderRadius: 9,
            background: i % 3 === 0 ? "#67e8f9" : "#a5b4fc",
            boxShadow: "0 0 30px 10px rgba(99,102,241,0.45)",
          }}
        />
      ))}
      <div style={{ fontSize: 28, color: "#a5b4fc", letterSpacing: 2 }}>
        {site.title.toUpperCase()}
      </div>
      <div style={{ fontSize: 76, fontWeight: 700, marginTop: 16 }}>{site.name}</div>
      <div
        style={{ fontSize: 30, color: "#cbd5e1", marginTop: 24, maxWidth: 720, lineHeight: 1.35 }}
      >
        Live Urdu ↔ English speech translation for meetings, and an AI job-search assistant that
        never invents facts.
      </div>
    </div>,
    size,
  );
}
