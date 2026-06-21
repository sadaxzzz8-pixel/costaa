"use client";
import { motion } from "framer-motion";

const items = [
  "Corte Masculino", "Barba Modelada", "Pigmentação",
  "Relaxamento", "Sobrancelha", "Costa Barbershop",
  "Paracuru · CE", "Desde 2019",
];

export function MarqueeBar() {
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden py-3"
      style={{ background: "linear-gradient(90deg, #b8962e, #d4af37, #e8c84a, #d4af37, #b8962e)" }}>
      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-30"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.1'/%3E%3C/svg%3E\")" }} />

      <div className="marquee-track flex gap-0 whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-6 px-8 text-[0.58rem] font-black tracking-[0.3em] uppercase text-[#080808]">
            {item}
            <span className="inline-block w-1 h-1 rounded-full bg-[#080808] opacity-50" />
          </span>
        ))}
      </div>
    </div>
  );
}
