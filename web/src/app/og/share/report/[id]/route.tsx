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
          background: "linear-gradient(135deg, #FAF9F6 0%, #EEF1EE 100%)",
          color: "#2F3330",
          padding: "44px",
          gap: "28px",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial",
        }}
      >
        <div
          style={{
            width: "420px",
            borderRadius: "28px",
            padding: "36px",
            background:
              "radial-gradient(circle at 20% 20%, rgba(190,242,220,0.75), transparent 55%), radial-gradient(circle at 80% 25%, rgba(211,226,247,0.8), transparent 60%), radial-gradient(circle at 55% 85%, rgba(248,215,223,0.6), transparent 60%), linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))",
            border: "1px solid rgba(47,51,48,0.08)",
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
              border: "1px solid rgba(47,51,48,0.12)",
              background: "rgba(255,255,255,0.7)",
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
            background: "rgba(255,255,255,0.85)",
            border: "1px solid rgba(47,51,48,0.08)",
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
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
                  background: "rgba(61,99,116,0.10)",
                  border: "1px solid rgba(61,99,116,0.18)",
                  color: "rgb(61,99,116)",
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
                    background: "rgba(238,241,238,0.6)",
                    border: "1px solid rgba(47,51,48,0.08)",
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
                border: "1px solid rgba(47,51,48,0.12)",
                background: "rgba(255,255,255,0.7)",
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

