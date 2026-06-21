"use client";
import { motion } from "framer-motion";

const navLinks  = ["Serviços","Barbeiros","Agendamento","Fidelidade","Sobre"];
const scrollMap: Record<string,string> = { Serviços:"#services",Barbeiros:"#barbers",Agendamento:"#booking",Fidelidade:"#loyalty",Sobre:"#about" };

export function Footer() {
  const scrollTo = (href: string) => document.querySelector(href)?.scrollIntoView({behavior:"smooth"});

  return (
    <footer className="bg-bg border-t border-[rgba(212,175,55,0.08)] pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand */}
          <div>
            <div className="flex flex-col items-start gap-[2px] mb-4">
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
              <span className="text-gold-gradient font-display font-black tracking-[0.18em] leading-none text-[1.8rem]">COSTA</span>
              <span className="text-gold-gradient text-[0.4rem] tracking-[0.4em] uppercase">BARBERSHOP</span>
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mt-1" />
            </div>
            <p className="text-[0.76rem] text-[#444] leading-relaxed max-w-[220px]">
              Referência em cortes masculinos e barba em Paracuru, Ceará. Estilo e precisão em cada atendimento.
            </p>
          </div>

          {/* Nav */}
          <div>
            <div className="text-[0.58rem] font-black tracking-[0.26em] uppercase text-[#d4af37] mb-5">Navegação</div>
            <div className="flex flex-col gap-3">
              {navLinks.map(l => (
                <button key={l} onClick={() => scrollTo(scrollMap[l])}
                  className="text-left text-[0.76rem] text-[#444] hover:text-[#d4af37] transition-colors tracking-[0.04em]">
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="text-[0.58rem] font-black tracking-[0.26em] uppercase text-[#d4af37] mb-5">Contato</div>
            <div className="flex flex-col gap-2.5">
              {[
                { icon:"📞", id:"fPhone",     val:"(85) 99999-9999" },
                { icon:"📸", id:"fInstagram", val:"@costabarbershop" },
                { icon:"📍", id:"fAddress",   val:"Paracuru, CE"    },
              ].map(c => (
                <div key={c.id} className="flex items-center gap-2 text-[0.76rem] text-[#444]">
                  <span className="text-[#d4af37]">{c.icon}</span>
                  <span id={c.id}>{c.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[rgba(212,175,55,0.07)] pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-[0.65rem] text-[#333] tracking-[0.06em]">
            © 2024 Costa Barbershop · Paracuru, Ceará, Brasil · Todos os direitos reservados
          </div>
          <a href="/admin" className="text-[0.65rem] text-[#333] hover:text-[#d4af37] transition-colors tracking-[0.08em] uppercase">
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}
