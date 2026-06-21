import { NextRequest, NextResponse } from "next/server";

// Store gemini key in memory (resets on deploy — use env var for persistence)
declare global {
  var __geminiKey: string | undefined;
}

export async function POST(req: NextRequest) {
  const { apiKey } = await req.json();

  if (!apiKey || apiKey.length < 10) {
    return NextResponse.json({ error: "Chave inválida" }, { status: 400 });
  }

  // Store globally so /api/chat can access it
  global.__geminiKey = apiKey;

  return NextResponse.json({ success: true, message: "API Key salva!" });
}
