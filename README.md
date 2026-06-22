# 🏥 AAROGYA AI

**India's first full-stack AI healthcare platform.**

From symptom triage to lab report analysis, X-ray reading to predictive health — one platform, 11 Indian languages, powered by Llama 3.3 + ICMR data.

![Build](https://img.shields.io/badge/build-passing-10b981)
![License](https://img.shields.io/badge/license-MIT-blue)
![Stack](https://img.shields.io/badge/stack-React%20%7C%20Vercel%20%7C%20Supabase%20%7C%20Groq-6366f1)

---

## 🎯 Features

### AI-Powered Diagnostics
- **Symptom Checker** — Clinical triage with ICMR epidemiology data (350+ symptoms)
- **Lab Report Analyzer** — Parse any lab report, get bilingual (EN/HI) insights
- **X-Ray Reader** — Vision model analyzes radiographs with structured findings
- **Predictive Analytics** — See your health 6/12/24 months ahead

### Wellness Suite
- **Aarogya AI Companion** — 24/7 conversational health coach
- **Calm Mind** — Mental wellness with breathing exercises
- **Ayurveda Intelligence** — Dosha analysis + herbal recommendations (BhashaBench-Ayur)
- **Food & Nutrition Scanner** — Indian food database with macro + Ayurvedic wisdom

### Healthcare Access
- **Telehealth Booking** — Video consults with 5 partner labs' networks
- **Regional Doctor Finder** — 2011 Census PHC data + 50+ cities
- **Senior Citizens Care** — GOI Integrated Programme data
- **Diet Planner** — AI-personalized meal plans

### Data & Privacy
- **End-to-end encrypted** health records
- **HIPAA-aligned** data model with Row-Level Security
- **User-owned data** — export anytime
- **Zero data selling** — privacy-first architecture

---

## 🏗️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | React 18 + TypeScript + Vite | Fast, type-safe, excellent DX |
| **Styling** | Tailwind CSS v4 | Utility-first, premium design system |
| **Backend** | Vercel Serverless Functions | Zero-config deployment |
| **Database** | Supabase (PostgreSQL) | Free tier generous, RLS built-in |
| **Auth** | Supabase Auth | JWT + OAuth + magic links |
| **Storage** | Supabase Storage | X-ray image hosting |
| **AI Inference** | Groq (Llama 3.3 70B) | 3x faster than OpenAI, free tier |
| **Vision AI** | Llama 3.2 Vision | X-ray analysis |
| **Hosting** | Vercel Edge | Global CDN, instant deploys |

---

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/your-org/aarogya-ai
cd aarogya-ai

# 2. Install
npm install

# 3. Setup environment
cp .env.local.example .env.local
# Fill in Supabase + Groq keys (see DEPLOYMENT.md)

# 4. Run database migrations
# Paste supabase/schema.sql into Supabase SQL Editor

# 5. Start development
npm run dev
```

Visit `http://localhost:5173` — you're live.

---

## 📊 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT (React)                      │
│   Dashboard · AI Chat · Symptom · Lab · X-Ray · Diet    │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS + JWT
                       ▼
┌─────────────────────────────────────────────────────────┐
│              VERCEL SERVERLESS (API Routes)              │
│  /api/ai/* · /api/health/* · /api/auth/*                │
└───┬──────────────────────────────┬──────────────────────┘
    │                              │
    ▼                              ▼
┌──────────────────┐    ┌──────────────────────┐
│   SUPABASE       │    │      GROQ            │
│   (Postgres)     │    │   (Llama 3.3 70B)    │
│  · Users         │    │  · Symptom Analysis  │
│  · Metrics       │    │  · Lab Parsing       │
│  · Reports       │    │  · X-Ray Vision      │
│  · Appointments  │    │  · Chat              │
└──────────────────┘    └──────────────────────┘
```

---

## 📁 Project Structure

```
aarogya-ai/
├── api/                     # Vercel serverless functions
│   ├── ai/
│   │   ├── symptom.ts       # Symptom triage endpoint
│   │   ├── lab-report.ts    # Lab analysis endpoint
│   │   ├── chat.ts          # General chat endpoint
│   │   └── xray.ts          # X-ray analysis endpoint
│   ├── auth/
│   │   └── me.ts            # User profile endpoint
│   └── health/
│       ├── metrics.ts       # Health metrics CRUD
│       └── appointments.ts  # Appointment booking
├── backend/
│   └── lib/
│       ├── ai.ts            # AI service (Groq + prompts)
│       └── supabase.ts      # Supabase admin client
├── src/
│   ├── components/          # 23 React components
│   ├── data/                # Biomarker DB, predictive models
│   ├── lib/
│   │   └── api.ts           # Frontend API client
│   └── types.ts             # TypeScript types
├── supabase/
│   └── schema.sql           # Full database schema + RLS
├── public/
│   └── images/              # Static assets
├── DEPLOYMENT.md            # Production deployment guide
└── .env.local.example       # Environment template
```

---

## 🗄️ Database Schema

**11 core tables** with Row-Level Security:

| Table | Records (est.) | Purpose |
|-------|----------------|---------|
| `profiles` | 1 per user | Extended auth profile |
| `health_metrics` | 100s/user | Daily vitals tracking |
| `symptom_sessions` | 50s/user | AI symptom chat history |
| `symptom_messages` | 1000s/user | Individual chat messages |
| `lab_reports` | 10s/user | Parsed lab results |
| `appointments` | 20s/user | Doctor bookings |
| `health_profiles` | 5s/user | AI-generated health summaries |
| `mood_logs` | 100s/user | Mental health tracking |
| `diet_plans` | 5s/user | Personalized meal plans |
| `xray_analyses` | 10s/user | Radiology AI findings |
| `api_usage` | 1000s/user | Rate limiting + analytics |
| `doctors` | Public | Doctor directory |

See `supabase/schema.sql` for full DDL, indexes, and security policies.

---

## 🤖 AI Models

| Feature | Model | Provider | Cost |
|---------|-------|----------|------|
| Symptom analysis | Llama 3.3 70B | Groq | Free tier |
| Lab report parsing | Llama 3.3 70B | Groq | Free tier |
| General chat | Llama 3.3 70B | Groq | Free tier |
| X-ray vision | Llama 3.2 11B Vision | Groq | Free tier |
| Risk prediction | Custom scoring engine | Local | $0 |

All models run with **structured JSON output** and **clinically-grounded system prompts** trained on:
- ICMR-INDIAB study (Indian diabetes prevalence)
- PURE India study (cardiovascular risk)
- NFHS-5 (national family health survey)
- BhashaBench-Ayur (14,963 Ayurvedic Q&A)
- LabQAR dataset (550 reference ranges)

---

## 🔒 Security

- **JWT authentication** on every API endpoint
- **Row-Level Security** — users only see their own data
- **CORS restricted** to configured frontend domain
- **Rate limiting** per user (20 symptom analyses/hour)
- **Service role key** never exposed to client
- **Input validation** on all endpoints
- **Prompt guardrails** prevent harmful AI behavior
- **Audit trail** via `api_usage` table

---

## 📈 Performance

- **TTFC (Time to First Chat)**: <800ms (Groq is 3x faster than OpenAI)
- **Lab report analysis**: 2-3 seconds for 50+ biomarkers
- **X-ray analysis**: 3-4 seconds with structured JSON
- **Dashboard load**: <1s (fully client-side after hydration)
- **Bundle size**: 1.23 MB (320 KB gzipped)
- **Lighthouse**: 95+ on all metrics

---

## 🌍 Indian Healthcare Focus

Why Aarogya AI is built for India:

1. **11 Indian languages** support (Hindi, Tamil, Telugu, Bengali, etc.)
2. **Indian reference ranges** (ICMR studies, not Western norms)
3. **Indian diet context** (bajra, jowar, ragi, karela, methi)
4. **Ayurveda integration** (BhashaBench-Ayur benchmark)
5. **GOI scheme data** (Integrated Programme for Older Persons)
6. **Regional doctor network** (2011 Census PHC data)
7. **Affordable pricing** (starts at ₹0, premium ₹499/mo)
8. **WhatsApp-ready** architecture (most Indian users prefer WhatsApp)

---

## 📝 Data Sources & Credits

| Dataset | Source | License |
|---------|--------|---------|
| Heart Disease (1,888 records) | Kaggle | CC BY 4.0 |
| Pima Indians Diabetes (768 records) | NIDDK | Public Domain |
| Indian Liver Patient (583 records) | Kaggle | CC BY 4.0 |
| Chronic Kidney Disease (400 records) | Kaggle | CC BY 4.0 |
| Breast Cancer Wisconsin (569 records) | UCI | CC BY 4.0 |
| LabQAR (550 reference ranges) | U Florida/NIH | Open Access |
| ICMR Clinical Lab Intervals | ICMR/PMC | Open Access |
| BhashaBench-Ayur (14,963 Q&A) | BharatGen | CC BY 4.0 |
| PHC Manpower 2011 | MoHFW/IndiaAI | Open Govt License |
| Older Persons Grant Data | IndiaAI | Open Govt License |
| COIL-D Health v2 | BHASHINI Division | CC BY 4.0 |
| BiomedVLP-CXR-BERT | Microsoft | MIT |
| BiomedCLIP-PubMedBERT | Microsoft | MIT |
| Bhashini-IndicNER | AI4Bharat | MIT |

---

## 📄 License

MIT © 2026 Aarogya AI

Built with ❤️ for Indian healthcare.

---

## 🙏 Acknowledgments

- **Microsoft Research** for BiomedVLP and BiomedCLIP
- **AI4Bharat / IIT Madras** for Bhashini-IndicNER
- **BharatGen** for BhashaBench-Ayur
- **ICMR** for Indian clinical reference data
- **Groq** for fast, affordable AI inference
- **Supabase** for generous free tier

---

**"Healthcare is a right, not a privilege."** — Let's make it accessible to every Indian. 🇮
