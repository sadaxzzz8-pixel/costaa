import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const GEMINI_KEY    = process.env.GEMINI_API_KEY || "COLE_AQUI_AIzaSy...";
const GEMINI_MODELS = ["gemini-2.0-flash","gemini-2.0-flash-lite","gemini-2.0-flash-001"];
const GEMINI_BASE   = "https://generativelanguage.googleapis.com/v1beta/models";

export async function POST(req: NextRequest) {
  const { message, history = [] } = await req.json();
  if (!message) return NextResponse.json({ error: "Mensagem obrigatória" }, { status: 400 });

  const key = GEMINI_KEY;
  if (!key || key.includes("COLE_AQUI")) {
    return NextResponse.json({ error: "sem_key" }, { status: 503 });
  }

  const sys = `Você é o assistente virtual da Costa Barbershop, em Paracuru, Ceará, Brasil.
Informações: ${JSON.stringify(db.settings)}.
Serviços: Corte Masculino R$35 (45min, 50pts), Barba R$25 (30min, 30pts), Corte+Barba R$55 (1h15, 80pts), Pigmentação R$50 (1h, 100pts), Relaxamento R$60 (1h30, 120pts), Sobrancelha R$15 (20min, 20pts).
Barbeiros: Costa (Fundador & Master Barber), Rafael (Barber Especialista), Diego (Barber & Colorista).
Programa de fidelidade: Bronze (0-299pts), Prata (300-799pts), Ouro (800+pts). Clientes ganham pontos em cada serviço.
Responda sempre em português brasileiro, de forma simpática, descontraída e objetiva.`;

  const contents = [
    ...history.map((h: any) => ({ role: h.role, parts: [{ text: h.text }] })),
    { role: "user", parts: [{ text: message }] }
  ];

  const payload = {
    system_instruction: { parts: [{ text: sys }] },
    contents,
    generationConfig: { maxOutputTokens: 512, temperature: 0.7 }
  };

  for (const model of GEMINI_MODELS) {
    try {
      const r = await fetch(`${GEMINI_BASE}/${model}:generateContent?key=${key}`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
      });
      const d = await r.json();
      if (d.candidates?.[0]?.content?.parts?.[0]?.text) {
        return NextResponse.json({ reply: d.candidates[0].content.parts[0].text });
      }
      if (d.error?.code === 429) continue;
      if ([400, 401].includes(d.error?.code)) return NextResponse.json({ error: "key_invalida" }, { status: 401 });
    } catch { continue; }
  }

  return NextResponse.json({ error: "quota_esgotada" }, { status: 429 });
}
