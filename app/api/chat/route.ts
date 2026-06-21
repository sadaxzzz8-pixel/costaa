import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// ── Configuração Gemini ─────────────────────────────────────
// Usa a key do env var, ou a key salva pelo admin via /api/admin/gemini-key
// Endpoint e modelo exatos do curl fornecido:
//   curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent"
//     -H 'X-goog-api-key: AQ.Ab8RN6...'
//
// Nota: chaves "AQ.Ab8R..." são tokens OAuth temporários (~1h).
//       Se expirar, o admin deve colar uma nova no painel.
//       Para persistência, use GEMINI_API_KEY no .env do Vercel.

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

// Modelos em ordem de prioridade (fallback automático se quota esgotar)
const GEMINI_MODELS = [
  "gemini-flash-latest",      // modelo do curl do usuário
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash-001",
];

function getActiveKey(): string | null {
  // 1. Env var (mais confiável para produção)
  if (process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes("COLE_AQUI")) {
    return process.env.GEMINI_API_KEY;
  }
  // 2. Key salva pelo admin no painel
  if (global.__geminiKey) {
    return global.__geminiKey;
  }
  return null;
}

export async function POST(req: NextRequest) {
  const { message, history = [] } = await req.json();

  if (!message) {
    return NextResponse.json({ error: "Mensagem obrigatória" }, { status: 400 });
  }

  const key = getActiveKey();
  if (!key) {
    return NextResponse.json({ error: "sem_key" }, { status: 503 });
  }

  // System prompt com contexto completo da barbearia
  const systemPrompt = `Você é o assistente virtual da Costa Barbershop, localizada em Paracuru, Ceará, Brasil.

Informações da barbearia:
- Telefone/WhatsApp: ${db.settings.phone}
- Instagram: ${db.settings.instagram}
- Endereço: ${db.settings.address}
- Horário: ${db.settings.hours}

Serviços e preços:
- Corte Masculino: R$35 (45 min) → 50 pontos de fidelidade
- Barba: R$25 (30 min) → 30 pontos
- Corte + Barba: R$55 (1h 15min) → 80 pontos
- Pigmentação: R$50 (1h) → 100 pontos
- Relaxamento: R$60 (1h 30min) → 120 pontos
- Sobrancelha: R$15 (20 min) → 20 pontos

Barbeiros: Costa (Fundador & Master Barber), Rafael (Barber Especialista), Diego (Barber & Colorista).

Programa de fidelidade: Bronze (0-299 pts) → Prata (300-799 pts) → Ouro (800+ pts).

Responda SEMPRE em português brasileiro, de forma simpática, descontraída e objetiva.
Quando perguntarem sobre preços, seja direto. Incentive o agendamento online.`;

  // Monta histórico para manter contexto da conversa
  const contents = [
    ...history.map((h: { role: string; text: string }) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.text }],
    })),
    { role: "user", parts: [{ text: message }] },
  ];

  const payload = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: { maxOutputTokens: 512, temperature: 0.7 },
  };

  // Tenta cada modelo em ordem (fallback automático)
  for (const model of GEMINI_MODELS) {
    try {
      const response = await fetch(`${GEMINI_BASE}/${model}:generateContent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": key,          // header exato do curl fornecido
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      // ✅ Sucesso
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return NextResponse.json({
          reply: data.candidates[0].content.parts[0].text,
        });
      }

      const errStatus = data.error?.status;
      const errCode   = data.error?.code;

      // Quota esgotada → tenta próximo modelo
      if (errCode === 429 || errStatus === "RESOURCE_EXHAUSTED") {
        console.warn(`⚠ Quota esgotada [${model}], tentando próximo...`);
        continue;
      }

      // Key inválida/expirada → para imediatamente
      if (errCode === 401 || errStatus === "UNAUTHENTICATED") {
        return NextResponse.json({ error: "key_invalida" }, { status: 401 });
      }

      // Acesso negado ao modelo específico → tenta próximo
      if (errStatus === "PERMISSION_DENIED") {
        console.warn(`⚠ PERMISSION_DENIED [${model}], tentando próximo...`);
        continue;
      }

      // Outro erro → tenta próximo
      console.warn(`⚠ Erro [${model}]:`, errStatus, data.error?.message?.slice(0, 80));
      continue;

    } catch (err) {
      console.error(`Erro de rede [${model}]:`, err);
      continue;
    }
  }

  // Todos os modelos falharam por quota
  return NextResponse.json({ error: "quota_esgotada" }, { status: 429 });
}
