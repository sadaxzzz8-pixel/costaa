"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const testis = [
  { av:"M", name:"Marcos Vieira", city:"Paracuru, CE", since:"Cliente há 2 anos",
    text:"Melhor barbearia de Paracuru! O Costa tem uma habilidade incrível. Saí com o corte perfeito e a barba impecável." },
  { av:"P", name:"Pedro Alves",   city:"Paracuru, CE", since:"Cliente há 1 ano",
    text:"O Rafael é sensacional! Fez minha barba exatamente como eu queria. Ambiente top, atendimento de primeira classe." },
  { av:"L", name:"Lucas Sousa",   city:"Paracuru, CE", since:"Cliente há 6 meses",
    text:"Fiz a pigmentação com o Diego e ficou incrível! Natural, bem feito e profissional do início ao fim. Vale cada centavo!" },
];

export function TestimonialsSection() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <section className="py-28 px-6 bg-bg2 relative">
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div ref={ref} className="mb-16 text-center">
          <motion.div initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}}
            className="inline-flex items-center gap-3 mb-3">
            <div className="h-px w-6 bg-[#d4af37]" />
            <span className="text-[#d4af37] text-[0.58rem] font-bold tracking-[0.34em] uppercase">Avaliações</span>
            <div className="h-px w-6 bg-[#d4af37]" />
          </motion.div>
          <motion.h2 initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.1}}
            className="text-3xl md:text-5xl font-black">
            O que nossos <span className="text-gold-shine">clientes</span> dizem
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testis.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity:0, y:50 }}
              animate={inView?{opacity:1,y:0}:{}}
              transition={{ duration:0.7, delay:i*0.15, ease:[0.16,1,0.3,1] }}
              whileHover={{ y:-6 }}
              className="glass border border-[rgba(212,175,55,0.1)] p-7 transition-all duration-500 hover:border-[rgba(212,175,55,0.3)] hover:glow-gold relative overflow-hidden"
            >
              {/* Big quote */}
              <div className="absolute top-4 left-5 text-[4rem] text-[rgba(212,175,55,0.07)] font-serif leading-none select-none">"</div>

              <div className="text-[#d4af37] text-[0.85rem] tracking-[3px] mb-4">★★★★★</div>
              <p className="text-[0.82rem] text-[#666] leading-relaxed italic mb-6 relative z-10">{t.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8962e] flex items-center justify-center text-[#080808] font-black text-sm">
                  {t.av}
                </div>
                <div>
                  <div className="text-sm font-bold text-[#f0ead6]">{t.name}</div>
                  <div className="text-[0.62rem] text-[#d4af37] tracking-[0.06em]">{t.since} · {t.city}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
