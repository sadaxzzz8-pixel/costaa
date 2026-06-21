"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const services = [
  { id:"01", icon:"✂",  name:"Corte Masculino",  desc:"Corte personalizado no seu estilo com acabamento perfeito e navalha.",          price:"R$35",  time:"45 min",  pts:50  },
  { id:"02", icon:"🪒", name:"Barba",             desc:"Modelagem com toalha quente, navalha e produtos premium de alta qualidade.",     price:"R$25",  time:"30 min",  pts:30  },
  { id:"03", icon:"💈", name:"Corte + Barba",     desc:"Combo completo para um visual impecável. O mais pedido da casa!",               price:"R$55",  time:"1h 15min",pts:80  },
  { id:"04", icon:"🎨", name:"Pigmentação",       desc:"Pigmentação capilar para cobrir falhas e realçar o visual com naturalidade.",   price:"R$50",  time:"1h",      pts:100 },
  { id:"05", icon:"💆", name:"Relaxamento",       desc:"Tratamento capilar profundo para cabelos crespos ou ondulados.",               price:"R$60",  time:"1h 30min",pts:120 },
  { id:"06", icon:"✦",  name:"Sobrancelha",       desc:"Design de sobrancelha masculina com navalha e linha para um olhar marcante.",   price:"R$15",  time:"20 min",  pts:20  },
];

function ServiceCard({ s, i }: { s: typeof services[0]; i: number }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16,1,0.3,1] }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="group relative glass border border-[rgba(212,175,55,0.1)] p-6 cursor-default overflow-hidden transition-all duration-300 hover:border-[rgba(212,175,55,0.35)] hover:glow-gold"
    >
      {/* Hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(212,175,55,0.04)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Top line on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

      <div className="relative z-10">
        <div className="text-[0.56rem] text-[#d4af37] font-bold tracking-[0.28em] mb-3 font-display">{s.id}</div>
        <div className="text-2xl mb-3">{s.icon}</div>
        <div className="text-[0.95rem] font-bold text-[#f0ead6] mb-2 tracking-[0.04em]">{s.name}</div>
        <div className="text-[0.78rem] text-[#555] leading-relaxed mb-5">{s.desc}</div>

        <div className="border-t border-[rgba(212,175,55,0.1)] pt-4 flex items-center justify-between">
          <div className="text-gold-shine text-xl font-black">{s.price}</div>
          <div className="text-right">
            <div className="text-[0.6rem] text-[#555] uppercase tracking-[0.14em]">{s.time}</div>
            <div className="text-[0.58rem] text-[rgba(212,175,55,0.6)] mt-0.5">+{s.pts} pts</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ServicesSection() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="services" className="py-28 px-6 bg-bg2 relative">
      <div className="absolute inset-0 cyber-grid opacity-30" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div ref={ref} className="mb-16 text-center">
          <motion.div initial={{ opacity:0, y:20 }} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.6}}
            className="inline-flex items-center gap-3 mb-3">
            <div className="h-px w-6 bg-[#d4af37]" />
            <span className="text-[#d4af37] text-[0.58rem] font-bold tracking-[0.34em] uppercase">Nossos Serviços</span>
            <div className="h-px w-6 bg-[#d4af37]" />
          </motion.div>

          <motion.h2 initial={{ opacity:0, y:20 }} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.7,delay:.1}}
            className="text-3xl md:text-5xl font-black leading-tight">
            O que <span className="text-gold-shine">oferecemos</span>
          </motion.h2>

          <motion.div initial={{scaleX:0}} animate={inView?{scaleX:1}:{}} transition={{duration:0.8,delay:.3}}
            className="h-0.5 w-10 mx-auto mt-4 mb-5 origin-center"
            style={{ background:"linear-gradient(90deg,#d4af37,#b8962e)" }} />

          <motion.p initial={{opacity:0}} animate={inView?{opacity:1}:{}} transition={{duration:0.7,delay:.4}}
            className="text-[#555] text-sm max-w-md mx-auto leading-relaxed">
            Cada serviço executado com maestria, os melhores produtos e atenção a cada detalhe.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1px] border border-[rgba(212,175,55,0.08)]">
          {services.map((s, i) => (
            <ServiceCard key={s.id} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
