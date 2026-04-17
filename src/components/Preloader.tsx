"use client";

export default function Preloader({ overlay = false }: { overlay?: boolean }) {
  return (
    <div
      className="preloader-wrapper"
      style={overlay ? { position: "fixed", inset: 0, background: "rgba(255,255,255,0.92)" } : undefined}
    >
      <div className="preloader"></div>
    </div>
  );
}

