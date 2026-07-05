export function AuthDotPattern() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-50"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(16, 25, 40, 0.08) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
      aria-hidden="true"
    />
  );
}
