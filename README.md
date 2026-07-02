# Antidote+ — AI Snakebite Emergency Network

A mobile-first app for rural India that gets a snakebite victim to **treatment**
fast. The differentiator: it routes the victim not to the *nearest* facility, but
to the nearest facility that **actually has anti-snake-venom (ASV) in stock** —
and it monitors symptoms along the way so the receiving hospital is ready.

Trilingual (తెలుగు · हिंदी · English, default Telugu), offline-resilient, and
designed at 430px for the phones people actually carry.

---

## Demo flow (one unbroken loop)

> Tap **"I've been bitten"** → read **First aid** (no tourniquet, immobilise) →
> *(optional)* snake photo → start the **Severity tracker**, mark *blurred
> vision* so severity rises to **severe** → tap **Find antivenom now** → the
> **Routing** screen sends you past the empty PHC to the District Hospital with
> 30 vials → **SOS** relays your worsening symptoms and "42 min since bite"
> ahead → flip to the **Hospital view**: it already shows *"Incoming · severe ·
> prepare 10 ASV."* For the finale, drop signal mid-flow to show the **offline
> banner** keep everything running.

Prevention lives separately behind **Home → Learn** (the high-risk indicator),
never in the victim's emergency path.

---

## What's new in V2

The differentiators are no longer mocked — they run on real data and real device
APIs:

- **Live antivenom stock feed.** The routing engine now reads a real, timestamped
  inventory from the backend (`GET /api/hospitals`), not a hardcoded array. It
  degrades gracefully: **live → cached → seeded**, with a source badge on the
  routing screen so it's honest about where the number came from. Hospital staff
  / ASHA workers update stock and beds from **Home → Hospital staff** (`/stock`),
  and the change feeds the victim's routing instantly (`POST /api/hospitals/{id}/stock`).
- **Real SOS.** The family alert now opens the device **SMS composer** prefilled
  with symptoms + a tappable **Google Maps location link**, and offers **one-tap
  calling** — texting every saved contact at once. The offline queue and live
  coordination timeline are unchanged.
- **Multiple emergency contacts.** Save several family members, set a primary,
  one-tap call each, and **share live location** via the native share sheet.
- **Hospital intelligence.** Filter alternative facilities by **ICU · beds ·
  govt/private** on the routing screen.
- **Installable PWA.** Web build ships a manifest + offline service worker, so it
  installs to the home screen and opens with no signal after the first visit.
- **Live GPS navigation on a real map** (Leaflet + OSRM) and a durable, resumable
  offline session (IndexedDB) carried over from the earlier V2 work.

---

## Tech stack

| Layer    | Choice |
|----------|--------|
| Frontend | React 18 + Vite + Tailwind CSS + `lucide-react` + `react-router-dom` v6 |
| State    | One lightweight React Context (`EmergencyContext`) — no Redux/Zustand |
| Backend  | Thin FastAPI service (Python) — proxies Gemini, nothing else |
| AI       | Google **Gemini 1.5 Flash** (vision for snake ID, text for the handover summary) |
| Persist  | `localStorage` (offline survival) on the client; **no database** |

---

## Project structure

```
Antidote+/
├── index.html                  # Vite entry (Telugu default, safe-area viewport)
├── package.json                # Frontend deps + scripts
├── vite.config.js              # Dev server + /api → :8000 proxy
├── tailwind.config.js          # Frame width token, content globs
├── src/
│   ├── main.jsx                # BrowserRouter → EmergencyProvider → App
│   ├── App.jsx                 # Routes (lazy) + Shell layout + full-bleed routing
│   ├── index.css               # Base, focus rings, reduced-motion, safe-area
│   ├── theme.js                # `C` palette + severity tokens (shared)
│   ├── i18n.js                 # `T` trilingual strings (shared)
│   ├── context/
│   │   └── EmergencyContext.jsx# §3 shared-state contract + persistence
│   ├── hooks/
│   │   └── useOnline.js        # Connectivity (banner + cached states)
│   ├── lib/
│   │   ├── api.js              # /api/identify + /api/summarize (graceful)
│   │   ├── handover.js         # composeSummary, alert message, vials
│   │   └── risk.js             # Transparent risk model (no AI)
│   ├── components/
│   │   ├── Shell.jsx           # 430px frame + top bar + bottom nav + banner
│   │   ├── TopBar.jsx          # Header + తె/हि/EN language toggle
│   │   ├── BottomNav.jsx       # Emergency · Tracker · SOS · Help
│   │   ├── OfflineBanner.jsx   # Honest offline banner
│   │   └── Placeholder.jsx     # (dev) holding screen for unbuilt routes
│   └── pages/
│       ├── Home.jsx            # Landing + GPS capture + Learn entry
│       ├── FirstAid.jsx        # DO/DON'T + live time-since-bite
│       ├── Snake.jsx           # Optional photo → /api/identify (safe default)
│       ├── Tracker.jsx         # 15-min monitoring loop (medical core)
│       ├── Routing.jsx         # HERO — stock-aware routing (reads context)
│       ├── SOS.jsx             # Family/hospital alert (simulated, queued)
│       ├── Hospital.jsx        # Read-only incoming-patient view
│       └── Learn.jsx           # High-risk indicator (prevention)
├── Antidoteplus_routing.jsx    # Original routing reference (superseded by src/pages/Routing.jsx)
└── backend/
    ├── requirements.txt
    ├── .env.example            # Placeholders only — copy to .env
    └── app/
        ├── main.py             # FastAPI app, CORS, router wiring
        ├── config.py           # Settings (GEMINI_API_KEY server-side only)
        ├── logging_config.py   # Structured JSON logging
        ├── models.py           # Pydantic request/response models
        ├── routes/             # health · identify · summarize
        └── services/
            └── gemini.py       # Gemini client + safe fallbacks
```

---

## Setup

### Prerequisites
- Node.js 18+
- Python 3.10–3.12 (3.13+ may lack wheels for some deps)

### 1. Frontend
```bash
npm install
npm run dev          # http://localhost:5173
```

### 2. Backend (optional — the app runs without it via safe fallbacks)
```bash
cd backend
python -m venv .venv
# Windows:  .\.venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env            # then paste your GEMINI_API_KEY (optional)
uvicorn app.main:app --reload --port 8000
```

The Vite dev server proxies `/api/*` to `http://localhost:8000`, so no frontend
config changes are needed. **With no `GEMINI_API_KEY`, the backend runs in
safe-fallback mode** (identify → "assume venomous", summarize → local sentence)
— useful for offline demos.

### Build
```bash
npm run build        # frontend → dist/
```

---

## API documentation

Interactive docs (when the backend is running): `http://localhost:8000/docs`.

### `GET /health`
Liveness + whether Gemini is configured.
```json
{ "status": "ok", "gemini": false, "version": "1.0.0" }
```

### `POST /api/identify`
Analyse a snake photo. **Safety-first**: any failure, non-OK response, or
confidence below `LOW_CONFIDENCE` returns the safe default so the UI tells the
user to assume venomous. Raw provider errors are never exposed.

Request:
```json
{ "image": "<base64, no data-URL prefix>", "mime": "image/jpeg" }
```
Response:
```json
{ "species": "Russell's viper", "confidence": 0.82, "venomous": true }
```
Safe default (low confidence / failure):
```json
{ "species": "Unidentified", "confidence": 0.0, "venomous": true }
```

### `POST /api/summarize`
Turn the monitoring log into one clinician-facing handover sentence. Always
returns a usable sentence — Gemini-enhanced when configured, otherwise a
deterministic local fallback.

Request:
```json
{
  "biteTime": "2026-06-28T10:00:00Z",
  "language": "en",
  "symptomLog": [
    { "t": "2026-06-28T10:30:00Z",
      "answers": { "swelling": "spreading", "breathing": "no",
                   "vision": "yes", "bleeding": "no", "drowsy": "no" },
      "level": "severe" }
  ]
}
```
Response:
```json
{
  "summary": "30-min-old bite; swelling spreading up the limb; ptosis / blurred or double vision. Impression: possible neurotoxic envenomation, severity severe. …",
  "source": "fallback"
}
```

---

## Architecture notes

- **One state contract.** `EmergencyContext` holds `language, biteTime,
  victimLocation, snake, severity, symptomLog, emergencyContact,
  recommendedHospital`. Each screen reads/writes only its slice; the routing
  screen reads `victimLocation` + `severity` and writes back the chosen
  `recommendedHospital`, which SOS and the Hospital view then consume.
- **Offline-first & honest.** Core flow (first aid, tracker, snake capture,
  message composing) runs from local state. Hospital stock would show *cached*
  values, never fake "live" data. The SOS is queued offline and auto-sends when
  signal returns.
- **Safety defaults everywhere.** Low-confidence snake ID → assume venomous.
  Backend down → local summary. No network → app still works.
- **The key never leaves the server.** `GEMINI_API_KEY` is read only in
  `backend/app/config.py`; the frontend talks to the proxy.
- **Medical correctness.** First-aid DO/DON'T copy is fixed to the spec; the
  app is framed as *monitoring to share with a hospital*, never a diagnosis.

---

## Verification

- `npm run build` — frontend compiles (all screens lazy-loaded).
- Backend — `python -m py_compile` + a TestClient/uvicorn smoke test exercise
  `/health`, `/api/identify` (safe default), `/api/summarize` (fallback) with no
  key configured.

---

## Future v2 ideas (out of scope for this MVP)

- Real hospital stock integration (ASHA-worker updates, live inventory feed).
- SMS/WhatsApp gateway for the SOS (currently simulated, demo-safe).
- Offline service worker + installable PWA.
- Reverse-geocoding for manual location entry (currently seeded districts).
- Persisted, auditable risk data per district from real epidemiological sources.
- A genuine hospital-facing portal (the current view is one read-only screen).
