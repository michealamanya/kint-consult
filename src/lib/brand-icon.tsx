import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Render the supplied gold symbol unchanged, cropping the surrounding whitespace
// and small wordmark so the real brand remains legible at browser-tab sizes.
export async function brandIcon(size: number) {
  const source = await readFile(
    join(process.cwd(), "public/images/kint-logo.jpg"),
  );
  const scale = size / 900;
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#f7f7f7",
      }}
    >
      <div
        style={{
          display: "flex",
          position: "absolute",
          left: 0,
          top: 0,
          width: size,
          height: size * 0.95,
          overflow: "hidden",
        }}
      >
        <img
          src={`data:image/jpeg;base64,${source.toString("base64")}`}
          alt=""
          width={1536 * scale}
          height={1024 * scale}
          style={{
            position: "absolute",
            left: -320 * scale,
            top: 25 * scale,
            width: 1536 * scale,
            height: 1024 * scale,
          }}
        />
      </div>
    </div>,
    { width: size, height: size },
  );
}
