import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const ALL_SLOTS = [
  "08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30",
  "13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30",
  "17:00","17:30","18:00","18:30","19:00",
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date   = searchParams.get("date")   || "";
  const barber = searchParams.get("barber") || "";

  const booked = db.appointments
    .filter(a => a.date === date && a.barber === barber && a.status !== "cancelado")
    .map(a => a.time);

  return NextResponse.json(ALL_SLOTS.filter(s => !booked.includes(s)));
}
