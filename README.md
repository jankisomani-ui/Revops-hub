# RevOps Hub — CertifyOS

Internal revenue operations tool suite. One Next.js app, five screens, one Vercel deployment.

## Screens

| Route | Tool | Status |
|---|---|---|
| `/` | Home — tool directory | Live |
| `/jarvis` | Sales Jarvis — Ask Anything | Live |
| `/command-center` | Sales Leader Command Center | Links to Engine 1 deploy |
| `/rfp` | RFP Assistant | Links to RFP deploy |
| `/roi` | ROI Model Builder | Links to ROI deploy |
| `/journey` | Journey Coverage map | Live |

## Setup

```bash
cp .env.example .env.local
# fill in webhook URLs and Vercel deploy URLs

npm install
npm run dev
```

## Deploy

Push to `main` → Vercel auto-deploys if repo is connected.

Add all `.env.example` keys in Vercel → Settings → Environment Variables.

## Architecture

- **Salesforce and Gong are read-only** in every connected workflow
- Sales Jarvis calls an n8n webhook — n8n handles all data reads
- Command Center, RFP, and ROI link out to their existing Vercel deploys
- No writes to Salesforce or Gong from any screen in this app
