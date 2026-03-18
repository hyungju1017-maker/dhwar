"use client";

import { useEffect, useRef } from "react";

export function BrushLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = 500 * dpr;
      canvas.height = 120 * dpr;
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, 500, 120);
      ctx.fillStyle = "white";
      ctx.textBaseline = "middle";
      ctx.font = "110px 'East Sea Dokdo', cursive";
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillText("大學大戰", 10, 65);
    };

    // Wait for font to load
    if (document.fonts) {
      document.fonts.ready.then(draw);
    } else {
      setTimeout(draw, 500);
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 500, height: 120 }}
      className="block"
    />
  );
}
