"use client";
import { useEffect, useRef } from "react";

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let x = 0, y = 0, cx = 0, cy = 0;
    let raf: number;

    const onMove = (e: MouseEvent) => { x = e.clientX; y = e.clientY; };
    window.addEventListener("mousemove", onMove);

    function animate() {
      cx += (x - cx) * 0.08;
      cy += (y - cy) * 0.08;
      el!.style.left = cx + "px";
      el!.style.top  = cy + "px";
      raf = requestAnimationFrame(animate);
    }
    animate();

    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div
      ref={ref}
      className="cursor-glow hidden md:block"
      style={{ position: "fixed", pointerEvents: "none", zIndex: 9999,
               width: 500, height: 500, borderRadius: "50%",
               background: "radial-gradient(circle, rgba(212,175,55,0.055) 0%, transparent 70%)",
               transform: "translate(-50%,-50%)", willChange: "left,top" }}
    />
  );
}
