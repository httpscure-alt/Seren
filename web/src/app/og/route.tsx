import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #FAF9F6 0%, #EEF1EE 100%)",
          color: "#2F3330",
        }}
      >
        <div style={{ fontSize: 40, letterSpacing: -0.5 }}>Seren</div>
        <div style={{ marginTop: 18, fontSize: 72, letterSpacing: -2, lineHeight: 1.05 }}>
          Clinical skin analysis,
          <br />
          reviewed by dermatologists.
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

