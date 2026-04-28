import { ImageResponse } from "next/og";

export const runtime = "edge";

type Params = { id: string };

export async function GET(_: Request, { params }: { params: Promise<Params> }) {
  const { id } = await params;
  const publicId = String(id).toUpperCase();

  // Privacy-safe OG image: no patient name, no diagnosis, no photos.
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          background: "#FFFFFF",
          color: "#2F3330",
          padding: "64px",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <div style={{ fontSize: 28, opacity: 0.7 }}>Seren</div>
          <div style={{ marginTop: 18, fontSize: 72, lineHeight: 1.05 }}>
            Shareable skin report card
          </div>
          <div style={{ marginTop: 16, fontSize: 28, opacity: 0.7, lineHeight: 1.3 }}>
            Safe preview. No photos. No diagnosis.
          </div>

          <div style={{ marginTop: 36, fontSize: 34, opacity: 0.8 }}>
            {`Report ID: ${publicId}`}
          </div>

          <div style={{ marginTop: 36, display: "flex", gap: "18px" }}>
            {["Clarity 7.8", "Barrier 6.4", "Inflamm. 4.9"].map((t) => (
              <div
                key={t}
                style={{
                  padding: "18px 22px",
                  borderRadius: "16px",
                  border: "1px solid #E6E6E3",
                  background: "#F6F5F1",
                  fontSize: 24,
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

