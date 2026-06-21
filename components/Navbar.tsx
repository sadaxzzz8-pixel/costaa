"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const links = [
  { href: "#services",  label: "Serviços"   },
  { href: "#barbers",   label: "Barbeiros"  },
  { href: "#loyalty",   label: "Fidelidade" },
  { href: "#profile",   label: "Meu Perfil" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open,    setOpen]    = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16,1,0.3,1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "glass-strong shadow-2xl" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => scrollTo("#hero")} className="flex flex-col items-center gap-[2px]">
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
            <span className="text-gold-gradient font-display text-[1.35rem] font-black tracking-[0.18em] leading-none">
              COSTA
            </span>
            <span className="text-gold-gradient text-[0.38rem] tracking-[0.38em] uppercase leading-none">
              BARBERSHOP
            </span>
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
          </button>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <li key={l.href}>
                <button
                  onClick={() => scrollTo(l.href)}
                  className="text-[0.7rem] font-semibold tracking-[0.18em] uppercase text-[#777] hover:text-[#d4af37] transition-colors duration-300"
                >
                  {l.label}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => scrollTo("#booking")}
                className="btn-gold px-5 py-2.5 text-[0.68rem]"
              >
                ✂ Agendar
              </button>
            </li>
          </ul>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col gap-[5px] p-2"
            aria-label="Menu"
          >
            <motion.span animate={{ rotate: open ? 45 : 0, y: open ? 7 : 0 }}
              className="block w-5 h-[1.5px] bg-[#d4af37] origin-center transition-all"/>
            <motion.span animate={{ opacity: open ? 0 : 1 }}
              className="block w-5 h-[1.5px] bg-[#d4af37]"/>
            <motion.span animate={{ rotate: open ? -45 : 0, y: open ? -7 : 0 }}
              className="block w-5 h-[1.5px] bg-[#d4af37] origin-center transition-all"/>
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[72px] left-0 right-0 z-40 glass-strong border-t border-[rgba(212,175,55,0.1)] py-6 px-6 flex flex-col gap-4 md:hidden"
          >
            {links.map((l, i) => (
              <motion.button
                key={l.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => scrollTo(l.href)}
                className="text-left text-sm font-semibold tracking-[0.14em] uppercase text-[#888] hover:text-[#d4af37] py-2 border-b border-[rgba(255,255,255,0.04)] transition-colors"
              >
                {l.label}
              </motion.button>
            ))}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: links.length * 0.06 }}
              onClick={() => scrollTo("#booking")}
              className="btn-gold px-5 py-3 mt-2 text-center"
            >
              ✂ Agendar Agora
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
