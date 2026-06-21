import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const ALL_SLOTS = [
  "08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30",
  "13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30",
  "17:00","17:30","18:00","18:30","19:00",
];

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, service, barber, date, time } = body;

  if (!name || !phone || !service || !barber || !date || !time) {
    return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
  }

  const conflict = db.appointments.find(
    a => a.barber === barber && a.date === date && a.time === time && a.status !== "cancelado"
  );
  if (conflict) {
    return NextResponse.json({ error: "Horário já reservado para este barbeiro" }, { status: 409 });
  }

  const appt = { id: Date.now().toString(), name, phone, service, barber, date, time, status: "pendente", createdAt: new Date().toISOString() };
  db.appointments.push(appt);

  return NextResponse.json({ success: true, appointment: appt }, { status: 201 });
}

export async function GET() {
  const sorted = [...db.appointments].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json(sorted);
}
