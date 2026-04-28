import { ImageResponse } from "next/og";

export const runtime = "edge";

type Params = { id: string };

export async function GET(req: Request, { params }: { params: Promise<Params> }) {
  const { id } = await params;
  const publicId = String(id).toUpperCase();
  const origin = new URL(req.url).origin;

  function toBase64(bytes: ArrayBuffer) {
    const u8 = new Uint8Array(bytes);
    let s = "";
    // Chunk to avoid call stack / arg limits
    for (let i = 0; i < u8.length; i += 0x8000) {
      s += String.fromCharCode(...u8.subarray(i, i + 0x8000));
    }
    // btoa is available in Edge runtime
    return btoa(s);
  }

  let photoDataUrl: string | null = null;
  try {
    // NOTE: embedding large base64 images can cause OG rendering to blank.
    // Keep the URL; Satori will fetch it.
    photoDataUrl = `${origin}/doctors/dr-riris.png`;
  } catch {
    // ignore; we'll render without photo if fetch fails
  }

  // Share-card OG image.
  // Keep styles conservative: Satori is strict and may blank the image on unsupported CSS.
  try {
    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            backgroundColor: "#FAF9F6",
            color: "#2F3330",
            padding: "40px",
            fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial",
          }}
        >
          <div
            style={{
              width: "1120px",
              height: "550px",
              display: "flex",
              backgroundColor: "#FFFFFF",
              borderRadius: "28px",
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: "#E6E6E3",
              overflow: "hidden",
            }}
          >
            <div style={{ width: "420px", height: "550px" }}>
              {photoDataUrl ? (
                <img
                  src={photoDataUrl}
                  width={420}
                  height={550}
                  style={{ width: "420px", height: "550px", objectFit: "cover" }}
                />
              ) : (
                <div style={{ width: "420px", height: "550px", backgroundColor: "#305767" }} />
              )}
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
                <div style={{ fontSize: "18px", opacity: 0.55 }}>Seren • Report preview</div>
                <div style={{ marginTop: "14px", fontSize: "52px", lineHeight: 1.05 }}>
                  Barrier-first routine
                </div>
                <div style={{ marginTop: "14px", fontSize: "24px", opacity: 0.7, lineHeight: 1.35 }}>
                  Safe preview. No clinical photos included.
                </div>

                <div style={{ marginTop: "22px", display: "flex", gap: "14px" }}>
                  {[
                    ["Clarity", "7.8"],
                    ["Barrier", "6.4"],
                    ["Inflamm.", "4.9"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      style={{
                        width: "176px",
                        padding: "16px",
                        borderRadius: "18px",
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderColor: "#E6E6E3",
                        backgroundColor: "#F6F5F1",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: "14px", opacity: 0.55 }}>{label}</div>
                      <div style={{ marginTop: "10px", fontSize: "40px" }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: "20px", opacity: 0.55 }}>{`Seren • ${publicId}`}</div>
                <div
                  style={{
                    padding: "12px 18px",
                    borderRadius: "999px",
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: "#E6E6E3",
                    backgroundColor: "#F6F5F1",
                    fontSize: "18px",
                    opacity: 0.85,
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
  } catch (e: any) {
    return new Response(
      `OG render failed: ${e?.message ?? String(e)}\n\n${e?.stack ?? ""}`,
      { status: 500, headers: { "content-type": "text/plain; charset=utf-8" } },
    );
  }
}

