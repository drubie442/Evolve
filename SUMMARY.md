# Evolve Mental Health & Wellbeing Hub — Feature Summary

## Overview

Evolve connects vulnerable people to support services instantly — via wearables, QR codes or carers — triaging needs and booking the right service automatically, so help arrives faster.

---

## Public-Facing App

### Landing Page

The entry point. Three large, clear buttons ask one question: _How are you feeling right now?_

- **I'm in crisis** — immediately surfaces 000 and Lifeline tap-to-call buttons, plus walk-in addresses for both Safe Spaces
- **I'm struggling** — guides the user through a short triage wizard
- **I want to learn more** — opens the resource browser

Mode variants adapt the layout for different audiences (e.g. larger text and a direct call button for elderly users, emoji-led messaging for youth).

---

### Crisis Path

For anyone who indicates they need immediate help, the app prominently displays:

- **000** — Emergency Services (tap to call)
- **13 11 14** — Lifeline 24/7 Crisis Line (tap to call)
- **Safe Haven** — 22 Stewart Avenue, Hamilton East NSW (Fri–Sun 4pm–9pm) — tap for directions
- **Safe Space Charlestown** — 3 Hilltop Arcade, 228 Pacific Highway (Mon & Tue 5:30pm–9:30pm) — tap for directions

These contacts remain visible throughout the crisis flow so they are never more than one tap away.

---

### Triage Wizard ("I'm Struggling")

A 4-step guided flow that filters to the most relevant support services:

1. **Who is this for?** — myself or someone I care about
2. **What's going on?** — multi-select concern buttons (anxiety, stress, low mood, loneliness, relationships, grief, crisis, not sure)
3. **Age group** — young child through older adult
4. **Region** — Newcastle, Lake Macquarie, or Maitland/Cessnock

Selections are matched against a structured database of Hunter region services, filtered by age eligibility, region, category, and availability. Results are sorted with key services first. A direct call button to the Evolve Hub (02 4096 1100) is always shown.

---

### For a Friend

A single-page flow for someone who is concerned about another person. Multi-select observations (e.g. _they seem withdrawn_, _I'm worried about their safety_) are mapped to concern categories and fed into the same service-matching engine. Results can be shared or shown directly to the person in need.

---

### Resource Browser

A filterable directory of all Hunter region mental health services. Supports filtering by concern and age group. Crisis services are surfaced first. Each card shows availability, contact details, and tap-to-call or tap-for-directions links.

---

## Carer & Staff Portal (`/staff`)

Built for service workers — hospital discharge staff, GPs, social workers, police — to refer patients who may not engage with the system on their own.

### Carer Flow

1. Register with name, email, organisation, and specialty
2. Submit a referral ticket: patient name, contact details, concern, and urgency level
3. View submitted tickets and track their status
4. Earn points and badges for each referral submitted (gamification to encourage ongoing engagement)

**Gamification levels:** Supporter → Advocate → Champion → Expert  
**Badges:** First Steps, Helping Hand, Dedicated Advocate, Community Champion, Crisis Responder

### Staff Flow (Evolve Hub)

1. Login with staff credentials
2. View all open referral tickets across all organisations
3. Claim, progress, and close tickets with a reason recorded at each step
4. Full status history on every ticket

### Seed login

Staff access: `staff@evolve.org.au` / `evolve2024`

---

## Deployment

Hosted on **Azure Container Apps** — a single Docker container serving both the public app and the carer/staff portal.

**Live URL:** https://evolve-app.delightfulpebble-5e64afb1.australiaeast.azurecontainerapps.io
