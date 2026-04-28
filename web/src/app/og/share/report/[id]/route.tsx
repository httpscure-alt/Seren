import { ImageResponse } from "next/og";

export const runtime = "edge";

type Params = { id: string };

export async function GET(req: Request, { params }: { params: Promise<Params> }) {
  const { id } = await params;
  const publicId = String(id).toUpperCase();

  // Share-card OG image. Keep it extremely compatible to avoid blank thumbnails.
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#FAF9F6",
          color: "#2F3330",
          padding: "72px",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial",
        }}
      >
        <div style={{ fontSize: "22px", opacity: 0.7 }}>Seren</div>
        <div style={{ marginTop: "16px", fontSize: "64px", lineHeight: 1.05 }}>
          Share report card
        </div>
        <div style={{ marginTop: "12px", fontSize: "26px", opacity: 0.7 }}>
          {`SRN: ${publicId}`}
        </div>
        <div style={{ marginTop: "28px", fontSize: "22px", opacity: 0.65 }}>
          Safe preview • no photos • no diagnosis
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

