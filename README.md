# Twyne Academy

Professionelle E-Learning Plattform mit Zertifikaten, Abonnements und mehrsprachiger Unterstützung.

## Tech-Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Sprache**: TypeScript (strict)
- **Styling**: Tailwind CSS v4 (CSS-native)
- **Datenbank**: PostgreSQL via Prisma ORM v7
- **Auth**: NextAuth v5 (Google + Magic Link)
- **Zahlungen**: Stripe
- **Storage**: Cloudflare R2 (S3-kompatibel)
- **E-Mail**: Resend
- **PDF**: React PDF (@react-pdf/renderer)
- **i18n**: next-intl (DE / EN / FR)
- **State**: TanStack Query v5

## Setup

### 1. Dependencies installieren

```bash
npm install
```

### 2. Umgebungsvariablen konfigurieren

```bash
cp .env.example .env.local
```

Folgende Werte müssen befüllt werden:
- `DATABASE_URL` — Neon PostgreSQL Connection String
- `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` — Google OAuth (console.cloud.google.com)
- `RESEND_API_KEY` — Resend E-Mail API (resend.com)
- `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` + `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe Dashboard
- `R2_ACCOUNT_ID` + `R2_ACCESS_KEY_ID` + `R2_SECRET_ACCESS_KEY` — Cloudflare R2
- `AUTH_SECRET` — beliebiger langer String (z.B. `openssl rand -base64 32`)

### 3. Datenbank aufsetzen

```bash
npm run db:push     # Schema in Datenbank pushen
npm run db:studio   # Datenbank im Browser öffnen
```

### 4. Entwicklungsserver starten

```bash
npm run dev
```

Öffne http://localhost:3000 — wird automatisch auf /de weitergeleitet.

## Ordnerstruktur

```
src/
├── app/
│   ├── [locale]/
│   │   ├── (public)/     # Landing, Kurse, Preise, Login
│   │   ├── (nutzer)/     # Dashboard, Profil, Lernen (Auth-geschützt)
│   │   └── (admin)/      # Admin-Bereich (nur ADMIN Role)
│   └── api/              # API-Routes (fortschritt, stripe, admin)
├── components/
│   ├── layout/           # Navbar, Footer, Sidebar, Providers
│   ├── kurs/             # LessonPlayer, Quiz, Code, PDF, Audio, Video
│   ├── zertifikat/       # PDF-Template
│   └── ui/               # Button, Card, Badge, Input, Modal, Toast
├── lib/                  # Prisma, Auth, Stripe, R2, E-Mail, Zugriffskontrolle
├── i18n/                 # de.json, en.json, fr.json
├── types/                # TypeScript Types
└── hooks/                # useAuth, useProgress
```

## Lektionstypen

| Typ   | Beschreibung                            |
|-------|-----------------------------------------|
| TEXT  | Markdown-Inhalt                         |
| QUIZ  | Multiple Choice + Lückentext            |
| CODE  | Monaco Editor mit Code-Ausführung       |
| PDF   | Dokumenten-Viewer (kein Download)       |
| AUDIO | Custom Audio-Player mit Transkript      |
| VIDEO | YouTube-Embed                           |

## Zugangstypen

| Typ          | Beschreibung                          |
|--------------|---------------------------------------|
| FREE         | Öffentlich zugänglich                 |
| PAID         | Einmaliger Kauf erforderlich          |
| SUBSCRIPTION | Aktives Abo erforderlich              |
| TRIAL        | Probe-Zugang mit Ablaufdatum          |
