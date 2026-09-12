import type { AmlCaseDetail } from "@/types/aml";

type AmlCaseRiskRadarProps = {
  points: AmlCaseDetail["radar"];
};

const SIZE = 320;
const CX = 160;
const CY = 168;
const MAX_R = 108;

function vertex(index: number, count: number, scale: number) {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / count;
  return {
    x: CX + MAX_R * scale * Math.cos(angle),
    y: CY + MAX_R * scale * Math.sin(angle),
  };
}

function polygon(count: number, scale: number) {
  return Array.from({ length: count }, (_, index) => {
    const point = vertex(index, count, scale);
    return `${point.x},${point.y}`;
  }).join(" ");
}

export function AmlCaseRiskRadar({ points }: AmlCaseRiskRadarProps) {
  const count = points.length;
  const dataPoints = points.map((point, index) =>
    vertex(index, count, Math.min(point.value, 100) / 100),
  );
  const dataPolygon = dataPoints.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto h-80 w-full max-w-md" role="img">
      <title>AML risk radar</title>
      {[0.2, 0.4, 0.6, 0.8, 1].map((scale) => (
        <polygon
          key={scale}
          points={polygon(count, scale)}
          className="fill-none stroke-[color:var(--border-default)]"
          strokeWidth="1"
        />
      ))}
      {points.map((_, index) => {
        const end = vertex(index, count, 1);
        return (
          <line
            key={`axis-${index}`}
            x1={CX}
            y1={CY}
            x2={end.x}
            y2={end.y}
            className="stroke-[color:var(--border-default)]"
            strokeWidth="1"
          />
        );
      })}
      {[0, 200, 400, 600, 800, 1000].map((label) => (
        <text
          key={label}
          x={CX + 6}
          y={CY - (label / 1000) * MAX_R + 4}
          className="fill-[color:var(--text-light)] text-[10px]"
        >
          {label.toLocaleString()}
        </text>
      ))}
      <polygon
        points={dataPolygon}
        className="fill-[color:var(--accent-primary)]/25 stroke-[color:var(--accent-primary)]"
        strokeWidth="1.5"
      />
      {dataPoints.map((point, index) => (
        <circle
          key={`dot-${points[index].label}`}
          cx={point.x}
          cy={point.y}
          r="3"
          className="fill-[color:var(--accent-primary)]"
        />
      ))}
      {points.map((point, index) => {
        const labelPoint = vertex(index, count, 1.22);
        return (
          <text
            key={point.label}
            x={labelPoint.x}
            y={labelPoint.y}
            textAnchor="middle"
            className="fill-[color:var(--text-muted)] text-[11px]"
          >
            {point.label}
          </text>
        );
      })}
    </svg>
  );
}
