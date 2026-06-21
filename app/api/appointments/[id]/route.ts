import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body    = await req.json();

  const appt = db.appointments.find(a => a.id === id);
  if (!appt) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });

  appt.status = body.status;

  return NextResponse.json({ success: true, appointment: appt });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const idx    = db.appointments.findIndex(a => a.id === id);

  if (idx === -1) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });

  db.appointments.splice(idx, 1);
  return NextResponse.json({ success: true });
}
