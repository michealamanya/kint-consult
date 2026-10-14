import Image from "next/image";
import { sectorImages } from "@/data/sector-images";

export type VisualKind =
  | "petroleum"
  | "energy"
  | "minerals-mining"
  | "petrochemicals"
  | "erp"
  | "reporting"
  | "cloud"
  | "ai"
  | "software"
  | "security"
  | "systems"
  | "data"
  | "decisions"
  | "intelligence"
  | "intelligence-insight"
  | "erp-insight"
  | "digital-transformation"
  | "odoo";

const servicePaths = {
  erp: "M12 6v5m-6 5h12M6 16v-5m12 5v-5M9 3h6v4H9ZM3 16h6v5H3Zm12 0h6v5h-6Z",
  reporting: "M4 3v17h17M8 16v-5m5 5V7m5 9V4",
  cloud: "M7 14a4 4 0 0 1-1-8 6 6 0 0 1 11-1 4 4 0 1 1 1 9ZM12 14v6M7 20h10",
  ai: "M8 8h8v8H8ZM12 3v5m0 8v5M3 12h5m8 0h5M5 5l3 3m8 8 3 3M19 5l-3 3M8 16l-3 3",
  software: "M3 4h18v16H3ZM3 8h18m-11 3-3 3 3 3m4-6 3 3-3 3",
  security: "m12 2 8 3v7c0 5-5 8-8 10-3-2-8-5-8-10V5Zm-4 10 3 3 5-6",
};

const connectionImages = {
  systems: { src: "/images/systems.jpg", width: 612, height: 408 },
  data: { src: "/images/data.jpg", width: 612, height: 408 },
  decisions: { src: "/images/decision.jpg", width: 736, height: 736 },
};

const serviceImages = {
  erp: { src: "/images/ERP%20systems.png", width: 1536, height: 1024 },
  reporting: {
    src: "/images/campaign-monitor-dashboards.webp",
    width: 880,
    height: 495,
  },
  cloud: { src: "/images/cloud%20img.avif", width: 422, height: 470 },
  intelligence: {
    src: "/images/Data-intelligence.jpg",
    width: 1200,
    height: 675,
  },
  "intelligence-insight": {
    src: "/images/intelligence%20img.jpg",
    width: 1024,
    height: 682,
  },
  "erp-insight": {
    src: "/images/erp%20sys.jpg",
    width: 760,
    height: 424,
  },
  "digital-transformation": {
    src: "/images/digital%20transformation.png",
    width: 1536,
    height: 1024,
  },
  odoo: {
    src: "/images/odoo-erp-features-1.jpg",
    width: 1200,
    height: 700,
  },
} as const;

/** User-supplied photos and lightweight service icons; labels supply the meaning. */
export function BrandVisual({ kind }: { kind: VisualKind }) {
  const photo =
    serviceImages[kind as keyof typeof serviceImages] ??
    connectionImages[kind as keyof typeof connectionImages] ??
    sectorImages[kind as keyof typeof sectorImages];
  return (
    <div
      className={`brand-visual brand-visual-${kind}${photo ? " brand-photo" : ""}`}
      aria-hidden="true"
    >
      {photo ? (
        <Image
          src={photo.src}
          alt=""
          width={photo.width}
          height={photo.height}
          sizes="(max-width: 760px) 90vw, (max-width: 1100px) 45vw, 33vw"
        />
      ) : (
        <svg viewBox="0 0 24 24" fill="none" focusable="false">
          <path
            d={servicePaths[kind as keyof typeof servicePaths]}
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}

export function ConnectionVisual() {
  return (
    <div
      className="connection-visual"
      role="img"
      aria-label="Connected systems and organised data support clearer decisions"
    >
      <div className="connection-core" aria-hidden="true">
        KINT<span>Connect. Understand. Act.</span>
      </div>
      <div className="connection-nodes" aria-hidden="true">
        <div>
          <BrandVisual kind="systems" />
          <span>Systems</span>
        </div>
        <div>
          <BrandVisual kind="data" />
          <span>Data</span>
        </div>
        <div>
          <BrandVisual kind="decisions" />
          <span>Decisions</span>
        </div>
      </div>
    </div>
  );
}
