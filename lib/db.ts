// In-memory DB for Next.js API routes
// (for production, replace with a real database)

interface Settings {
  phone: string; email: string; instagram: string;
  address: string; hours: string; about: string;
  whatsapp: string;
}

interface Appointment {
  id: string; name: string; phone: string;
  service: string; barber: string; date: string;
  time: string; status: string; createdAt: string;
}

const globalForDB = global as any;

if (!globalForDB.__costaBarbershopDB) {
  globalForDB.__costaBarbershopDB = {
    settings: {
      phone:     "(85) 99999-9999",
      whatsapp:  "5585999999999",
      email:     "contato@costabarbershop.com.br",
      instagram: "@costabarbershop",
      address:   "Paracuru, Ceará — Brasil",
      hours:     "Seg–Sex: 8h às 20h | Sáb: 8h às 18h",
      about:     "A Costa Barbershop é referência em estilo e qualidade em Paracuru.",
    } as Settings,
    appointments: [] as Appointment[],
  };
}

export const db = globalForDB.__costaBarbershopDB as {
  settings:     Settings;
  appointments: Appointment[];
};
