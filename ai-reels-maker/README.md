## AI Reels Maker

AI Reels Maker turns any script into a platform-ready vertical video for TikTok, Instagram Reels, and YouTube Shorts. It combines AI scene planning, timeline generation, voice synthesis, and motion design into a single workflow, complete with live preview, watermark control, and monetisation-ready plans.

### Tech Stack

- Next.js App Router + TypeScript
- Tailwind CSS with custom neon/glassmorphism design system
- Firebase (Auth + Firestore) client integration
- Serverless routes for AI planning + billing hand-off
- Canvas + MediaRecorder rendering pipeline with procedural audio

### Environment Variables

Copy `.env.local.example` and fill in the fields you need:

```bash
cp .env.local.example .env.local
```

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_FIREBASE_*` | Enables Firebase auth + history |
| `STRIPE_SECRET_KEY` / `STRIPE_PRICE_ID` | Activates Stripe upgrade links |
| `RAZORPAY_KEY_*` | Alternative billing provider placeholder |
| `VIDEO_STORAGE_BUCKET` | External storage destination (optional) |
| `AI_PROVIDER_API_KEY` | Connect to a real AI media provider |

Without Firebase values the studio still runs in demo mode (auth buttons point to setup docs and generations stay local).

### Development

```bash
npm install
npm run dev
```

- Home page lives at `/` with marketing + pricing overview
- The main studio is at `/dashboard`
- Pricing plans live at `/pricing`
- API endpoints:
  - `POST /api/generate-video` → builds timeline + voiceover (uses gTTS mock)
  - `POST /api/billing/create-session` → Stripe placeholder response

### Rendering Pipeline (client side)

1. Post the script + selections to `/api/generate-video`
2. Receive timeline, captions, and base64 voiceover
3. Render vertical frames on a hidden canvas with template styling
4. Procedurally generate background music based on BPM profile
5. Capture audio + canvas stream with `MediaRecorder`, export WebM
6. Persist metadata to Firestore when Firebase is connected

### Deploy

The project is optimised for Vercel. After building locally run:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-cdd0e350
```

Then verify the deployment:

```bash
curl https://agentic-cdd0e350.vercel.app
```
