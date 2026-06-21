"use client";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const ALL_SLOTS = ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30",
                   "13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30",
                   "17:00","17:30","18:00","18:30","19:00"];

const feats = [
  { icon:"⚡", label:"Confirmação imediata"      },
  { icon:"🔔", label:"Sem filas de espera"       },
  { icon:"🎯", label:"Escolha seu barbeiro"      },
  { icon:"📅", label:"Cancele quando quiser"     },
];

export function BookingSection() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  const [form, setForm]         = useState({ name:"", phone:"", service:"", barber:"", date:"", time:"" });
  const [slots, setSlots]       = useState<string[]>([]);
  const [slotsLoading, setSL]   = useState(false);
  const [submitting, setSub]    = useState(false);
  const [msg, setMsg]           = useState<{type:"ok"|"err", text:string}|null>(null);

  const today = new Date().toISOString().split("T")[0];

  const loadSlots = async (barber: string, date: string) => {
    if (!barber || !date) { setSlots([]); return; }
    setSL(true);
    try {
      const r = await fetch(`/api/available-slots?barber=${encodeURIComponent(barber)}&date=${date}`);
      setSlots(await r.json());
    } catch { setSlots(ALL_SLOTS); }
    finally  { setSL(false); }
  };

  const handleChange = (k: string, v: string) => {
    const next = { ...form, [k]: v };
    if (k === "time") { setForm(next); return; }
    if (k === "barber" || k === "date") {
      next.time = "";
      loadSlots(k==="barber"?v:form.barber, k==="date"?v:form.date);
    }
    setForm(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.time) { setMsg({type:"err", text:"⚠ Selecione um horário"}); return; }
    setSub(true); setMsg(null);
    try {
      const r = await fetch("/api/appointments", {
        method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form)
      });
      const d = await r.json();
      if (r.ok) {
        setMsg({type:"ok", text:`✅ Agendado! ${form.name}, te esperamos dia ${form.date} às ${form.time} com ${form.barber}.`});
        setForm({ name:"", phone:"", service:"", barber:"", date:"", time:"" });
        setSlots([]);
      } else setMsg({type:"err", text:"❌ "+(d.error||"Erro ao agendar")});
    } catch {
      setMsg({type:"ok", text:"✅ Solicitação enviada! Entraremos em contato pelo WhatsApp."});
    }
    setSub(false);
  };

  const inp = "w-full bg-[rgba(212,175,55,0.03)] border border-[rgba(212,175,55,0.15)] px-4 py-3 text-[0.88rem] text-[#f0ead6] outline-none focus:border-[#d4af37] focus:bg-[rgba(212,175,55,0.06)] transition-all duration-300 placeholder:text-[#444]";

  return (
    <section id="booking" className="py-28 px-6 bg-bg relative">
      <div className="absolute inset-0 cyber-grid opacity-20" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-16 items-start">

          {/* Left info */}
          <div>
            <motion.div initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.6}}
              className="inline-flex items-center gap-3 mb-3">
              <div className="h-px w-6 bg-[#d4af37]" />
              <span className="text-[#d4af37] text-[0.58rem] font-bold tracking-[0.34em] uppercase">Agendamento Online</span>
            </motion.div>

            <motion.h2 initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.7,delay:.1}}
              className="text-3xl md:text-4xl font-black leading-tight mb-4">
              Agende seu<br/><span className="text-gold-shine">horário agora</span>
            </motion.h2>

            <motion.div initial={{scaleX:0}} animate={inView?{scaleX:1}:{}} transition={{duration:0.8,delay:.3}}
              className="h-0.5 w-10 mb-5 origin-left"
              style={{ background:"linear-gradient(90deg,#d4af37,#b8962e)" }} />

            <motion.p initial={{opacity:0}} animate={inView?{opacity:1}:{}} transition={{delay:.4}}
              className="text-[#555] text-sm leading-relaxed mb-8">
              Escolha o serviço, o barbeiro e o horário. Rápido, simples, sem complicação.
            </motion.p>

            <div className="flex flex-col gap-3">
              {feats.map((f, i) => (
                <motion.div key={i} initial={{opacity:0,x:-20}} animate={inView?{opacity:1,x:0}:{}} transition={{delay:.5+i*.08}}
                  className="flex items-center gap-3">
                  <div className="w-8 h-8 border border-[rgba(212,175,55,0.25)] flex items-center justify-center text-sm text-[#d4af37] flex-shrink-0">
                    {f.icon}
                  </div>
                  <span className="text-[0.83rem] text-[#d4c9b0]">{f.label}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right form */}
          <motion.div initial={{opacity:0,y:40}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.8,delay:.3,ease:[0.16,1,0.3,1]}}
            className="glass border-t-2 border-[#d4af37] border-l border-r border-b border-[rgba(212,175,55,0.15)] p-8">

            {/* Form title */}
            <div className="text-[0.68rem] font-black tracking-[0.22em] uppercase text-[#d4af37] mb-6 pb-4 border-b border-[rgba(212,175,55,0.1)] flex items-center gap-2">
              <span>📅</span> Novo Agendamento
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.58rem] font-bold tracking-[0.2em] uppercase text-[#d4af37]/70">Nome Completo</label>
                <input className={inp} placeholder="João Silva" value={form.name}
                  onChange={e=>handleChange("name",e.target.value)} required />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[0.58rem] font-bold tracking-[0.2em] uppercase text-[#d4af37]/70">Telefone / WhatsApp</label>
                <input className={inp} placeholder="(85) 99999-9999" type="tel" value={form.phone}
                  onChange={e=>handleChange("phone",e.target.value)} required />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[0.58rem] font-bold tracking-[0.2em] uppercase text-[#d4af37]/70">Serviço</label>
                <select className={inp} value={form.service} onChange={e=>handleChange("service",e.target.value)} required
                  style={{ appearance:"none" }}>
                  <option value="">Selecione...</option>
                  <option value="Corte Masculino">Corte Masculino — R$35</option>
                  <option value="Barba">Barba — R$25</option>
                  <option value="Corte + Barba">Corte + Barba — R$55</option>
                  <option value="Pigmentação">Pigmentação — R$50</option>
                  <option value="Relaxamento">Relaxamento — R$60</option>
                  <option value="Sobrancelha">Sobrancelha — R$15</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[0.58rem] font-bold tracking-[0.2em] uppercase text-[#d4af37]/70">Barbeiro</label>
                <select className={inp} value={form.barber} onChange={e=>handleChange("barber",e.target.value)} required
                  style={{ appearance:"none" }}>
                  <option value="">Selecione...</option>
                  <option value="Costa">Costa</option>
                  <option value="Rafael">Rafael</option>
                  <option value="Diego">Diego</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-[0.58rem] font-bold tracking-[0.2em] uppercase text-[#d4af37]/70">Data</label>
                <input className={inp} type="date" min={today} value={form.date}
                  onChange={e=>handleChange("date",e.target.value)} required />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-[0.58rem] font-bold tracking-[0.2em] uppercase text-[#d4af37]/70">Horário Disponível</label>
                {slotsLoading ? (
                  <div className="text-[0.75rem] text-[#555] py-2">Carregando horários...</div>
                ) : !form.barber || !form.date ? (
                  <div className="text-[0.75rem] text-[#444] py-2">Selecione barbeiro e data acima</div>
                ) : slots.length === 0 ? (
                  <div className="text-[0.75rem] text-red-400 py-2">Sem horários disponíveis neste dia</div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {slots.map(s => (
                      <button key={s} type="button" onClick={() => handleChange("time",s)}
                        className={`px-3 py-1.5 text-[0.75rem] border transition-all duration-200 ${
                          form.time === s
                            ? "bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#080808] border-transparent font-bold"
                            : "border-[rgba(212,175,55,0.2)] text-[#ccc] hover:border-[#d4af37] hover:text-[#d4af37]"
                        }`}
                      >{s}</button>
                    ))}
                  </div>
                )}
              </div>

              <div className="sm:col-span-2 mt-2">
                <button type="submit" disabled={submitting}
                  className="btn-gold w-full py-4 text-[0.78rem] disabled:opacity-40">
                  {submitting ? "Agendando..." : "✂  Confirmar Agendamento"}
                </button>
              </div>

              {msg && (
                <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="sm:col-span-2"
                  style={{ padding:"0.9rem 1rem", fontSize:"0.8rem", fontWeight:600, textAlign:"center",
                           border:"1px solid", lineHeight:1.5,
                           borderColor: msg.type==="ok" ? "rgba(212,175,55,0.3)" : "rgba(224,90,90,0.3)",
                           color:        msg.type==="ok" ? "#d4af37" : "#e05a5a",
                           background:   msg.type==="ok" ? "rgba(212,175,55,0.05)" : "rgba(224,90,90,0.05)" }}>
                  {msg.text}
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
