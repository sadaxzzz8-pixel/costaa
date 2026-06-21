"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const barbers = [
  { num:"01", icon:"💈", name:"Costa",  role:"Fundador & Master Barber",
    bio:"Referência em cortes degradê, barba e pigmentação. Fundou a barbearia com paixão pelo ofício e anos de experiência." },
  { num:"02", icon:"✂",  name:"Rafael", role:"Barber Especialista",
    bio:"Especialista em barba modelada e acabamentos perfeitos. Transforma cada cliente com precisão e cuidado artesanal." },
  { num:"03", icon:"🎨", name:"Diego",  role:"Barber & Colorista",
    bio:"Mestre em pigmentação, luzes e relaxamentos. Sempre atualizado nas últimas tendências mundiais da barbearia." },
];

export function BarbersSection() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="barbers" className="py-28 px-6 bg-bg3 relative overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 rounded-full bg-[rgba(212,175,55,0.04)] blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 rounded-full bg-[rgba(212,175,55,0.04)] blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div ref={ref} className="mb-16 text-center">
          <motion.div initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.6}}
            className="inline-flex items-center gap-3 mb-3">
            <div className="h-px w-6 bg-[#d4af37]" />
            <span className="text-[#d4af37] text-[0.58rem] font-bold tracking-[0.34em] uppercase">Nossa Equipe</span>
            <div className="h-px w-6 bg-[#d4af37]" />
          </motion.div>
          <motion.h2 initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.7,delay:.1}}
            className="text-3xl md:text-5xl font-black">
            Nossos <span className="text-gold-shine">Barbeiros</span>
          </motion.h2>
          <motion.div initial={{scaleX:0}} animate={inView?{scaleX:1}:{}} transition={{duration:0.8,delay:.3}}
            className="h-0.5 w-10 mx-auto mt-4 origin-center"
            style={{ background:"linear-gradient(90deg,#d4af37,#b8962e)" }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {barbers.map((b, i) => (
            <motion.div
              key={b.num}
              initial={{ opacity:0, y:60 }}
              animate={inView?{opacity:1,y:0}:{}}
              transition={{ duration:0.8, delay:i*0.15, ease:[0.16,1,0.3,1] }}
              whileHover={{ y:-8 }}
              className="group glass border border-[rgba(212,175,55,0.1)] overflow-hidden transition-all duration-500 hover:border-[rgba(212,175,55,0.4)] hover:glow-gold"
            >
              {/* Avatar area */}
              <div className="relative h-52 bg-bg4 flex items-center justify-center border-b border-[rgba(212,175,55,0.08)]">
                {/* Grid bg */}
                <div className="absolute inset-0 cyber-grid opacity-40" />
                {/* Glow */}
                <div className="absolute inset-0 bg-radial-[at_center] from-[rgba(212,175,55,0.08)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <span className="text-5xl relative z-10 drop-shadow-lg">{b.icon}</span>

                {/* Number badge */}
                <div className="absolute top-3 right-3 w-7 h-7 border border-[rgba(212,175,55,0.3)] bg-[rgba(0,0,0,0.6)] flex items-center justify-center text-[0.56rem] font-black text-[#d4af37] tracking-wider">
                  {b.num}
                </div>

                {/* Hologram lines */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.3)] to-transparent" />
              </div>

              {/* Info */}
              <div className="p-6">
                <div className="font-black text-[1.05rem] text-[#f0ead6] tracking-[0.04em] mb-1">{b.name}</div>
                <div className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-[#d4af37] mb-3">{b.role}</div>
                <div className="text-[0.78rem] text-[#555] leading-relaxed mb-4">{b.bio}</div>
                <div className="text-[#d4af37] text-[0.78rem] tracking-[3px]">★★★★★</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
