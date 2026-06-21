"use client";
import { useEffect, useRef, ReactNode } from "react";

interface Props { children: ReactNode; }

export function SmoothScroll({ children }: Props) {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    let lenis: any;

    async function init() {
      const { default: Lenis } = await import("lenis");
      lenis = new Lenis({
        duration:   1.4,
        easing:     (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.9,
      });
      lenisRef.current = lenis;

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    init();
    return () => { lenis?.destroy(); };
  }, []);

  return <>{children}</>;
}
