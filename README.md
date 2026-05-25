# 🧭📍 WanderWall

> *Wander through events. Wall‑to‑wall discovery.*

WanderWall is a branded, production-ready event-discovery platform built for Indian students. It combines a living, corkboard-style bulletin wall with first-class KTU Activity Points support, Razorpay (UPI/Cards) payments, and Google OAuth — filling the gap no existing platform covers.

---

## 📸 Screenshots

> **Note:** Replace the placeholder references below with real screenshots once the app is deployed.  
> Take screenshots at 1280 × 800 and save them in `public/screenshots/`.

| View | Screenshot |
|---|---|
| The Wall (Home) | `public/screenshots/wall.png` |
| Event Detail | `public/screenshots/event-detail.png` |
| Submit Event | `public/screenshots/submit.png` |
| Admin Dashboard | `public/screenshots/admin.png` |
| Advertise / Boost | `public/screenshots/advertise.png` |
| Profile & Onboarding | `public/screenshots/profile.png` |
| Vercel Dashboard | `public/screenshots/vercel-overview.png` |
| Vercel Env Vars | `public/screenshots/vercel-env.png` |
| Razorpay Dashboard | `public/screenshots/razorpay-dashboard.png` |
| Razorpay Webhook | `public/screenshots/razorpay-webhook.png` |

---

## 🚀 Quick Start

```bash
git clone https://github.com/djmahe4/wanderwall.git
cd wanderwall
npm install
cp .env.local.example .env.local   # fill in your keys (see below)
npm run dev                         # http://localhost:3050
```

---

## ⚙️ Environment Variables

Copy `.env.local.example` to `.env.local` and fill in every value:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web app API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firestore project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | FCM sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Full JSON of your service account key (one line) |
| `RAZORPAY_KEY_ID` | Razorpay live/test key ID |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Same key (exposed to client for checkout) |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay webhook secret |
| `ADVERTISEMENT_PRICE_INR` | Sponsorship price in INR (default `499`) |
| `ADMIN_UIDS` | Comma-separated Firebase UIDs with admin access |
| `NEXT_PUBLIC_APP_URL` | Deployed URL, e.g. `https://wanderwall.vercel.app` |
| `NEXT_PUBLIC_APP_NAME` | App name shown in UI |
| `TRUSTED_AUTO_APPROVE` | Set `true` to auto-approve posts from Trusted Contributors |

---

## 🔥 Firebase Setup

### 1. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com).
2. Click **Add project**, give it a name.

### 2. Enable Authentication

1. **Authentication → Sign-in method → Google** → Enable.
2. Add your deploy domain (e.g. `wanderwall.vercel.app`) to **Authorized domains**.

### 3. Create Firestore Database

1. **Firestore Database → Create database → Production mode**.
2. Region: `asia-south1` (Mumbai) for Indian traffic.

### 4. Deploy Firestore Rules & Indexes

```bash
npm install -g firebase-tools
firebase login
firebase use --add          # select your project
firebase deploy --only firestore:rules,firestore:indexes
firebase deploy --only storage
```

### 5. Get Service Account Key

1. **Project Settings → Service accounts → Generate new private key**.
2. Stringify to one line:
   ```bash
   node -e "console.log(JSON.stringify(require('./your-key.json')))"
   ```
3. Paste the result into `FIREBASE_SERVICE_ACCOUNT_KEY`.

---

## 💳 Razorpay Setup

1. Sign up at [razorpay.com](https://razorpay.com).
2. **Settings → API Keys → Generate Key** → copy Key ID and Key Secret.
3. Set `RAZORPAY_KEY_ID`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`, and `RAZORPAY_KEY_SECRET`.

### Configure Webhook

1. **Settings → Webhooks → Add New Webhook**.
2. **URL:** `https://wanderwall.vercel.app/api/payments/webhook`
3. **Secret:** generate a random string → `RAZORPAY_WEBHOOK_SECRET`
4. **Events:** ✅ `order.paid` &nbsp; ✅ `payment.captured`

> **Screenshot:** Add a screenshot of your Razorpay webhook configuration at  
> `public/screenshots/razorpay-webhook.png`

---

## ▲ Vercel Deployment

1. Push code to GitHub.
2. [vercel.com/new](https://vercel.com/new) → **Import** the `wanderwall` repo.
3. Framework: **Next.js** (auto-detected). Root: `/`.
4. **Project Settings → Environment Variables** — add all variables from the table above.
   > **Tip:** Paste `FIREBASE_SERVICE_ACCOUNT_KEY` as a single-line JSON string.
5. **Deploy** (takes ~2 min for first build).

### Post-Deploy Checklist

- [ ] Add `wanderwall.vercel.app` to Firebase **Authorized domains**.
- [ ] Set Razorpay webhook URL to `https://wanderwall.vercel.app/api/payments/webhook`.
- [ ] Run `firebase deploy --only firestore:indexes`.
- [ ] Set at least one Firebase UID in `ADMIN_UIDS`.

> **Screenshots:** Add Vercel project overview and env-vars screenshots at  
> `public/screenshots/vercel-overview.png` and `public/screenshots/vercel-env.png`

---

## 🧪 Running Tests

```bash
# Unit & integration tests (Vitest)
npm test

# Watch mode
npm run test:watch

# End-to-end tests (Playwright — requires running dev server)
npm run dev &
npm run test:e2e
```

---

## 🗂️ Project Structure

```
wanderwall/
├── app/                    # Next.js App Router pages & API routes
│   ├── page.js             # The Wall (home)
│   ├── event/[id]/         # Event detail
│   ├── submit/             # Submit event form
│   ├── profile/            # User profile
│   ├── admin/              # Admin dashboard
│   ├── advertise/          # Boost/sponsor events
│   ├── onboarding/         # First-time user onboarding
│   └── api/                # API routes (events, users, admin, payments)
├── components/             # React components
│   ├── layout/             # Navbar, Footer, Container
│   ├── wall/               # MasonryGrid, PosterCard, FilterBar
│   ├── event/              # EventDetailHero, KtuPointsPill, SponsoredRibbon
│   ├── forms/              # EventSubmissionForm, ProfileEditor
│   ├── admin/              # PendingQueue, EventTable
│   ├── ui/                 # Button, Modal, Toast, Badge, Skeleton, TagChip
│   └── AuthProvider.jsx
├── hooks/                  # useAuth, useEvents, useDebounce
├── lib/                    # firebase.js, firebaseAdmin.js, razorpay.js,
│   │                       # authHelpers.js, validators.js, constants.js,
│   │                       # utils.js, serializers.js
├── tests/
│   ├── unit/               # Vitest unit tests
│   ├── integration/        # Vitest integration tests (API routes)
│   └── e2e/                # Playwright end-to-end tests
├── public/
│   ├── textures/           # Corkboard background texture
│   ├── screenshots/        # ← add your screenshots here
│   ├── logo.svg            # Compass-pin logo
│   └── manifest.json       # PWA manifest
├── firestore.rules         # Firestore security rules
├── firestore.indexes.json  # Firestore composite indexes
├── storage.rules           # Firebase Storage rules
├── tailwind.config.js      # WanderWall colour tokens
└── .env.local.example      # Environment variable template
```

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **KTU Activity Points** | First-class filter by points + coloured category pills (7 official segments) |
| **Corkboard Wall UX** | CSS masonry grid with subtle poster rotations, drop-shadow pins |
| **Wander Mode** | Organic scattered layout toggle for serendipitous discovery |
| **Free + Paid Tiers** | Free (admin-approved) + ₹499/30-day Featured placement |
| **Trusted Contributors** | Auto-approve reputable users after 5+ approved posts |
| **WanderScore** | Personalisation algorithm sorts events by your interests |
| **Razorpay** | UPI, cards, custom checkout (India-native) |
| **Phone Verification** | Indian number validation on all submissions |
| **Admin Dashboard** | One-click approve/reject queue with optional rejection reason |
| **PWA-ready** | Web app manifest for Add to Home Screen on student phones |

---

## 📖 Scripts Reference

| Script | Description |
|---|---|
| `npm run dev` | Start dev server on http://localhost:3050 |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit & integration tests |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:e2e` | Playwright end-to-end tests |

---

## 📄 License

MIT
