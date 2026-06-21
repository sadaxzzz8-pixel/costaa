"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Msg { role:"user"|"bot"; text:string; }

export function ChatWidget() {
  const [open,    setOpen]    = useState(false);
  const [msgs,    setMsgs]    = useState<Msg[]>([{role:"bot",text:"Olá! 👋 Sou o assistente da Costa Barbershop!\n\nPosso te ajudar com serviços, preços, horários e agendamentos. O que você precisa?"}]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bodyRef.current?.scrollTo(0, bodyRef.current.scrollHeight); }, [msgs]);

  const send = async () => {
    const msg = input.trim(); if (!msg || loading) return;
    setInput(""); setMsgs(p => [...p, {role:"user",text:msg}]); setLoading(true);
    try {
      const history = msgs.slice(-8).map(m => ({role: m.role==="user"?"user":"model", text:m.text}));
      const r = await fetch("/api/chat", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:msg,history})});
      const d = await r.json();
      if (r.ok && d.reply) setMsgs(p => [...p, {role:"bot",text:d.reply}]);
      else setMsgs(p => [...p, {role:"bot",text:"Desculpe, tive um problema. Chame no WhatsApp! 📲"}]);
    } catch { setMsgs(p => [...p, {role:"bot",text:"⚠️ Sem conexão. Fale no WhatsApp! 📲"}]); }
    finally  { setLoading(false); }
  };

  return (
    <div className="fixed bottom-24 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0, y:20, scale:0.95 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:20, scale:0.95 }}
            transition={{ duration:0.3, ease:[0.16,1,0.3,1] }}
            className="absolute bottom-16 right-0 w-[340px] max-h-[480px] flex flex-col glass-strong border-t-2 border-[#d4af37] border border-[rgba(212,175,55,0.2)] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[rgba(212,175,55,0.1)] bg-bg4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8962e] flex items-center justify-center text-[#080808] font-black text-sm">C</div>
              <div>
                <div className="text-[0.84rem] font-bold text-[#f0ead6]">Assistente Costa</div>
                <div className="text-[0.62rem] text-[#d4af37] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  Online agora · IA Gemini
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="ml-auto text-[#555] hover:text-[#f0ead6] transition-colors text-lg">✕</button>
            </div>

            {/* Messages */}
            <div ref={bodyRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-0">
              {msgs.map((m, i) => (
                <motion.div key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
                  className={`max-w-[85%] text-[0.82rem] leading-relaxed px-3.5 py-2.5 ${
                    m.role==="user"
                      ? "bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#080808] font-semibold self-end"
                      : "bg-[rgba(212,175,55,0.06)] border border-[rgba(212,175,55,0.1)] text-[#f0ead6] self-start"
                  }`}
                  style={{ whiteSpace:"pre-wrap" }}
                >
                  {m.text}
                </motion.div>
              ))}
              {loading && (
                <div className="flex gap-1.5 p-3 bg-[rgba(212,175,55,0.06)] border border-[rgba(212,175,55,0.1)] self-start w-fit">
                  {[0,1,2].map(j => (
                    <span key={j} className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"
                      style={{ animation:`typeDot 1.2s ${j*0.2}s infinite` }} />
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2 p-3 border-t border-[rgba(212,175,55,0.1)]">
              <input value={input} onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&send()}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-[rgba(212,175,55,0.04)] border border-[rgba(212,175,55,0.15)] px-3 py-2 text-[0.82rem] text-[#f0ead6] placeholder:text-[#444] outline-none focus:border-[#d4af37] transition-colors"
              />
              <button onClick={send} className="w-9 h-9 bg-gradient-to-br from-[#d4af37] to-[#b8962e] flex items-center justify-center text-[#080808] hover:opacity-85 transition-opacity flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
            <div className="text-center text-[0.58rem] text-[#333] tracking-[0.1em] uppercase py-1.5 border-t border-[rgba(212,175,55,0.06)]">
              Powered by Gemini AI
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale:1.1 }} whileTap={{ scale:0.95 }}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8962e] flex items-center justify-center shadow-[0_8px_28px_rgba(212,175,55,0.4)] relative"
      >
        <div className="absolute inset-0 rounded-full border-2 border-[rgba(212,175,55,0.35)] animate-ping" style={{animationDuration:"2.2s"}} />
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#080808" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </motion.button>
    </div>
  );
}
