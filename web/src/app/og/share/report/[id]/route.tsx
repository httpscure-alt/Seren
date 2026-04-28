import { ImageResponse } from "next/og";

export const runtime = "edge";

type Params = { id: string };

export async function GET(req: Request, { params }: { params: Promise<Params> }) {
  const { id } = await params;
  const publicId = String(id).toUpperCase();

  // Share-card OG image. Today: uses clinician photo; later: patient front photo (opt-in + token).
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          background: "#FAF9F6",
          color: "#2F3330",
          padding: "44px",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "28px",
            overflow: "hidden",
            background: "#FFFFFF",
            border: "1px solid rgba(47,51,48,0.10)",
            display: "flex",
          }}
        >
          {/* Left panel (image placeholder for OG stability) */}
          <div
            style={{
              width: "420px",
              height: "100%",
              padding: "44px",
              background:
                "radial-gradient(circle at 20% 20%, rgba(190,242,220,0.70), transparent 55%), radial-gradient(circle at 80% 25%, rgba(211,226,247,0.75), transparent 60%), radial-gradient(circle at 55% 85%, rgba(248,215,223,0.55), transparent 60%)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 18, letterSpacing: "2.4px", textTransform: "uppercase", opacity: 0.7 }}>
                Seren
              </div>
              <div style={{ marginTop: "16px", fontSize: 46, lineHeight: 1.05 }}>
                Dermatologist-
                <br />
                reviewed plan
              </div>
              <div style={{ marginTop: "16px", fontSize: 22, opacity: 0.7, lineHeight: 1.35 }}>
                Shareable card preview.
              </div>
            </div>
            <div style={{ fontSize: 20, opacity: 0.65 }}>No clinical photos</div>
          </div>

          {/* Right content panel */}
          <div
            style={{
              flex: 1,
              padding: "44px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
                <div>
                  <div style={{ fontSize: 18, letterSpacing: "2.6px", textTransform: "uppercase", opacity: 0.55 }}>
                    Report preview
                  </div>
                  <div style={{ marginTop: "14px", fontSize: 52, lineHeight: 1.05 }}>
                    Barrier-first routine
                  </div>
                  <div style={{ marginTop: "16px", fontSize: 24, opacity: 0.7, lineHeight: 1.35 }}>
                    Safe preview. No clinical photos included.
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
                    letterSpacing: "2.2px",
                    textTransform: "uppercase",
                    alignSelf: "flex-start",
                  }}
                >
                  Signed
                </div>
              </div>

              <div style={{ marginTop: "26px", display: "flex", gap: "16px" }}>
                {[
                  { k: "Clarity", v: "7.8" },
                  { k: "Barrier", v: "6.4" },
                  { k: "Inflamm.", v: "4.9" },
                ].map((m) => (
                  <div
                    key={m.k}
                    style={{
                      width: 176,
                      borderRadius: 22,
                      padding: "18px 18px",
                      background: "rgba(238,241,238,0.6)",
                      border: "1px solid rgba(47,51,48,0.08)",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: 16, letterSpacing: "2.4px", textTransform: "uppercase", opacity: 0.55 }}>
                      {m.k}
                    </div>
                    <div style={{ marginTop: "10px", fontSize: 44 }}>{m.v}</div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: "22px",
                  borderRadius: 22,
                  background: "#FFFFFF",
                  border: "1px solid rgba(47,51,48,0.08)",
                  padding: "18px 18px",
                }}
              >
                <div style={{ fontSize: 16, letterSpacing: "2.4px", textTransform: "uppercase", opacity: 0.55 }}>
                  Next 7 days
                </div>
                <div style={{ marginTop: "10px", fontSize: 24, opacity: 0.75, lineHeight: 1.35 }}>
                  Barrier-first routine, then introduce one active slowly.
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 20, opacity: 0.55 }}>{`Seren • ${publicId}`}</div>
              <div
                style={{
                  padding: "12px 18px",
                  borderRadius: 999,
                  border: "1px solid rgba(47,51,48,0.12)",
                  background: "rgba(255,255,255,0.7)",
                  fontSize: 18,
                  letterSpacing: "2.4px",
                  textTransform: "uppercase",
                  opacity: 0.8,
                }}
              >
                View report
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

