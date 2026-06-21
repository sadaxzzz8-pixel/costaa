# Costa Barbershop 💈

Site premium da Costa Barbershop — Paracuru, Ceará, Brasil.

## Stack
- **Next.js 16** (App Router)
- **Three.js + React Three Fiber** (cenas 3D)
- **GSAP** (animações avançadas)
- **Lenis** (smooth scroll)
- **Framer Motion** (microinterações)
- **Tailwind CSS** (estilização)

## Rodar localmente

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

## Deploy no Vercel

1. Suba para o GitHub
2. Conecte o repositório no [vercel.com](https://vercel.com)
3. Deploy automático!

## Variáveis de ambiente (opcional)

Crie `.env.local` na raiz:

```env
GEMINI_API_KEY=AIzaSy...
```

## Painel Admin

Acesse `/admin` para gerenciar agendamentos.

## Estrutura

```
costa-next/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── api/
│       ├── appointments/
│       ├── available-slots/
│       ├── chat/
│       └── settings/
├── components/
│   ├── SmoothScroll.tsx
│   ├── CursorGlow.tsx
│   ├── Navbar.tsx
│   ├── HeroCanvas.tsx    ← Three.js 3D
│   ├── HeroSection.tsx
│   ├── MarqueeBar.tsx
│   ├── ServicesSection.tsx
│   ├── BarbersSection.tsx
│   ├── BookingSection.tsx
│   ├── LoyaltySection.tsx
│   ├── TestimonialsSection.tsx
│   ├── AboutSection.tsx
│   ├── Footer.tsx
│   ├── ChatWidget.tsx
│   └── WhatsAppButton.tsx
└── lib/
    └── db.ts
```
