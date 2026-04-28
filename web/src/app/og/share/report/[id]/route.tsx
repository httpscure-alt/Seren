import { ImageResponse } from "next/og";

export const runtime = "edge";

type Params = { id: string };

export async function GET(req: Request, { params }: { params: Promise<Params> }) {
  const { id } = await params;
  const publicId = String(id).toUpperCase();
  const origin = new URL(req.url).origin;
  const photoUrl = `${origin}/doctors/dr-riris.png`;

  // OG thumbnail should match the share card (two-column, photo + metrics).
  // Keep everything Satori-safe: no absolute positioning, no gradients, no maps.
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FAF9F6",
          color: "#2F3330",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial",
        }}
      >
        <div
          style={{
            width: "1120px",
            height: "560px",
            display: "flex",
            backgroundColor: "#FFFFFF",
            borderRadius: "28px",
            overflow: "hidden",
          }}
        >
          <div style={{ width: "460px", height: "560px", display: "flex" }}>
            <img
              src={photoUrl}
              width={460}
              height={560}
              style={{ width: "460px", height: "560px", objectFit: "cover" }}
            />
          </div>

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
              <div style={{ fontSize: "18px", opacity: 0.6 }}>Report</div>
              <div style={{ marginTop: "8px", fontSize: "40px", lineHeight: 1.1 }}>
                Dermatologist-reviewed routine
              </div>

              <div style={{ marginTop: "26px", display: "flex", gap: "18px" }}>
                <div
                  style={{
                    width: "170px",
                    height: "120px",
                    borderRadius: "22px",
                    backgroundColor: "#FAF9F6",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ fontSize: "14px", opacity: 0.55, letterSpacing: "2px" }}>CLARITY</div>
                  <div style={{ marginTop: "10px", fontSize: "34px" }}>7.8</div>
                </div>
                <div
                  style={{
                    width: "170px",
                    height: "120px",
                    borderRadius: "22px",
                    backgroundColor: "#FAF9F6",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ fontSize: "14px", opacity: 0.55, letterSpacing: "2px" }}>BARRIER</div>
                  <div style={{ marginTop: "10px", fontSize: "34px" }}>6.4</div>
                </div>
                <div
                  style={{
                    width: "170px",
                    height: "120px",
                    borderRadius: "22px",
                    backgroundColor: "#FAF9F6",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ fontSize: "14px", opacity: 0.55, letterSpacing: "2px" }}>INFLAMM.</div>
                  <div style={{ marginTop: "10px", fontSize: "34px" }}>4.9</div>
                </div>
              </div>

              <div
                style={{
                  marginTop: "26px",
                  borderRadius: "26px",
                  backgroundColor: "#FAF9F6",
                  padding: "22px 24px",
                }}
              >
                <div style={{ fontSize: "14px", opacity: 0.55, letterSpacing: "2px" }}>NEXT 7 DAYS</div>
                <div style={{ marginTop: "12px", fontSize: "22px", opacity: 0.8, lineHeight: 1.35 }}>
                  Barrier-first routine, then introduce one active slowly.
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "18px", opacity: 0.55 }}>{`Seren • ${publicId}`}</div>
              <div
                style={{
                  padding: "14px 24px",
                  borderRadius: "999px",
                  backgroundColor: "#305767",
                  color: "#FFFFFF",
                  fontSize: "16px",
                  letterSpacing: "2px",
                }}
              >
                VIEW REPORT
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

