import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  return NextResponse.json(db.settings);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const allowed = ["phone","whatsapp","email","instagram","address","hours","about"] as const;

  for (const key of allowed) {
    if (body[key] !== undefined) {
      (db.settings as any)[key] = body[key];
    }
  }

  return NextResponse.json({ success: true, settings: db.settings });
}
