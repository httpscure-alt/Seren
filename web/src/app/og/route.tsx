import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  // Keep OG extremely compatible for link previews.
  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FAF9F6",
        color: "#2F3330",
        fontSize: "72px",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial",
      }}
    >
      Seren
    </div>,
    { width: 1200, height: 630 },
  );
}

