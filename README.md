# Costa Barbershop 💈
**Next.js · Three.js · GSAP · Framer Motion · Lenis · Tailwind**

> Barbearia premium de Paracuru, Ceará, Brasil.

## 🚀 Deploy rápido no Vercel

1. Suba para o GitHub
2. [vercel.com](https://vercel.com) → New Project → conecta o repositório
3. *(Opcional)* Em **Environment Variables** adicione:
   ```
   GEMINI_API_KEY=AIzaSy_sua_chave
   ```
4. Deploy! ✅

## 💻 Rodar localmente

```bash
npm install
npm run dev       # http://localhost:3000
```

## 🔑 Painel Admin

Acesse: `http://localhost:3000/admin`  
Senha padrão: `costa2024`

No painel você pode:
- Ver e gerenciar agendamentos em tempo real
- Confirmar, concluir ou cancelar agendamentos
- Editar informações do site (telefone, endereço, etc.)
- Configurar a chave do Gemini AI para o chat

## 🤖 Chat IA (Gemini)

1. Acesse `http://localhost:3000/admin` → aba **Chat IA**
2. Cole sua API Key do Gemini (`AIzaSy...`)
3. Ou defina `GEMINI_API_KEY` no `.env.local` / Vercel

> Obtenha a chave em: https://aistudio.google.com/app/apikey

## 📁 Estrutura

```
app/
├── page.tsx              ← Site principal
├── admin/page.tsx        ← Painel Admin completo
├── globals.css           ← Estilos globais (glassmorphism, glow, etc.)
└── api/
    ├── appointments/     ← CRUD de agendamentos
    ├── available-slots/  ← Horários disponíveis
    ├── chat/             ← Proxy Gemini AI
    ├── settings/         ← Configurações do site
    └── admin/gemini-key/ ← Salvar key do Gemini

components/
├── HeroCanvas.tsx        ← Cena 3D (Three.js + R3F)
├── HeroSection.tsx       ← Hero com GSAP
├── Navbar.tsx            ← Navbar com Framer Motion
├── SmoothScroll.tsx      ← Lenis smooth scroll
├── CursorGlow.tsx        ← Cursor com glow dourado
└── ...demais seções

lib/db.ts                 ← In-memory store
```
