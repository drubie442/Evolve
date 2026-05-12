# Evolve Wellbeing — Feature Summary

A mental health & wellbeing web app. React + Vite frontend, Express backend, in-memory data store (no database).

Not just an app - also need resources for off-line groups (aged, not connected etc)

---

## Pages & Features

### Home (`/`)
- Hero banner with tagline and two primary CTAs: **Start a check-in** and **Browse support resources**
- Three feature cards linking to: Daily check-in, Find support, and Walk-in hub (static info)

### Daily Check-in (`/checkin`)
Three-step form with a progress bar:
1. **Mood** — 1–5 emoji scale (😔 → 😊)
2. **Concerns** — multi-select grid (Anxiety, Stress, Loneliness, Relationships, Grief, Work/Study, Physical health, Something else)
3. **Duration** — how long they've been feeling this way (Today / A few days / A few weeks / A month or longer)

On submit:
- Posts to `/api/checkin`; check-in is recorded server-side
- If mood = 1 (crisis), a **CrisisBanner** is shown prominently with immediate-help contacts
- **Personalised resource list** is returned based on mood + concerns
- If logged in: **streak, medals, and mood history** are updated; a **MedalToast** popup fires for any newly earned medals
- Works for **anonymous users** too (no account required)

### Support Resources (`/resources`)
- Filterable list of resources by concern category (All, Anxiety, Stress, Loneliness, Relationships, Grief, Crisis)
- Each **ResourceCard** shows: name, type badge (In-person / Phone / Online / Community), description, availability, and action links (phone number or website)
- Crisis resources are visually highlighted with a red border

### Login (`/login`) & Register (`/register`)
- JWT-based authentication; token stored in React context (in-memory, not persisted)
- Register collects: display name, email, password
- Registration page explicitly notes that a **real name/email is not required** and suggests anonymous email aliases (SimpleLogin, addy.io)
- Login redirects to Dashboard on success

### Dashboard (`/dashboard`) — authenticated only
- Personalised greeting with display name
- Shows whether the user has already checked in today
- **Scorecard** widget: current streak, longest streak, total check-ins, XP, medals earned
- **Streak freeze tokens**: users start with 3; can spend one to protect a streak on a missed day
- **Mood graph**: SVG line chart of the last 30 days of mood scores
- Quick-link buttons to: Today's check-in, Daily challenges, Buddy Wall, Find support

### Buddy Wall (`/buddy`) — authenticated to send, public to view
- Users pick from a set of **pre-written canned encouragement messages** and post them anonymously to a shared feed
- Feed auto-refreshes every 15 seconds
- No personal information is shared — messages are just attributed to a display name
- Sending encouragements earns **Encourager medals** (at 5 and 25 sent)

### Daily Challenges (`/challenges`) — authenticated
- Catalogue of wellbeing challenges across 7 categories: Everyday, Body, Mind, Social, Creative, Outdoors, Community
- Each challenge has: title, description, difficulty (Easy / Medium / Adventure), XP reward, and accessibility tag (any / seated / indoor / outdoor)
- Completing a challenge requires submitting a short free-text response (honour system; no answer checking)
- XP is added to the user's total; challenges can only be completed once per day

---

## Gamification System

| Element | Detail |
|---|---|
| **Streak** | Increments when the user checks in on consecutive days; resets if a day is missed |
| **Longest streak** | Tracked separately |
| **Streak freeze tokens** | 3 per user; each token protects one missed day without breaking the streak |
| **XP** | Earned by completing daily challenges |
| **Medals** | Awarded automatically; displayed in Scorecard and as a toast popup |

### Medal thresholds

| Medal | Trigger |
|---|---|
| ⭐ First Check-in | 1st check-in ever |
| 🥉 10-Day Streak | Streak ≥ 10 |
| 🥈 20-Day Streak | Streak ≥ 20 |
| 🥇 50-Day Streak | Streak ≥ 50 |
| 💬 5 Encouragements | 5 buddy messages sent |
| 💙 25 Encouragements | 25 buddy messages sent |

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, React Router v6, Vite |
| Backend | Node.js, Express |
| Auth | JWT (jsonwebtoken), bcrypt |
| Data | In-memory Maps (no database) — intended to be replaced |
| Styling | Plain CSS with custom properties (design tokens) |

---

## Key Design Decisions
- **Anonymous-first**: check-ins work without an account; registration discourages real identities
- **No persistent storage**: all data lives in server memory and is lost on restart — intended as a prototype/demo
- **Crisis-aware**: mood score of 1 always surfaces a crisis banner with emergency contacts (000)
- **Accessibility**: challenge catalogue includes seated/indoor options; aria-labels on emoji elements
