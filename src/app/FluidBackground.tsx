"use client";
import { useEffect, useRef } from "react";

// We'll use a CDN for the webgl-fluid library since it's not on npm
const FLUID_SCRIPT_URL = "https://cdn.jsdelivr.net/gh/PavelDoGreat/WebGL-Fluid-Simulation@gh-pages/script.js";

export default function FluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let script: HTMLScriptElement | null = null;
    let fluidSim: any = null;
    let cleanup: (() => void) | undefined;

    function loadScript(src: string) {
      return new Promise<void>((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = reject;
        document.body.appendChild(s);
        script = s;
      });
    }

    async function setupFluid() {
      await loadScript(FLUID_SCRIPT_URL);
      // @ts-ignore
      if (window.updateConfig) {
        // @ts-ignore
        window.updateConfig({
          SIM_RESOLUTION: 64,
          DYE_RESOLUTION: 128,
          DENSITY_DISSIPATION: 1.1,
          VELOCITY_DISSIPATION: 0.98,
          PRESSURE: 0.8,
          PRESSURE_ITERATIONS: 20,
          CURL: 30,
          SPLAT_RADIUS: 0.25,
          SHADING: true,
          COLORFUL: true,
          PAUSED: false,
          BACK_COLOR: { r: 255, g: 255, b: 255 },
          TRANSPARENT: true,
        });
      }
      // @ts-ignore
      if (window.initFluidSimulation) {
        // @ts-ignore
        fluidSim = window.initFluidSimulation(canvasRef.current);
      }
      // Clean up function
      cleanup = () => {
        if (script) document.body.removeChild(script);
        // @ts-ignore
        if (window.destroyFluidSimulation) window.destroyFluidSimulation();
      };
    }

    setupFluid();
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none"
      style={{ background: "transparent" }}
    />
  );
} 