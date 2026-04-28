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
          background: "#F6F5F1",
          color: "#2F3330",
          padding: "44px",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial",
        }}
      >
        <div
          style={{
            width: "420px",
            borderRadius: "28px",
            padding: "36px",
            background: "#FFFFFF",
            border: "1px solid #E6E6E3",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: 18, letterSpacing: 2.8, textTransform: "uppercase", opacity: 0.7 }}>
              Seren
            </div>
            <div style={{ marginTop: 18, fontSize: 56, lineHeight: 1.05, letterSpacing: -1.5 }}>
              My skin plan.
              <br />
              Built to follow.
            </div>
            <div style={{ marginTop: 18, fontSize: 24, opacity: 0.7, lineHeight: 1.35 }}>
              Dermatologist-reviewed routine preview.
            </div>
          </div>
          <div
            style={{
              display: "inline-flex",
              alignSelf: "flex-start",
              padding: "10px 16px",
              borderRadius: "999px",
              border: "1px solid #E6E6E3",
              background: "#F6F5F1",
              fontSize: 18,
              letterSpacing: 2.4,
              textTransform: "uppercase",
              opacity: 0.8,
            }}
          >
            Next 7 days
          </div>
        </div>

        <div
          style={{
            flex: 1,
            borderRadius: "28px",
            background: "#FFFFFF",
            border: "1px solid #E6E6E3",
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            marginLeft: "28px",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
              <div>
                <div style={{ fontSize: 18, letterSpacing: 2.8, textTransform: "uppercase", opacity: 0.55 }}>
                  Skin report preview
                </div>
                <div style={{ marginTop: 16, fontSize: 48, letterSpacing: -1.2, lineHeight: 1.05 }}>
                  Barrier-first routine
                </div>
                <div style={{ marginTop: 16, fontSize: 24, opacity: 0.7, lineHeight: 1.35 }}>
                  No photos. No diagnosis. Just a shareable card.
                </div>
              </div>
              <div
                style={{
                  height: 36,
                  padding: "8px 14px",
                  borderRadius: 999,
                  background: "#EFF5F7",
                  border: "1px solid #CFE0E6",
                  color: "#305767",
                  fontSize: 16,
                  letterSpacing: 2.2,
                  textTransform: "uppercase",
                  alignSelf: "flex-start",
                }}
              >
                Reviewed
              </div>
            </div>

            <div style={{ marginTop: 26, display: "flex", gap: "16px" }}>
              {[
                { k: "Clarity", v: "7.8" },
                { k: "Barrier", v: "6.4" },
                { k: "Inflamm.", v: "4.9" },
              ].map((m) => (
                <div
                  key={m.k}
                  style={{
                    width: 170,
                    borderRadius: 22,
                    padding: "18px 18px",
                    background: "#F6F5F1",
                    border: "1px solid #E6E6E3",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 16, letterSpacing: 2.4, textTransform: "uppercase", opacity: 0.55 }}>
                    {m.k}
                  </div>
                  <div style={{ marginTop: 10, fontSize: 40, letterSpacing: -1.2 }}>
                    {m.v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 20, opacity: 0.55 }}>Seren • {publicId}</div>
            <div
              style={{
                padding: "12px 18px",
                borderRadius: 999,
                border: "1px solid #E6E6E3",
                background: "#F6F5F1",
                fontSize: 18,
                letterSpacing: 2.4,
                textTransform: "uppercase",
                opacity: 0.8,
              }}
            >
              View report
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

