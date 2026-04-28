import { ImageResponse } from "next/og";

export const runtime = "edge";

type Params = { id: string };

export async function GET(req: Request, { params }: { params: Promise<Params> }) {
  const { id } = await params;
  const publicId = String(id).toUpperCase();
  const origin = new URL(req.url).origin;

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
          {/* Left photo panel */}
          <div style={{ width: "420px", height: "100%", position: "relative" }}>
            <img
              src={`${origin}/doctors/dr-riris.png`}
              width={420}
              height={630}
              style={{ objectFit: "cover", width: "420px", height: "630px" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0.52))",
              }}
            />
            <div style={{ position: "absolute", left: "28px", bottom: "28px" }}>
              <div
                style={{
                  fontSize: 18,
                  letterSpacing: "2.4px",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.82)",
                }}
              >
                Dermatologist-reviewed
              </div>
              <div style={{ marginTop: "10px", fontSize: 40, color: "#FFFFFF" }}>Seren skin report</div>
              <div style={{ marginTop: "10px", fontSize: 22, color: "rgba(255,255,255,0.82)" }}>
                Dr. Riris Asti Respati, SpDVE
              </div>
            </div>
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

