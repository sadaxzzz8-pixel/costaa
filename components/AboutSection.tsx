"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const contacts = [
  { icon:"📞", label:"Telefone / WhatsApp", val:"(85) 99999-9999", id:"cPhone"     },
  { icon:"📧", label:"E-mail",              val:"contato@costabarbershop.com.br", id:"cEmail"     },
  { icon:"📸", label:"Instagram",           val:"@costabarbershop", id:"cInstagram" },
  { icon:"📍", label:"Endereço",            val:"Paracuru, Ceará — Brasil", id:"cAddress"   },
  { icon:"🕐", label:"Horário",             val:"Seg–Sex: 8h às 20h · Sáb: 8h às 18h", id:"cHours"     },
];

export function AboutSection() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="about" className="py-28 px-6 bg-bg3 relative overflow-hidden">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[rgba(212,175,55,0.04)] blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Visual — logo display */}
          <motion.div
            initial={{ opacity:0, x:-40 }}
            animate={inView?{opacity:1,x:0}:{}}
            transition={{ duration:0.9, ease:[0.16,1,0.3,1] }}
            className="relative h-[420px] border border-[rgba(212,175,55,0.15)] bg-bg4 flex items-center justify-center overflow-hidden"
          >
            {/* Grid bg */}
            <div className="absolute inset-0 cyber-grid opacity-50" />

            {/* Glow */}
            <div className="absolute inset-0 bg-radial-[at_center] from-[rgba(212,175,55,0.06)] to-transparent" />

            {/* Logo */}
            <div className="relative z-10 text-center">
              <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mb-4" />
              <div className="text-gold-gradient font-display font-black tracking-[0.18em] leading-none mb-2"
                style={{ fontSize:"clamp(2.5rem,5vw,4rem)" }}>COSTA</div>
              <div className="text-gold-gradient text-[0.5rem] tracking-[0.42em] uppercase font-light">BARBERSHOP</div>
              <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mt-4" />
            </div>

            {/* Corner marks */}
            <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[rgba(212,175,55,0.4)]" />
            <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[rgba(212,175,55,0.4)]" />
            <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[rgba(212,175,55,0.4)]" />
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[rgba(212,175,55,0.4)]" />
          </motion.div>

          {/* Text */}
          <div>
            <motion.div initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} className="inline-flex items-center gap-3 mb-3">
              <div className="h-px w-6 bg-[#d4af37]" />
              <span className="text-[#d4af37] text-[0.58rem] font-bold tracking-[0.34em] uppercase">Sobre Nós</span>
            </motion.div>

            <motion.h2 initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.1}}
              className="text-3xl md:text-4xl font-black mb-4">
              Tradição &amp; <span className="text-gold-shine">Qualidade</span>
            </motion.h2>

            <motion.div initial={{scaleX:0}} animate={inView?{scaleX:1}:{}} transition={{delay:.3,duration:.8}}
              className="h-0.5 w-10 mb-5 origin-left" style={{background:"linear-gradient(90deg,#d4af37,#b8962e)"}} />

            <motion.p initial={{opacity:0}} animate={inView?{opacity:1}:{}} transition={{delay:.4}}
              className="text-[#555] text-sm leading-relaxed mb-7" id="aboutText">
              A Costa Barbershop é referência em estilo e qualidade em Paracuru. Nossos barbeiros são especialistas em cortes modernos e clássicos, sempre com técnica apurada e atendimento de primeira.
            </motion.p>

            <div className="flex flex-col gap-3">
              {contacts.map((c, i) => (
                <motion.div key={c.id}
                  initial={{ opacity:0, x:20 }}
                  animate={inView?{opacity:1,x:0}:{}}
                  transition={{ delay:0.5+i*0.07 }}
                  className="flex items-center gap-3 border border-[rgba(212,175,55,0.08)] bg-bg4 px-4 py-3 transition-all hover:border-[rgba(212,175,55,0.25)] hover:bg-[rgba(212,175,55,0.02)] group"
                >
                  <div className="w-8 h-8 flex items-center justify-center bg-[rgba(212,175,55,0.07)] text-sm text-[#d4af37] flex-shrink-0">
                    {c.icon}
                  </div>
                  <div>
                    <div className="text-[0.56rem] tracking-[0.16em] uppercase text-[#444]">{c.label}</div>
                    <div className="text-[0.86rem] font-semibold text-[#f0ead6]" id={c.id}>{c.val}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
