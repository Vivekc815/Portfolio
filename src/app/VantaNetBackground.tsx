"use client";
import { useEffect, useRef, useState } from "react";

const THREE_SCRIPT_URL = "https://cdn.jsdelivr.net/npm/three@0.124.0/build/three.min.js";
const VANTA_SCRIPT_URL = "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js";

export default function VantaNetBackground() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);
  const [vantaError, setVantaError] = useState(false);

  useEffect(() => {
    let threeScript: HTMLScriptElement | null = null;
    let vantaScript: HTMLScriptElement | null = null;
    function loadScript(src: string) {
      return new Promise<void>((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = (e) => reject(e);
        document.body.appendChild(s);
        return s;
      });
    }
    async function setupVanta() {
      try {
        threeScript = (await loadScript(THREE_SCRIPT_URL) as unknown) as HTMLScriptElement;
        vantaScript = (await loadScript(VANTA_SCRIPT_URL) as unknown) as HTMLScriptElement;
        // @ts-ignore
        if (window.VANTA && window.VANTA.NET && vantaRef.current) {
          // @ts-ignore
          vantaEffect.current = window.VANTA.NET({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.0,
            scaleMobile: 1.0,
            color: 0x10b981,
            backgroundColor: 0xffffff,
            points: 12.0,
            maxDistance: 22.0,
            spacing: 18.0,
          });
        } else {
          setVantaError(true);
          console.error("Vanta NET effect not available after script load");
        }
      } catch (e) {
        setVantaError(true);
        console.error("Vanta or Three.js script failed to load", e);
      }
    }
    setupVanta();
    return () => {
      if (vantaEffect.current) vantaEffect.current.destroy();
      if (threeScript) document.body.removeChild(threeScript);
      if (vantaScript) document.body.removeChild(vantaScript);
    };
  }, []);

  return (
    <>
      <div
        ref={vantaRef}
        className="fixed inset-0 w-full h-full -z-10"
        style={{ background: "#fff" }}
      />
      {vantaError && (
        <div className="fixed top-0 left-0 w-full text-center z-50 text-red-600 font-bold bg-white/80">
          Vanta background failed to load. Please check your internet connection or try refreshing.
        </div>
      )}
    </>
  );
} 