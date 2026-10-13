import { ImageResponse } from "next/og";
export const alt =
  "KINT Consult — Industrial intelligence. Enterprise technology.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        background: "#29251f",
        color: "#f6f2e9",
        padding: "65px 75px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 52,
          fontWeight: 700,
          letterSpacing: "-3px",
        }}
      >
        KINT<span style={{ color: "#e5b84e" }}>.</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", fontSize: 68, letterSpacing: "-3px" }}>
          Industry. Technology. Intelligence.
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#ddd1b9" }}>
          Industrial intelligence. Digital transformation.
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 17,
          borderTop: "1px solid #a5833e",
          paddingTop: 25,
        }}
      >
        <span>KINT CONSULT LIMITED</span>
        <span>kintconsult.com</span>
      </div>
    </div>,
    size,
  );
}
