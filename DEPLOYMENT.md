# 🚀 AAROGYA AI — DEPLOYMENT GUIDE

Production deployment for a billion-dollar healthtech platform.

**Stack**: Vercel (serverless) + Supabase (Postgres + Auth + Storage) + Groq (AI)

---

## 📋 PREREQUISITES

- Node.js 18+ 
- A [Vercel](https://vercel.com) account (free tier works)
- A [Supabase](https://supabase.com) project (free tier works)
- A [Groq](https://console.groq.com) API key (free tier: 14,400 req/day)

---

## ⚡ QUICK START (15 minutes)

### 1. Supabase Setup

```bash
# Go to https://supabase.com → New Project
# Save the URL and API keys
```

1. In Supabase Dashboard → SQL Editor, paste contents of `supabase/schema.sql` and run it
2. Go to Settings → API → copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ NEVER expose to frontend)

3. Go to Storage → create bucket `xray-images` (public)

4. Go to Authentication → configure:
   - Enable Email provider
   - Optionally enable Google/Apple OAuth
   - Set your site URL in Site URL

### 2. Groq Setup

```bash
# Go to https://console.groq.com → Create API Key
# Copy it
```

Free tier: 30,000 tokens/minute, 14,400 requests/day. More than enough for thousands of users.

### 3. Local Development

```bash
cp .env.local.example .env.local
# Fill in all values in .env.local

npm install
npm run dev
```

The app runs at `http://localhost:5173` (Vite). API routes won't work locally without Vercel — use `vercel dev` for that:

```bash
npm i -g vercel
vercel dev
```

### 4. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

Or connect your GitHub repo at [vercel.com/new](https://vercel.com/new):
- Import repo
- Set environment variables (see below)
- Deploy

### 5. Environment Variables on Vercel

In Vercel Dashboard → Settings → Environment Variables, add:

| Variable | Value | Env |
|----------|-------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Production + Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJh...` | Production + Preview |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJh...` (service role) | Production + Preview |
| `GROQ_API_KEY` | `gsk_...` | Production + Preview |
| `FRONTEND_URL` | `https://your-app.vercel.app` | Production |

---

## 🏗️ ARCHITECTURE

```
┌─────────────┐     ┌───────────────────┐     ┌──────────────┐
│   Client    │────▶│  Vercel Edge      │────▶│  Supabase    │
│  (React)    │◀────│  (API Routes)     │◀────│  (Postgres)  │
└─────────────┘     └───────────────────┘     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │    Groq      │
                     │  (Llama AI)  │
                     └──────────────┘
```

**Data flow**:
1. User signs up via Supabase Auth
2. Frontend stores JWT in localStorage
3. All API calls include `Authorization: Bearer <token>`
4. API validates token, queries/inserts to Postgres (RLS enforces row ownership)
5. AI calls go to Groq, responses cached in DB
6. Usage metered in `api_usage` table

---

## 🔐 SECURITY

- ✅ Row-Level Security on all tables (users only access their data)
- ✅ Service role key never sent to client
- ✅ JWT validation on every API endpoint
- ✅ Rate limiting (20 symptom analyses/user/hour)
- ✅ CORS restricted to `FRONTEND_URL`
- ✅ Input validation with Zod (add as needed)
- ✅ AI guardrails in every prompt
- ⚠️ Add helmet.js middleware for HTTP headers
- ⚠️ Add input sanitization for user-generated text
- ⚠️ Consider HIPAA compliance for production (BAA with Supabase)

---

## 📊 COST ESTIMATES (at scale)

| Users/mo | Supabase | Groq AI | Vercel | Total/mo |
|----------|----------|---------|--------|----------|
| 1,000 | $0 (free) | $0 (free) | $0 (free) | **$0** |
| 10,000 | $25 | $0 | $0 | **$25** |
| 50,000 | $25 | $25 | $20 | **$70** |
| 100,000 | $25 | $50 | $20 | **$95** |

*Groq free tier handles ~50K users at light usage. Paid plan $0.70/M tokens.*

---

## 🧪 TESTING

```bash
# Test auth flow
curl -X POST https://your-project.supabase.co/auth/v1/signup \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123456"}'

# Test API endpoint
curl -X POST https://your-app.vercel.app/api/ai/symptom \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{"message":"I have had a headache for 3 days"}'
```

---

## 🔄 CI/CD

Automatic deploys on push to `main`:

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 🚨 MONITORING

- **Supabase Dashboard** → Logs (API + Database)
- **Vercel Dashboard** → Function logs + analytics
- **Groq Console** → Token usage + rate limits
- Add Sentry for error tracking: `npm i @sentry/nextjs`
- Add PostHog for product analytics: `npm i posthog-js`

---

## 📈 SCALING PATH

**Phase 1** (0-10K users): Stack above. Free tier handles it.

**Phase 2** (10K-100K users): 
- Upgrade Supabase to Pro ($25/mo)
- Move AI to dedicated Groq plan
- Add Redis cache (Upstash) for rate limiting
- Add CDN for images

**Phase 3** (100K+ users):
- Dedicated Postgres (Supabase Dedicated)
- Fine-tune Llama model on Indian health data
- Custom inference infrastructure (RunPod/Together)
- HIPAA-compliant deployment

---

## 🎯 NEXT STEPS

1. ✅ Deploy schema to Supabase
2. ✅ Set environment variables
3. ✅ Deploy to Vercel
4. ⏳ Wire frontend to real APIs (replace localStorage)
5. ⏳ Add user auth UI (signup/login screens)
6. ⏳ Add file upload for lab reports (image → text via Groq Vision)
7. ⏳ Add real doctor network (API integration with Practo/1mg)
8. ⏳ Add push notifications (OneSignal)
9. ⏳ Add payment (Razorpay) for premium features
10. ⏳ Add WhatsApp integration (most Indian users prefer WhatsApp)

---

## 📞 SUPPORT

For deployment issues:
- Vercel docs: https://vercel.com/docs
- Supabase docs: https://supabase.com/docs
- Groq docs: https://console.groq.com/docs

For AI behavior tuning:
- Edit prompt templates in `backend/lib/ai.ts`
- Adjust temperature (lower = more deterministic, higher = more creative)
- Test with edge cases before deploying

---

**Built with care for Indian healthcare.** 🇮🇳
