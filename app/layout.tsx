import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CursorGlow }   from "@/components/CursorGlow";

export const metadata: Metadata = {
  title: "Costa Barbershop | Paracuru, Ceará — Estilo & Precisão",
  description: "Costa Barbershop é a barbearia premium de Paracuru, Ceará. Cortes masculinos, barba, pigmentação e muito mais. Agende seu horário online.",
  keywords: "barbearia paracuru, barbershop ceará, corte masculino, barba, costa barbershop",
  openGraph: {
    title: "Costa Barbershop | Paracuru, Ceará",
    description: "Referência em cortes masculinos e barba em Paracuru, CE.",
    type: "website", locale: "pt_BR",
  },
  robots: "index, follow",
};

export const viewport: Viewport = {
  themeColor: "#080808",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="bg-bg text-[#f0ead6] overflow-x-hidden">
        <SmoothScroll>
          <CursorGlow />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
