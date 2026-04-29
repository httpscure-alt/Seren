import { ImageResponse } from "next/og";

export const runtime = "edge";

/** Same static asset as `share/report/[id]/generateMetadata` (privacy-safe aura card). */
const SHARE_CARD_FILENAME = "share-thumb-concept-a.jpg";

type Params = { id: string };

export async function GET(req: Request, { params }: { params: Promise<Params> }) {
  await params;
  const origin = new URL(req.url).origin;
  const cardUrl = `${origin}/og/${SHARE_CARD_FILENAME}`;

  try {
    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
          }}
        >
          <img
            src={cardUrl}
            width={1200}
            height={630}
            style={{ width: "1200px", height: "630px", objectFit: "cover" }}
          />
        </div>
      ),
      { width: 1200, height: 630 },
    );
  } catch (e) {
    console.error("[og] share aura card failed", e);
    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#2F3330",
            color: "#FAF9F6",
            fontSize: "42px",
            fontFamily: "system-ui, -apple-system, Segoe UI, Roboto",
          }}
        >
          Seren skin plan — Seren.id
        </div>
      ),
      { width: 1200, height: 630 },
    );
  }
}
