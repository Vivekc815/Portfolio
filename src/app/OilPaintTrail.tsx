"use client";
import { useEffect, useRef } from "react";

export default function OilPaintTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const mouse = useRef({ x: 0, y: 0, isMoving: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
    }
    window.addEventListener("resize", resize);

    function onMouseMove(e: MouseEvent) {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      mouse.current.isMoving = true;
    }
    window.addEventListener("mousemove", onMouseMove);

    let hue = 0;
    let lastX = width / 2;
    let lastY = height / 2;

    function draw() {
      if (!ctx) return;
      ctx.globalAlpha = 0.10;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 1;

      if (mouse.current.isMoving) {
        hue = (hue + 0.2) % 360;
        lastX += (mouse.current.x - lastX) * 0.07;
        lastY += (mouse.current.y - lastY) * 0.07;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(mouse.current.x, mouse.current.y);
        ctx.strokeStyle = `hsl(${hue}, 90%, 80%)`;
        ctx.lineWidth = 80;
        ctx.shadowColor = `hsl(${(hue + 40) % 360}, 90%, 90%)`;
        ctx.shadowBlur = 48;
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.restore();

        mouse.current.isMoving = false;
      }

      animationRef.current = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
    />
  );
}
