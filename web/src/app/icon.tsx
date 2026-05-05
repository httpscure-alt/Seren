import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  // Deterministic favicon for browsers that ignore metadata icons or cache aggressively.
  // Styled to match Seren app icon: teal circle + white "S".
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "9999px",
          background: "#2F5E6D",
        }}
      >
        <div
          style={{
            color: "#FFFFFF",
            fontSize: 22,
            fontWeight: 800,
            fontFamily:
              'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif',
            lineHeight: 1,
            transform: "translateY(-0.5px)",
          }}
        >
          S
        </div>
      </div>
    ),
    size,
  );
}

