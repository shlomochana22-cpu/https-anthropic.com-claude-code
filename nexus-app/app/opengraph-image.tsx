import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "NEXUS — פורטל חיי הלילה";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          position: "relative",
        }}
      >
        {/* glow */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 500,
            height: 500,
            background: "radial-gradient(circle, rgba(191,245,32,0.25), transparent 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -120,
            left: -120,
            width: 500,
            height: 500,
            background: "radial-gradient(circle, rgba(0,238,252,0.18), transparent 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            fontSize: 150,
            fontWeight: 800,
            letterSpacing: -4,
            color: "#bff520",
            textShadow: "0 0 40px rgba(191,245,32,0.5)",
            display: "flex",
          }}
        >
          NEXUS
        </div>
        <div style={{ fontSize: 42, color: "#e5e2e1", marginTop: 12, display: "flex" }}>
          פורטל חיי הלילה · אירועים · כרטיסים
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#8d937a",
            marginTop: 40,
            display: "flex",
            letterSpacing: 2,
          }}
        >
          nexusevents.co.il
        </div>
      </div>
    ),
    { ...size }
  );
}
