"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── types ── */
interface Appt {
  id: string; name: string; phone: string;
  service: string; barber: string; date: string;
  time: string; status: string; createdAt: string;
  pointsAwarded?: number;
}
interface Settings {
  phone: string; email: string; instagram: string;
  address: string; hours: string; about: string; whatsapp: string;
}

type Tab = "dashboard" | "appointments" | "settings" | "gemini";

/* ── helpers ── */
const fmtDate = (d: string) => {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
};
const fmtTime = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { day:"2-digit", month:"2-digit", hour:"2-digit", minute:"2-digit" });

const statusColor: Record<string,string> = {
  pendente:   "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  confirmado: "text-green-400  border-green-400/30  bg-green-400/10",
  concluido:  "text-blue-400   border-blue-400/30   bg-blue-400/10",
  cancelado:  "text-red-400    border-red-400/30    bg-red-400/10",
};

/* ══════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════ */
export default function AdminPage() {
  const [authed,   setAuthed]   = useState(false);
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [token,    setToken]    = useState("");

  const [tab,      setTab]      = useState<Tab>("dashboard");
  const [appts,    setAppts]    = useState<Appt[]>([]);
  const [filter,   setFilter]   = useState("todos");
  const [settings, setSettings] = useState<Settings | null>(null);
  const [toast,    setToast]    = useState("");
  const [lastUpd,  setLastUpd]  = useState("");

  /* gemini tab */
  const [geminiKey,     setGeminiKey]     = useState("");
  const [geminiResult,  setGeminiResult]  = useState<{type:"ok"|"err"|"info"; text:string}|null>(null);
  const [geminiLoading, setGeminiLoading] = useState(false);

  /* settings edit */
  const [settingsForm, setSettingsForm] = useState<Settings | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  /* ── load appts ── */
  const loadAppts = useCallback(async () => {
    if (!token) return;
    try {
      const r = await fetch("/api/appointments", { headers: { "x-admin-token": token } });
      if (r.ok) setAppts(await r.json());
    } catch {}
    setLastUpd(new Date().toLocaleTimeString("pt-BR"));
  }, [token]);

  /* ── load settings ── */
  const loadSettings = useCallback(async () => {
    try {
      const r = await fetch("/api/settings");
      if (r.ok) { const s = await r.json(); setSettings(s); setSettingsForm(s); }
    } catch {}
  }, []);

  useEffect(() => {
    if (authed) { loadAppts(); loadSettings(); }
  }, [authed, loadAppts, loadSettings]);

  useEffect(() => {
    if (!authed) return;
    const iv = setInterval(loadAppts, 15000);
    return () => clearInterval(iv);
  }, [authed, loadAppts]);

  /* ── auth (simple local) ── */
  const handleLogin = () => {
    if (password === "costa2024") {
      setToken(password);
      setAuthed(true);
      setLoginErr("");
    } else {
      setLoginErr("Senha incorreta.");
    }
  };

  /* ── actions ── */
  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ status }),
    });
    showToast(`Status → ${status}`);
    loadAppts();
  };

  const deleteAppt = async (id: string) => {
    if (!confirm("Excluir este agendamento?")) return;
    await fetch(`/api/appointments/${id}`, { method: "DELETE", headers: { "x-admin-token": token } });
    showToast("🗑 Excluído");
    loadAppts();
  };

  const saveSettings = async () => {
    if (!settingsForm) return;
    setSavingSettings(true);
    try {
      const r = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify(settingsForm),
      });
      if (r.ok) { setSettings(settingsForm); showToast("⚡ Configurações salvas!"); }
      else showToast("❌ Erro ao salvar");
    } catch { showToast("❌ Sem conexão"); }
    setSavingSettings(false);
  };

  const applyGeminiKey = async () => {
    const key = geminiKey.trim();
    if (!key) { setGeminiResult({ type:"err", text:"Cole a chave antes de aplicar." }); return; }
    setGeminiLoading(true); setGeminiResult(null);
    try {
      // Salva a key via API
      const r = await fetch("/api/admin/gemini-key", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ apiKey: key }),
      });
      // Testa o chat
      const testR = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Diga apenas: funcionou!", history: [] }),
      });
      const testD = await testR.json();
      if (testR.ok && testD.reply) {
        setGeminiResult({ type:"ok", text:`✅ Chave aplicada! Resposta: "${testD.reply.slice(0,60)}"` });
        showToast("🤖 Gemini AI ativado!");
      } else if (testD.error === "quota_esgotada") {
        setGeminiResult({ type:"info", text:"✅ Chave salva e válida! Quota diária esgotada — o chat funciona novamente amanhã após meia-noite (UTC)." });
        showToast("✅ Chave salva!");
      } else {
        setGeminiResult({ type:"err", text:`❌ Chave salva mas erro no teste: ${testD.error || "desconhecido"}` });
      }
    } catch {
      setGeminiResult({ type:"err", text:"❌ Sem conexão com o servidor." });
    }
    setGeminiLoading(false);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  /* ── stats ── */
  const today      = new Date().toISOString().split("T")[0];
  const todayAppts = appts.filter(a => a.date === today);
  const pending    = appts.filter(a => a.status === "pendente");
  const confirmed  = appts.filter(a => a.status === "confirmado");
  const done       = appts.filter(a => a.status === "concluido");

  const filtered   = filter === "todos" ? appts : appts.filter(a => a.status === filter);

  /* ── CSS shortcuts ── */
  const inp = "w-full bg-[rgba(212,175,55,0.04)] border border-[rgba(212,175,55,0.15)] px-3 py-2.5 text-sm text-[#f0ead6] outline-none focus:border-[#d4af37] transition-colors placeholder:text-[#444]";
  const lbl = "block text-[0.58rem] font-bold tracking-[0.18em] uppercase text-[#d4af37]/70 mb-1";

  /* ══ LOGIN ══ */
  if (!authed) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4">
      <div className="absolute inset-0" style={{ backgroundImage:"linear-gradient(rgba(212,175,55,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,0.03) 1px,transparent 1px)", backgroundSize:"60px 60px" }} />
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
        className="relative z-10 w-full max-w-sm bg-[rgba(13,13,13,0.9)] border border-[rgba(212,175,55,0.15)] border-t-2 border-t-[#d4af37] p-10 text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mb-3 w-28 mx-auto" />
          <div className="text-[2rem] font-black tracking-[0.18em] leading-none"
            style={{ background:"linear-gradient(180deg,#e8e0cc,#fff,#d4af37,#8a6c1e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
            COSTA
          </div>
          <div className="text-[0.38rem] tracking-[0.4em] uppercase mt-1 mb-3"
            style={{ background:"linear-gradient(180deg,#c8bfa0,#e8dfc0)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
            BARBERSHOP
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent w-28 mx-auto" />
          <div className="text-[0.7rem] text-[#555] mt-3 tracking-[0.12em] uppercase">Painel Admin</div>
        </div>

        <div className="text-left mb-4">
          <input className={inp} type="password" placeholder="••••••••"
            value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()} />
          {loginErr && <div className="text-red-400 text-xs mt-2">{loginErr}</div>}
        </div>

        <button onClick={handleLogin}
          className="w-full py-3 text-[0.72rem] font-black tracking-[0.18em] uppercase text-[#080808]"
          style={{ background:"linear-gradient(135deg,#d4af37,#b8962e)" }}>
          Entrar no Painel
        </button>
      </motion.div>
    </div>
  );

  /* ══ PAINEL ══ */
  return (
    <div className="min-h-screen bg-[#080808] text-[#f0ead6]">
      {/* Header */}
      <div className="border-b border-[rgba(212,175,55,0.1)] bg-[rgba(13,13,13,0.95)] backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="font-black text-sm tracking-[0.18em]"
              style={{ background:"linear-gradient(135deg,#d4af37,#b8962e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              COSTA
            </div>
            <div className="text-[0.6rem] text-[#444] tracking-[0.1em] uppercase hidden sm:block">Painel Admin</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-green-400/10 border border-green-400/20 px-2 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-[0.58rem] font-bold tracking-[0.1em] uppercase">Ao Vivo</span>
            </div>
            <span className="text-[#333] text-[0.6rem]">{lastUpd}</span>
            <button onClick={() => { setAuthed(false); setToken(""); }}
              className="text-[0.62rem] text-[#555] hover:text-red-400 transition-colors tracking-[0.08em] uppercase">
              Sair
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex gap-6">

        {/* Sidebar */}
        <aside className="w-48 flex-shrink-0 hidden md:block">
          <nav className="flex flex-col gap-1 sticky top-20">
            {([
              { id:"dashboard",    icon:"▦", label:"Dashboard"       },
              { id:"appointments", icon:"▤", label:"Agendamentos", badge: pending.length },
              { id:"settings",     icon:"◈", label:"Configurações"   },
              { id:"gemini",       icon:"◉", label:"Chat IA"         },
            ] as const).map(item => (
              <button key={item.id} onClick={() => setTab(item.id as Tab)}
                className={`flex items-center gap-2.5 px-3 py-2.5 text-left text-[0.78rem] font-medium transition-all border-l-2 ${
                  tab === item.id
                    ? "border-l-[#d4af37] bg-[rgba(212,175,55,0.08)] text-[#f0ead6] font-bold"
                    : "border-l-transparent text-[#555] hover:text-[#f0ead6] hover:bg-[rgba(255,255,255,0.03)]"
                }`}>
                <span className="text-[0.8rem] opacity-70">{item.icon}</span>
                {item.label}
                {("badge" in item) && item.badge > 0 && (
                  <span className="ml-auto bg-[#d4af37] text-[#080808] text-[0.55rem] font-black px-1.5 py-0.5 min-w-[18px] text-center">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
            <div className="mt-4 pt-4 border-t border-[rgba(212,175,55,0.08)]">
              <a href="/" className="flex items-center gap-2 px-3 py-2 text-[0.72rem] text-[#444] hover:text-[#d4af37] transition-colors">
                ← Ver site
              </a>
            </div>
          </nav>
        </aside>

        {/* Mobile tab bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[rgba(13,13,13,0.98)] border-t border-[rgba(212,175,55,0.1)] flex">
          {(["dashboard","appointments","settings","gemini"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-3 text-[0.58rem] font-bold tracking-[0.1em] uppercase transition-colors ${
                tab===t ? "text-[#d4af37]" : "text-[#444]"
              }`}>
              {t==="dashboard"?"▦":t==="appointments"?"▤":t==="settings"?"◈":"◉"}
              <br/>{t==="appointments"?"Agenda":t==="settings"?"Config":t==="gemini"?"IA":t}
            </button>
          ))}
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 pb-20 md:pb-0">

          {/* DASHBOARD */}
          {tab === "dashboard" && (
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
              <h1 className="text-lg font-black tracking-[0.06em] mb-6">Dashboard</h1>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                {[
                  { icon:"▤", num:appts.length,    label:"Total"       },
                  { icon:"◷", num:pending.length,  label:"Pendentes",  color:"text-yellow-400" },
                  { icon:"✓", num:confirmed.length,label:"Confirmados", color:"text-green-400" },
                  { icon:"★", num:done.length,     label:"Concluídos", color:"text-blue-400" },
                ].map((s, i) => (
                  <div key={i} className="bg-[rgba(212,175,55,0.03)] border border-[rgba(212,175,55,0.1)] p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-[rgba(212,175,55,0.06)] border border-[rgba(212,175,55,0.1)] flex items-center justify-center text-sm">
                      {s.icon}
                    </div>
                    <div>
                      <div className={`text-xl font-black leading-none ${s.color||"text-[#f0ead6]"}`}>{s.num}</div>
                      <div className="text-[0.6rem] text-[#555] uppercase tracking-[0.12em] mt-0.5">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hoje */}
              <div className="bg-[rgba(13,13,13,0.8)] border border-[rgba(212,175,55,0.1)] mb-4">
                <div className="px-4 py-3 border-b border-[rgba(212,175,55,0.08)] text-[0.7rem] font-bold tracking-[0.14em] uppercase text-[#d4af37]">
                  📆 Agendamentos de Hoje
                </div>
                {todayAppts.length === 0 ? (
                  <div className="px-4 py-6 text-center text-[#444] text-sm">Sem agendamentos hoje</div>
                ) : (
                  <div className="divide-y divide-[rgba(212,175,55,0.06)]">
                    {todayAppts.sort((a,b)=>a.time.localeCompare(b.time)).map(a => (
                      <div key={a.id} className="px-4 py-3 flex items-center gap-4 flex-wrap">
                        <span className="font-black text-[#d4af37] text-sm w-12">{a.time}</span>
                        <span className="font-semibold text-sm">{a.name}</span>
                        <span className="text-[#555] text-xs">{a.service}</span>
                        <span className="text-[#444] text-xs">· {a.barber}</span>
                        <span className={`ml-auto text-[0.62rem] font-bold tracking-[0.1em] uppercase border px-2 py-0.5 ${statusColor[a.status]||""}`}>
                          {a.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pendentes */}
              <div className="bg-[rgba(13,13,13,0.8)] border border-[rgba(212,175,55,0.1)]">
                <div className="px-4 py-3 border-b border-[rgba(212,175,55,0.08)] text-[0.7rem] font-bold tracking-[0.14em] uppercase text-[#d4af37]">
                  🔔 Aguardando Confirmação ({pending.length})
                </div>
                {pending.length === 0 ? (
                  <div className="px-4 py-6 text-center text-[#444] text-sm">✓ Nenhum pendente</div>
                ) : (
                  <div className="divide-y divide-[rgba(212,175,55,0.06)]">
                    {pending.map(a => (
                      <div key={a.id} className="px-4 py-3 flex items-center gap-3 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm">{a.name}</div>
                          <div className="text-[#555] text-xs">{fmtDate(a.date)} às {a.time} · {a.service} · {a.barber}</div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button onClick={() => updateStatus(a.id,"confirmado")}
                            className="text-[0.62rem] font-bold text-green-400 border border-green-400/25 px-2 py-1 hover:bg-green-400/10 transition-colors">
                            ✓ Confirmar
                          </button>
                          <button onClick={() => updateStatus(a.id,"cancelado")}
                            className="text-[0.62rem] font-bold text-red-400 border border-red-400/25 px-2 py-1 hover:bg-red-400/10 transition-colors">
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* APPOINTMENTS */}
          {tab === "appointments" && (
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <h1 className="text-lg font-black tracking-[0.06em]">Agendamentos</h1>
                <button onClick={loadAppts} className="text-[0.62rem] text-[#555] hover:text-[#d4af37] transition-colors tracking-[0.1em] uppercase">
                  ↻ Atualizar
                </button>
              </div>

              {/* Filters */}
              <div className="flex gap-2 flex-wrap mb-5">
                {["todos","pendente","confirmado","concluido","cancelado"].map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`text-[0.62rem] font-bold tracking-[0.1em] uppercase px-3 py-1.5 border transition-colors ${
                      filter===f
                        ? "bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#080808] border-transparent"
                        : "border-[rgba(212,175,55,0.2)] text-[#555] hover:text-[#d4af37] hover:border-[rgba(212,175,55,0.4)]"
                    }`}>
                    {f}
                  </button>
                ))}
              </div>

              {/* Table */}
              <div className="bg-[rgba(13,13,13,0.8)] border border-[rgba(212,175,55,0.1)] overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="border-b border-[rgba(212,175,55,0.08)]">
                      {["Data","Hora","Cliente","Telefone","Serviço","Barbeiro","Status","Ações"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[0.6rem] font-bold tracking-[0.16em] uppercase text-[#555]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(212,175,55,0.05)]">
                    {filtered.length === 0 ? (
                      <tr><td colSpan={8} className="px-4 py-8 text-center text-[#444] text-sm">Nenhum agendamento encontrado</td></tr>
                    ) : filtered.map(a => (
                      <tr key={a.id} className="hover:bg-[rgba(212,175,55,0.02)] transition-colors">
                        <td className="px-4 py-3 text-sm">{fmtDate(a.date)}</td>
                        <td className="px-4 py-3 text-sm font-bold text-[#d4af37]">{a.time}</td>
                        <td className="px-4 py-3 text-sm font-semibold">{a.name}</td>
                        <td className="px-4 py-3 text-xs text-[#555]">{a.phone}</td>
                        <td className="px-4 py-3 text-xs">{a.service}</td>
                        <td className="px-4 py-3 text-xs text-[#555]">{a.barber}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[0.6rem] font-bold tracking-[0.08em] uppercase border px-2 py-0.5 ${statusColor[a.status]||""}`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1.5 flex-wrap">
                            {a.status !== "confirmado" && a.status !== "concluido" && (
                              <button onClick={() => updateStatus(a.id,"confirmado")}
                                className="text-[0.58rem] text-green-400 border border-green-400/25 px-1.5 py-0.5 hover:bg-green-400/10 transition-colors">✓</button>
                            )}
                            {a.status !== "concluido" && (
                              <button onClick={() => updateStatus(a.id,"concluido")}
                                className="text-[0.58rem] text-blue-400 border border-blue-400/25 px-1.5 py-0.5 hover:bg-blue-400/10 transition-colors">★</button>
                            )}
                            {a.status !== "cancelado" && (
                              <button onClick={() => updateStatus(a.id,"cancelado")}
                                className="text-[0.58rem] text-red-400 border border-red-400/25 px-1.5 py-0.5 hover:bg-red-400/10 transition-colors">✕</button>
                            )}
                            <button onClick={() => deleteAppt(a.id)}
                              className="text-[0.58rem] text-[#333] border border-[#222] px-1.5 py-0.5 hover:text-red-400 hover:border-red-400/25 transition-colors">🗑</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* SETTINGS */}
          {tab === "settings" && (
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
              <h1 className="text-lg font-black tracking-[0.06em] mb-6">
                Configurações do Site
                <span className="ml-3 text-green-400 text-[0.65rem] font-normal tracking-[0.1em] uppercase">— Ao Vivo</span>
              </h1>

              {settingsForm && (
                <div className="bg-[rgba(13,13,13,0.8)] border border-[rgba(212,175,55,0.1)] p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {([
                      { key:"phone",     label:"📞 Telefone / WhatsApp" },
                      { key:"email",     label:"📧 E-mail"              },
                      { key:"instagram", label:"📸 Instagram"           },
                      { key:"whatsapp",  label:"💬 WhatsApp (só números)" },
                      { key:"address",   label:"📍 Endereço",           full:true },
                      { key:"hours",     label:"🕐 Horário de Funcionamento", full:true },
                    ] as {key:keyof Settings; label:string; full?:boolean}[]).map(f => (
                      <div key={f.key} className={f.full ? "sm:col-span-2" : ""}>
                        <label className={lbl}>{f.label}</label>
                        <input className={inp} value={settingsForm[f.key]}
                          onChange={e => setSettingsForm(prev => prev ? {...prev, [f.key]:e.target.value} : null)} />
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <label className={lbl}>ℹ Texto Sobre Nós</label>
                      <textarea className={inp} rows={4}
                        value={settingsForm.about}
                        onChange={e => setSettingsForm(prev => prev ? {...prev, about:e.target.value} : null)} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-[rgba(212,175,55,0.1)]">
                    <div className="text-[0.7rem] text-[#444] flex items-center gap-1.5">
                      <span className="text-[#d4af37]">⚡</span>
                      Alterações aplicadas instantaneamente no site após salvar
                    </div>
                    <button onClick={saveSettings} disabled={savingSettings}
                      className="px-6 py-2.5 text-[0.72rem] font-black tracking-[0.16em] uppercase text-[#080808] disabled:opacity-40 transition-all hover:opacity-90"
                      style={{ background:"linear-gradient(135deg,#d4af37,#b8962e)" }}>
                      {savingSettings ? "Salvando..." : "💾 Salvar e Aplicar"}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* GEMINI */}
          {tab === "gemini" && (
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
              <h1 className="text-lg font-black tracking-[0.06em] mb-6">Chat IA — Gemini</h1>

              {/* Aplicar key */}
              <div className="bg-[rgba(13,13,13,0.8)] border border-[rgba(107,181,255,0.2)] border-t-2 border-t-blue-400/50 p-6 mb-5">
                <div className="text-[0.72rem] font-bold tracking-[0.16em] uppercase text-blue-400 mb-4">⚡ Ativar Chat — Cole a chave</div>
                <div className="text-[0.8rem] text-[#555] mb-4 leading-relaxed">
                  Cole sua API Key do Gemini abaixo. A chave correta começa com <code className="bg-[rgba(255,255,255,0.06)] px-1 text-[#f0ead6]">AIzaSy...</code>
                </div>
                <div className="flex gap-3 flex-wrap mb-3">
                  <input value={geminiKey} onChange={e => setGeminiKey(e.target.value)}
                    placeholder="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                    className={inp + " flex-1 min-w-[260px] font-mono text-xs"} />
                  <button onClick={applyGeminiKey} disabled={geminiLoading}
                    className="px-5 py-2.5 text-[0.72rem] font-black tracking-[0.14em] uppercase text-[#080808] disabled:opacity-40 whitespace-nowrap"
                    style={{ background:"linear-gradient(135deg,#d4af37,#b8962e)" }}>
                    {geminiLoading ? "Testando..." : "▶ Aplicar"}
                  </button>
                </div>
                {geminiResult && (
                  <div className={`text-[0.78rem] p-3 border font-medium leading-relaxed ${
                    geminiResult.type==="ok"   ? "border-green-400/30 text-green-400 bg-green-400/05" :
                    geminiResult.type==="info" ? "border-yellow-400/30 text-yellow-400 bg-yellow-400/05" :
                                                  "border-red-400/30 text-red-400 bg-red-400/05"
                  }`}>
                    {geminiResult.text}
                  </div>
                )}
              </div>

              {/* Diagnóstico */}
              <div className="bg-[rgba(13,13,13,0.8)] border border-[rgba(212,175,55,0.1)] p-6 mb-5">
                <div className="text-[0.7rem] font-bold tracking-[0.16em] uppercase text-[#d4af37] mb-4">🔍 Como obter a chave correta</div>
                <div className="space-y-3">
                  {[
                    { n:"1", text: <>Acesse <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener" className="text-blue-400 underline">aistudio.google.com/app/apikey</a></> },
                    { n:"2", text: <>Clique em <strong className="text-[#f0ead6]">"Create API key"</strong> → selecione um projeto</> },
                    { n:"3", text: <>Copie a chave gerada — começa com <code className="bg-[rgba(255,255,255,0.06)] px-1 text-[#f0ead6]">AIzaSy...</code></> },
                    { n:"4", text: <>Cole no campo acima e clique <strong className="text-[#f0ead6]">"Aplicar"</strong></> },
                  ].map(s => (
                    <div key={s.n} className="flex items-start gap-3">
                      <div className="w-5 h-5 border border-blue-400/30 text-blue-400 text-[0.62rem] font-black flex items-center justify-center flex-shrink-0 mt-0.5">{s.n}</div>
                      <div className="text-[0.78rem] text-[#666] leading-relaxed">{s.text}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alerta quota */}
              <div className="bg-[rgba(255,184,0,0.04)] border border-yellow-400/20 p-5">
                <div className="text-[0.7rem] font-bold tracking-[0.14em] uppercase text-yellow-400 mb-2">⚠ Quota Diária</div>
                <div className="text-[0.76rem] text-[#666] leading-relaxed">
                  Se o chat mostrar "quota esgotada", a chave é válida mas o limite diário gratuito foi atingido.
                  O chat volta a funcionar automaticamente após <strong className="text-[#f0ead6]">meia-noite (horário UTC = 21h de Brasília)</strong>.
                  Isso é normal no plano gratuito do Google AI Studio.
                </div>
              </div>
            </motion.div>
          )}

        </main>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:20}}
            className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[rgba(13,13,13,0.95)] border border-[rgba(212,175,55,0.3)] border-t-2 border-t-[#d4af37] px-6 py-3 text-sm font-semibold text-[#f0ead6] shadow-2xl whitespace-nowrap">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
