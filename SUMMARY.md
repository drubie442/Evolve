# Evolve Mental Health & Wellbeing Hub — Feature Summary

## Overview

Evolve connects vulnerable people to support services instantly — via wearables, QR codes or carers — triaging needs and booking the right service automatically, so help arrives faster.

### Business Challenges

Patients present to Emergency wards when in crisis but the LMNSPN would prefer they had resources at hand to help instead of falling back to the emergency room.

The LMNSPN feels they do not have enough outreach and need to address that.

The LMNSPN is not a regularly referred service by carers, doctors, nurses and other health professionals when presented with patients in crisis.

Some of the patients in crisis do not have access to phones/computers or are not technology literate enough and require help to contact LMNSPN.

Ideas

Create a triage page for patients in crisis to quickly get help.

Create a service lookup for patients who are looking for resources aimed at their current mental health state.

Create a referral portal that encourages carers to refer patients to LMNSPN including gamified rewards to encourage engagement.

Create an API for future use via wearables or environment based NFC devices to integrate with physical objects like brochures or posters.

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

## Wearable & QR Auto-Referral API (`/api/refer`)

A zero-friction referral pathway for patients who have been pre-registered by a clinician — for example, hospital discharge patients given a wearable device or a personalised QR code card.

### How it works

Each patient is assigned a unique GUID at registration. That GUID is embedded in a QR code or wearable. When the patient scans the QR code (or the device calls home), a booking is automatically created against their pre-assigned support service — no app, no login, no form to fill in.

### Endpoints

| Method         | Path                             | Auth   | Description                                                                                                |
| -------------- | -------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------- |
| `GET` / `POST` | `/api/refer/:guid`               | Public | Triggered by QR scan or wearable. Looks up patient by GUID, creates a booking with their assigned service. |
| `GET`          | `/api/refer/patients`            | Staff  | List all pre-registered patients and their assigned services.                                              |
| `GET`          | `/api/refer/bookings`            | Staff  | List all auto-created bookings. Filterable by `status`.                                                    |
| `GET`          | `/api/refer/bookings/:id`        | Staff  | Single booking detail.                                                                                     |
| `PATCH`        | `/api/refer/bookings/:id/status` | Staff  | Update booking status: `pending` → `confirmed` or `cancelled`.                                             |

`GET` is supported on the referral endpoint so that scanning a QR code in a mobile browser triggers the booking directly, without needing a dedicated app.

### Patient Registry

Each patient record holds: name, date of birth, phone, email, assigned service ID, and clinical notes. Six patients are seeded for demonstration.

### Staff Portal — new pages

- **Auto-Bookings** — review all inbound auto-referral bookings, confirm or cancel each one
- **Patient Registry** — search registered patients, copy their GUID or referral URL for use on printed cards or wearables

---

## Deployment

Hosted on **Azure Container Apps** — a single Docker container serving both the public app and the carer/staff portal.

**Live URL:** https://evolve-app.delightfulpebble-5e64afb1.australiaeast.azurecontainerapps.io
