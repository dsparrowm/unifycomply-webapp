const CARD_WIDTH = 152;
const CARD_HEIGHT = 134;
const CARD_RADIUS = 20;

const patternCards = [
  { x: -120, y: -60, opacity: 0.08 },
  { x: 40, y: -140, opacity: 0.05 },
  { x: 210, y: -20, opacity: 0.07 },
  { x: 380, y: -100, opacity: 0.04 },
  { x: 550, y: -40, opacity: 0.06 },
  { x: -40, y: 120, opacity: 0.07 },
  { x: 130, y: 70, opacity: 0.05 },
  { x: 300, y: 160, opacity: 0.08 },
  { x: 470, y: 40, opacity: 0.04 },
  { x: 640, y: 120, opacity: 0.06 },
  { x: 20, y: 300, opacity: 0.05 },
  { x: 190, y: 260, opacity: 0.07 },
  { x: 360, y: 330, opacity: 0.04 },
  { x: 530, y: 240, opacity: 0.06 },
  { x: 700, y: 310, opacity: 0.05 },
  { x: -90, y: 450, opacity: 0.07 },
  { x: 100, y: 410, opacity: 0.05 },
  { x: 270, y: 480, opacity: 0.08 },
  { x: 440, y: 400, opacity: 0.04 },
  { x: 610, y: 470, opacity: 0.06 },
  { x: 780, y: 430, opacity: 0.05 },
  { x: 50, y: 600, opacity: 0.06 },
  { x: 220, y: 570, opacity: 0.05 },
  { x: 390, y: 630, opacity: 0.07 },
  { x: 560, y: 550, opacity: 0.04 },
  { x: 730, y: 620, opacity: 0.05 },
];

export function AuthBrandPattern() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="auth-brand-grid"
          width="900"
          height="720"
          patternUnits="userSpaceOnUse"
          x="-160"
          y="-120"
        >
          {patternCards.map((card, index) => (
            <rect
              key={index}
              x={card.x}
              y={card.y}
              width={CARD_WIDTH}
              height={CARD_HEIGHT}
              rx={CARD_RADIUS}
              fill="none"
              stroke={`rgba(255, 255, 255, ${card.opacity})`}
              strokeWidth="1"
            />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#auth-brand-grid)" />
    </svg>
  );
}
