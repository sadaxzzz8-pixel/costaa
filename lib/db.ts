// ============================================================
// lib/db.ts — In-memory store para Next.js API Routes
// Em produção use um banco real (MongoDB, PostgreSQL, etc.)
// ============================================================

interface Settings {
  phone:     string;
  email:     string;
  instagram: string;
  address:   string;
  hours:     string;
  about:     string;
  whatsapp:  string;
}

interface Appointment {
  id:        string;
  name:      string;
  phone:     string;
  service:   string;
  barber:    string;
  date:      string;
  time:      string;
  status:    string;
  createdAt: string;
  pointsAwarded?: number;
}

// ── Tipagem dos globais ────────────────────────────────────
declare global {
  var __costaBarbershopDB: {
    settings:     Settings;
    appointments: Appointment[];
  } | undefined;

  // Key do Gemini salva pelo admin no painel
  var __geminiKey: string | undefined;
}

// ── Inicializa apenas uma vez (persiste entre requests no dev) ─
if (!global.__costaBarbershopDB) {
  global.__costaBarbershopDB = {
    settings: {
      phone:     "(85) 99999-9999",
      whatsapp:  "5585999999999",
      email:     "contato@costabarbershop.com.br",
      instagram: "@costabarbershop",
      address:   "Paracuru, Ceará — Brasil",
      hours:     "Seg–Sex: 8h às 20h | Sáb: 8h às 18h",
      about:     "A Costa Barbershop é referência em estilo e qualidade em Paracuru, Ceará. Nossos barbeiros são especialistas em cortes modernos e clássicos, sempre com técnica apurada e atendimento de primeira.",
    },
    appointments: [],
  };
}

export const db = global.__costaBarbershopDB!;
