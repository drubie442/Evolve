# Evolve Wellbeing — Revised Feature Specification

A mental health first-contact and triage web app. React + Vite frontend, Express backend, in-memory data store (no database).

**Core pivot**: from "wellness tracker for existing users" to "frictionless first-contact and triage system."

The fridge magnet, QR code, and hospital card are the distribution mechanism. This app is what happens *after the scan* — and it must work for everyone from a scared 14-year-old to an 80-year-old with no smartphone experience.

---
## Deployment

https://evolve-app.delightfulpebble-5e64afb1.australiaeast.azurecontainerapps.io/

## Pages & Features

### QR Landing / Triage Entry (`/`)
Ultra-simple page for someone arriving from a fridge magnet, leaflet, or partner QR code scan:
- No login, no registration, no walls
- One question: **"How are you feeling right now?"** with three large, clear buttons:
  - **I'm in crisis** → immediately shows crisis banner with phone numbers (000, Lifeline 13 11 14, hub number)
  - **I'm struggling** → enters the triage wizard
  - **I want to learn more** → enters the resources browser
- Mobile-first, loads under 2 seconds, works on 3G
- No personal data collected at this step

### "What's Right for Me?" Triage Wizard (`/triage`)
2–3 plain-language questions routing people to the single most relevant next step:
- No jargon; no mental health literacy required
- Question 1: Who is this for? (Me / Someone I care about)
- Question 2: What's the biggest thing going on? (anxiety / low mood / relationships / loneliness / something physical / I'm not sure)
- Question 3: How urgent does it feel? (I need help today / In the next few days / I want to be prepared)
- Result is a **single action card** — not a list of links — showing: service name, what it offers, address/phone/hours, and a prominent CTA button
- Card is printable and shareable via SMS/WhatsApp (for people helping someone else)

### Crisis Banner (component, shown inline)
- Triggered by "I'm in crisis" or any triage path indicating urgency
- Displayed prominently without navigation away from the page
- Contacts: 000 (emergencies), Lifeline 13 11 14 (24/7 crisis line), Evolve Hub address and phone
- Large tap-to-call buttons — no copying numbers required

### Support Resources Browser (`/resources`)
Accessible catalogue of services for users who want to explore:
- Filter by concern (Anxiety, Stress, Loneliness, Relationships, Grief, Crisis, Youth, Aged Care, CALD)
- Each **ResourceCard** shows: name, type badge (In-person / Phone / Online / Community), description, availability, action links
- Crisis resources visually highlighted with a red border
- Printable resource list for offline distribution

### Hospital Warm Handoff Tool (`/handoff`) — staff-facing
Tablet-optimised view designed for ED and ward staff:
- Staff selects one or more concern categories from a simple grid
- Staff enters patient's mobile number (optional)
- Patient receives an SMS with a personalised resource card requiring no action from the patient in the moment
- No patient account or app install required
- Addresses frictionless sign-up in emergency wards

### Community Partner Referral Portal (`/partner/:partnerCode`)
- Unique branded QR codes issued to banks, pharmacies, GPs, Medibank offices, schools
- Each partner code maps to a customised landing page with their branding alongside LMNSPN branding
- Scan analytics: LMNSPN dashboard shows which partners are driving the most engagement
- Addresses README explicit mention of non-traditional distribution channels

### Age / Context Modes
Landing page and triage wizard adapt based on mode, settable via QR code parameter (`?mode=youth`, `?mode=elder`, `?mode=cald`):

| Mode | Behaviour |
|---|---|
| **Default** | Standard layout, balanced text size |
| **Youth** | Emoji-led, informal language, parent/guardian pathway available |
| **Elder** | Very large text, phone-number-first, single tap to call, minimal steps |
| **CALD** | Language selector prominent on first load; key content in top languages for Hunter region |

A school QR code links to youth mode automatically; an aged care facility QR links to elder mode.

### "Check In On a Mate" Pathway (`/for-a-friend`)
Removes the stigma barrier of self-referral:
- Entry point: "This is for a friend or family member, not me"
- User answers a few questions about how their friend seems (observable behaviours, not diagnosis)
- Receives a resource card they can share directly via SMS or WhatsApp
- Leverages existing social networks rather than requiring direct self-referral

### Digital Wallet Card (Apple Wallet / Google Wallet)
Distributed via QR code on physical materials:
- Contains: hub address, opening hours, phone number, triage QR code
- Stays on the phone lock screen — accessible without internet
- Addresses households with low or no connectivity

---

## Offline-First PWA

The app is installable to home screen and works without internet after first load:
- Critical resources (phone numbers, hub address, crisis contacts) cached locally via service worker
- Triage wizard works offline; result card is available offline
- Addresses low-connectivity households

---

## Analytics Dashboard (`/admin`) — staff-facing

Simple internal view showing:
- Total QR scans by source (partner code, channel)
- Triage path breakdown (crisis / struggling / learn more)
- Most selected concern categories
- Warm handoff usage by ward/location

No personal data is stored — all analytics are aggregate counts.

---

## What's Deprioritised

The following features from the original specification are not aligned with the first-contact mission and have been deprioritised for this build:

| Feature | Reason |
|---|---|
| Streaks, XP, medals | Solves retention, not discovery or first contact |
| Daily challenges | Engagement mechanic for existing users — not relevant at crisis moment |
| Buddy Wall | Low-stigma community feature with some merit; revisit post-MVP |
| Mood history graph | Requires returning users; not the target persona |
| JWT auth / accounts | Adds friction at the most critical moment |

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, React Router v6, Vite |
| Backend | Node.js, Express |
| Auth | Not required for primary flows; optional staff PIN for handoff/admin tools |
| Data | In-memory Maps (no database) — intended as prototype/demo |
| Styling | Plain CSS with custom properties (design tokens) |
| PWA | Vite PWA plugin, service worker for offline caching |

---

## Key Design Decisions

- **Frictionless first**: no account, no email, no registration required for any public-facing flow
- **Single next step**: triage always resolves to one action card, never a list of options
- **QR-code-first distribution**: the app is designed to be entered via a physical touchpoint, not discovered via search
- **Context-aware**: QR code parameters set age/language mode automatically so the right experience is delivered to the right audience
- **Crisis-safe**: any path indicating urgency immediately surfaces emergency contacts; 000 is always reachable in one tap
- **Offline-capable**: critical information is available without internet after first load
- **No personal data**: analytics are aggregate only; no identifying information is stored

---

## Demo Arc (Hackathon Pitch)

1. Show a fridge magnet → scan QR → 3-tap triage → *"Here's your next step"* (30 seconds, any phone)
2. Show an ED nurse using the warm handoff tablet view to send an SMS to a patient
3. Show a bank teller's referral QR code and the analytics dashboard showing which partner drove the most scans
4. Show the digital wallet card persisting on the lock screen without internet
5. Show youth mode vs elder mode side-by-side — same content, different presentation

This story directly answers: *"How do we reach every household and get them the right help, fast?"*
