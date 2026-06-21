"use client";
import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const levels = [
  { icon:"🥉", name:"Bronze", range:"0 – 299 pts", color:"#cd7f32", perks:["5% desconto em produtos"] },
  { icon:"🥈", name:"Prata",  range:"300 – 799 pts",color:"#aaaaaa", perks:["10% desconto em produtos","Agendamento prioritário"] },
  { icon:"🥇", name:"Ouro",   range:"800+ pts",     color:"#d4af37", perks:["15% desconto em produtos","Agendamento prioritário","Brinde mensal exclusivo"] },
];
const challenges = [
  { icon:"🔥", title:"3 Visitas no Mês",    desc:"Venha 3 vezes este mês e ganhe pontos extras!",      reward:"+150 pts" },
  { icon:"🪒", title:"Experimenta a Barba", desc:"Faça a barba pela primeira vez e ganhe.",             reward:"+80 pts"  },
  { icon:"👥", title:"Indica um Amigo",     desc:"Indique um amigo e ambos ganham pontos!",            reward:"+200 pts" },
];
const rewards = [
  { icon:"🏷", title:"Desconto R$10",      desc:"Desconto no próximo serviço",       cost:"100 pts" },
  { icon:"🎁", title:"Sobrancelha Grátis", desc:"Um design de sobrancelha grátis",   cost:"200 pts" },
  { icon:"✂",  title:"Corte Grátis",       desc:"Um corte masculino completamente",  cost:"500 pts" },
  { icon:"💎", title:"Kit de Produtos",    desc:"Kit exclusivo de produtos",          cost:"350 pts" },
];

type Tab = "levels"|"challenges"|"rewards";

export function LoyaltySection() {
  const [tab, setTab] = useState<Tab>("levels");
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="loyalty" className="py-28 px-6 bg-bg4 relative overflow-hidden">
      {/* Glow orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[rgba(212,175,55,0.04)] blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div ref={ref} className="mb-14 text-center">
          <motion.div initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} className="inline-flex items-center gap-3 mb-3">
            <div className="h-px w-6 bg-[#d4af37]" />
            <span className="text-[#d4af37] text-[0.58rem] font-bold tracking-[0.34em] uppercase">Programa de Fidelidade</span>
            <div className="h-px w-6 bg-[#d4af37]" />
          </motion.div>
          <motion.h2 initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.1}}
            className="text-3xl md:text-5xl font-black">
            Ganhe pontos, <span className="text-gold-shine">suba de nível</span>
          </motion.h2>
          <motion.div initial={{scaleX:0}} animate={inView?{scaleX:1}:{}} transition={{delay:.3,duration:.8}}
            className="h-0.5 w-10 mx-auto mt-4 origin-center" style={{background:"linear-gradient(90deg,#d4af37,#b8962e)"}} />
        </div>

        {/* Tabs */}
        <motion.div initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.4}}
          className="flex border border-[rgba(212,175,55,0.15)] mb-10 max-w-lg mx-auto">
          {(["levels","challenges","rewards"] as Tab[]).map((t, i) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-3 text-[0.65rem] font-black tracking-[0.16em] uppercase transition-all duration-300 ${
                tab===t ? "bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#080808]"
                        : "text-[#555] hover:text-[#d4af37]"
              } ${i>0?"border-l border-[rgba(212,175,55,0.15)]":""}`}>
              {t==="levels"?"🏆 Níveis":t==="challenges"?"🎯 Desafios":"🎁 Recompensas"}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {tab==="levels" && (
            <motion.div key="levels" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}}
              className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {levels.map((l, i) => (
                <motion.div key={l.name} initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{delay:i*.1}}
                  whileHover={{y:-6}}
                  className="glass border text-center p-8 transition-all duration-500"
                  style={{ borderColor:`${l.color}40` }}>
                  <span className="text-4xl block mb-4">{l.icon}</span>
                  <div className="text-sm font-black tracking-[0.12em] uppercase mb-2" style={{color:l.color}}>{l.name}</div>
                  <div className="text-[0.65rem] text-[#555] mb-5 tracking-[0.08em]">{l.range}</div>
                  <ul className="flex flex-col gap-2">
                    {l.perks.map(p => (
                      <li key={p} className="text-[0.72rem] text-[#666]">✓ {p}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          )}

          {tab==="challenges" && (
            <motion.div key="challenges" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}}
              className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {challenges.map((c, i) => (
                <motion.div key={c.title} initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{delay:i*.1}}
                  whileHover={{y:-5}}
                  className="glass border border-[rgba(212,175,55,0.12)] p-6 transition-all hover:border-[rgba(212,175,55,0.35)]">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{c.icon}</span>
                    <div className="text-sm font-bold text-[#f0ead6]">{c.title}</div>
                  </div>
                  <div className="text-[0.76rem] text-[#555] leading-relaxed mb-4">{c.desc}</div>
                  <span className="text-[0.7rem] font-bold text-[#d4af37] bg-[rgba(212,175,55,0.08)] px-3 py-1 border border-[rgba(212,175,55,0.2)]">
                    {c.reward}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}

          {tab==="rewards" && (
            <motion.div key="rewards" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {rewards.map((r, i) => (
                <motion.div key={r.title} initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{delay:i*.08}}
                  whileHover={{y:-5}}
                  className="glass border border-[rgba(212,175,55,0.12)] p-6 text-center flex flex-col gap-3 transition-all hover:border-[rgba(212,175,55,0.35)]">
                  <span className="text-3xl">{r.icon}</span>
                  <div className="text-sm font-bold text-[#f0ead6]">{r.title}</div>
                  <div className="text-[0.74rem] text-[#555] flex-1 leading-relaxed">{r.desc}</div>
                  <div className="text-gold-shine text-base font-black">{r.cost}</div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
