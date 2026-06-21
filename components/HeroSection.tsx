"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import gsap from "gsap";

const HeroCanvas = dynamic(() => import("./HeroCanvas").then(m => ({ default: m.HeroCanvas })), { ssr: false });

const stats = [
  { num: "5+",   label: "Anos de Experiência" },
  { num: "3K+",  label: "Clientes Atendidos"  },
  { num: "3",    label: "Barbeiros Experts"   },
  { num: "★4.9", label: "Avaliação Média"     },
];

export function HeroSection() {
  const titleRef  = useRef<HTMLHeadingElement>(null);
  const lineRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP text reveal
    if (titleRef.current) {
      gsap.fromTo(titleRef.current.children,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power4.out", delay: 0.4 }
      );
    }
    // Line expand
    if (lineRef.current) {
      gsap.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "power3.out", delay: 1.0 });
    }
  }, []);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg">
      {/* Cyber grid */}
      <div className="absolute inset-0 cyber-grid opacity-60" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-[at_center] from-transparent to-bg/90 pointer-events-none" />

      {/* 3D Canvas — background */}
      <div className="absolute inset-0 z-0">
        <HeroCanvas />
      </div>

      {/* Scan line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.25)] to-transparent animate-scan" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-24 pb-16">
        {/* Logo box */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16,1,0.3,1] }}
          className="inline-block mb-10"
        >
          <div className="glass neon-border glow-gold px-10 py-6 relative">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#d4af37]" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#d4af37]" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#d4af37]" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#d4af37]" />

            <div className="h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mb-3" />
            <div className="text-gold-gradient font-display font-black tracking-[0.2em] leading-none"
              style={{ fontSize: "clamp(2.8rem, 7vw, 5rem)" }}>
              COSTA
            </div>
            <div className="text-gold-gradient text-[0.52rem] tracking-[0.48em] uppercase mt-2 font-light">
              BARBERSHOP
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mt-3" />
          </div>
        </motion.div>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex items-center justify-center gap-3 mb-5"
        >
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#d4af37]" />
          <span className="text-[#d4af37] text-[0.6rem] font-bold tracking-[0.4em] uppercase text-glow">
            Paracuru · Ceará · Brasil
          </span>
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#d4af37]" />
        </motion.div>

        {/* Title */}
        <div ref={titleRef} className="overflow-hidden mb-4">
          <h1 className="text-white font-bold leading-[1.05]"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4.2rem)" }}>
            <span className="block">Estilo &amp;</span>
            <span className="block text-gold-shine">Precisão</span>
            <span className="block">em Cada Corte</span>
          </h1>
        </div>

        {/* Rule */}
        <div ref={lineRef} className="origin-center mx-auto mb-5"
          style={{ width: 60, height: 2, background: "linear-gradient(90deg, transparent, #d4af37, transparent)" }} />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-[#666] text-[0.95rem] leading-relaxed mb-10 max-w-xl mx-auto"
        >
          Referência em cortes masculinos e barba em Paracuru.<br />
          Barbeiros experts, ambiente premium, resultado impecável.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="flex gap-4 justify-center flex-wrap mb-16"
        >
          <button onClick={() => scrollTo("#booking")} className="btn-gold px-8 py-3.5 text-[0.76rem]">
            ✂ Agendar Agora
          </button>
          <button onClick={() => scrollTo("#services")} className="btn-outline px-7 py-3.5 text-[0.76rem]">
            Ver Serviços →
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 border border-[rgba(212,175,55,0.1)] max-w-2xl mx-auto"
        >
          {stats.map((s, i) => (
            <div key={i} className={`py-5 px-4 text-center ${i < 3 ? "border-r border-[rgba(212,175,55,0.1)]" : ""}`}>
              <div className="text-gold-shine text-xl font-black leading-none mb-1">{s.num}</div>
              <div className="text-[0.55rem] text-[#555] uppercase tracking-[0.18em]">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <div className="w-px h-10 bg-gradient-to-b from-[#d4af37] to-transparent" />
        <span className="text-[0.52rem] text-[#555] tracking-[0.28em] uppercase">scroll</span>
      </motion.div>
    </section>
  );
}
