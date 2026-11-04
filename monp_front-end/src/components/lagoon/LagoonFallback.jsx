/* Static cross-section of the lagoon: shown at once, kept when the 3D cannot run. */

const HOUSES = [
  {
    x: 640,
    w: 170,
    top: 380,
    bottom: 470,
    peak: 312,
    stilts: [655, 700, 750, 795],
    depth: 868,
    windows: [668, 752],
  },
  {
    x: 862,
    w: 206,
    top: 350,
    bottom: 460,
    peak: 272,
    stilts: [878, 935, 1000, 1055],
    depth: 880,
    windows: [890, 1012],
  },
  {
    x: 1122,
    w: 148,
    top: 404,
    bottom: 480,
    peak: 346,
    stilts: [1138, 1182, 1226, 1262],
    depth: 850,
    windows: [1146, 1222],
  },
  {
    x: 1300,
    w: 104,
    top: 442,
    bottom: 496,
    peak: 404,
    stilts: [1316, 1352, 1388],
    depth: 820,
    windows: [1340],
  },
];

// Kept between y 660 and 780 so neither the crop nor the caption hides them
const TAG_SPOTS = [
  { x: 725, y: 690 },
  { x: 965, y: 735 },
  { x: 1196, y: 700 },
  { x: 1352, y: 665 },
  { x: 1060, y: 780 },
];

export default function LagoonFallback({ tags, className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMaxYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="lg-deep" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className="lg-stop-deep-top" />
          <stop offset="1" className="lg-stop-deep-bottom" />
        </linearGradient>
      </defs>

      <path
        className="lg-shore"
        d="M0 520 C200 505 380 512 560 508 C760 503 980 512 1180 506 C1300 503 1380 510 1440 508 L1440 530 L0 530 Z"
      />
      <rect className="lg-water" x="0" y="526" width="1440" height="74" />
      <rect x="0" y="600" width="1440" height="300" fill="url(#lg-deep)" />
      <path
        className="lg-waterline"
        d="M0 600 C120 594 240 606 360 600 C480 594 600 606 720 600 C840 594 960 606 1080 600 C1200 594 1320 606 1440 600"
      />

      <g className="lg-deck">
        <path d="M150 566 L370 566 L344 584 L176 584 Z" />
        <rect x="236" y="534" width="14" height="32" />
        <circle cx="243" cy="526" r="9" />
      </g>
      <line className="lg-pole" x1="300" y1="566" x2="330" y2="470" />

      {HOUSES.map((h) => (
        <g key={h.x}>
          {h.stilts.map((sx) => (
            <g key={sx}>
              <line className="lg-stilt" x1={sx} y1={h.bottom} x2={sx} y2="600" />
              <line className="lg-stilt lg-stilt--wet" x1={sx} y1="600" x2={sx} y2={h.depth} />
            </g>
          ))}
          <rect className="lg-deck" x={h.x - 10} y={h.bottom - 8} width={h.w + 20} height="10" />
          <rect className="lg-wood" x={h.x} y={h.top} width={h.w} height={h.bottom - h.top - 6} />
          <polygon
            className="lg-roof"
            points={`${h.x - 20},${h.top + 4} ${h.x + h.w / 2},${h.peak} ${h.x + h.w + 20},${h.top + 4}`}
          />
          {h.windows.map((wx) => (
            <rect key={wx} className="lg-window" x={wx} y={h.top + 24} width="26" height="30" />
          ))}
        </g>
      ))}

      {tags.slice(0, TAG_SPOTS.length).map((tag, i) => {
        const { x, y } = TAG_SPOTS[i];
        const width = 24 + tag.length * 8.6;
        return (
          <g key={tag} className="lg-tag">
            <rect x={x - width / 2} y={y - 16} width={width} height="32" rx="16" />
            <text x={x} y={y + 5} textAnchor="middle">
              {tag}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
