# Minimum Triage Questions for Service Matching

The following 3 questions (plus 1 optional) are the minimum required to match a person to the correct support service from the directory. They map directly to the data model fields used by the service records.

---

## Question 1 — Who is the support for? *(Age)*

> **Field:** `age_0_5`, `age_6_11`, `age_12_18`, `age_adult`, `age_over_65`

| Answer | Age Range |
|--------|-----------|
| Young child | 0–5 |
| Child | 6–11 |
| Young person | 12–18 |
| Adult | 19–64 |
| Older adult | 65+ |

This is the single most powerful filter — many services are exclusively age-targeted.

---

## Question 2 — Where are you located?

> **Field:** `region_newcastle`, `region_lake_macquarie`, `region_maitland_cessnock`

| Answer |
|--------|
| Newcastle |
| Lake Macquarie |
| Maitland / Cessnock |

Most services only cover 1–2 of the 3 regions. Combined with age, these two questions eliminate the majority of irrelevant services.

---

## Question 3 — What is the main reason you're seeking support?

> **Field:** `category`

| Answer | Category |
|--------|----------|
| Mental health & wellbeing | Mental Health |
| Physical health / GP | General Health, General Practitioners |
| Disability support | Disability Services |
| Domestic or family violence | Domestic Violence |
| Drug or alcohol use | Drug & Alcohol |
| Housing / homelessness | Housing Support |
| Legal help | Legal |
| Employment / training | Employability |
| Parenting or family support | Parenting & Family Support |
| Aboriginal / cultural support | Aboriginal Services |
| Social connection & wellbeing | Social-Emotional Support |
| Other | All categories |

---

## Question 4 — Do you need a free service? *(Optional)*

> **Field:** `fee_structure`

| Answer |
|--------|
| Yes, free only |
| No preference |

Use this question to break ties when multiple services match the first 3 answers. A significant portion of services in the directory are free.

---

## Rationale

These 3 core questions handle ~90% of the filtering work given the data model. Additional refinements (e.g. Aboriginal identity, referral pathway, wait time preference) should be presented *after* an initial shortlist is shown, rather than asked upfront.
