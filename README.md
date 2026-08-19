# Financing Quality Infrastructure in Africa — Survey Platform (Prototype)

Trilingual (English / French / Arabic with full RTL) adaptive survey prototype for the
**Survey on Financing Quality Infrastructure and MSME Access to Finance in Africa**,
a joint initiative of **AUDA-NEPAD, UNIDO and the African Union Commission** under the
ACP Quality Infrastructure Programme (funded by the European Union and the OACPS).

Static site, no build step, no framework. Total transfer for a complete 43-item survey
path: about **64 KB gzipped** (landing: 17 KB), usable on 2G/3G phones.

## What the prototype does

- **All 55 AU member states** listed; the 16 wave-1 countries are active, the rest show
  an "opens in a later wave" state.
- **Adaptive routing**: country → tier module (3 tiers, pre-assigned from verified
  published evidence); institutional category (P2) → one of 7 respondent modules.
  Every respondent answers exactly 43 items in 12 screens of at most 4 questions.
- **Survey UX**: progress bar, save and resume (this device), composition sums enforced
  to 100, unique ranks, matrix rows, follow-up fields, and Don't know / Not applicable /
  Prefer not to say on every question. No right-or-wrong framing.
- **Trilingual**: complete question bank and interface in EN, FR, AR (RTL mirrored).
- **Data capture**: submissions post to **Netlify Forms** (form name `qi-survey`) with
  the full answer set as JSON; each respondent can download a JSON receipt. If the
  submission service is unreachable, answers stay safe on the device and the receipt
  still works.
- **Countries & insights page**: verified recognition status board for all 55 states
  (ILAC/SADCAS/SOAC route, BIPM status, ISO category, GQII 2025 rank, tier and score,
  evidence as of 19 Aug 2026) marked VERIFIED DATA, plus sample analytics charts marked
  DEMO DATA (synthetic, clearly watermarked; no real responses exist yet).
- **Admin demo page**: what coordinators/admins will see (funnel, roster, review queue,
  scoped exports), entirely synthetic and labeled as such.

## Deploy: GitHub + Netlify (recommended)

This folder is already a git repository with committed history.

```bash
# 1. create an empty repository on github.com (no README), then:
git remote add origin https://github.com/<your-account>/qi-survey-platform.git
git branch -M main
git push -u origin main
```

Then on **app.netlify.com**: *Add new site → Import an existing project → GitHub* →
pick the repository → leave **Build command empty**, set **Publish directory** to `.`
→ *Deploy*. Every future `git push` redeploys automatically.

**Activate Forms**: after the first deploy, open the site's **Forms** tab in Netlify;
the form `qi-survey` is auto-detected from the hidden form in `index.html`/`survey.html`.
Submissions appear there (free tier: 100/month) and can be exported as CSV or wired to
email notifications (*Forms → Notifications*). A honeypot field (`bot-field`) filters spam.

### Alternative: Netlify Drop (no GitHub)
Drag this folder onto **https://app.netlify.com/drop**. Forms work the same way.

### Local preview
```bash
python3 -m http.server 8123   # then open http://localhost:8123
```
(Form submission returns an error locally; that is expected, Netlify handles POST in production.)

## Structure

```
index.html            landing: hero, how it works, 55-country grid
survey.html           the adaptive survey (mounts js/engine.js)
insights.html         verified status board + DEMO-marked sample analytics
admin.html            admin/coordinator demo (synthetic, watermarked)
about.html            methodology in brief (EN/FR/AR)
css/main.css          single stylesheet, RTL-ready (logical properties)
js/i18n.js            all interface strings, EN/FR/AR
js/common.js          language handling, header/footer
js/engine.js          routing, widgets, validation, save/resume, submit
js/insights.js        charts (hand-rolled SVG; palette validated for CVD safety)
js/data/countries.js  55 states with tier, score, verified statuses, names in 3 languages
js/data/bank_part1.js profile + common core (25 items, trilingual)
js/data/bank_part2.js tier modules T1/T2/T3 + closing (26 items)
js/data/bank_part3.js seven respondent modules (56 items)
data/QI_Tier_Table_55_AU_States.csv   machine-readable tier evidence table
netlify.toml          publish config + security headers
```

## QA already performed on this build

- All 21 routing paths (3 tiers × 7 families) executed end to end by an automated
  browser: 12 screens and 43 items each, zero JavaScript errors.
- French and Arabic full paths executed; RTL verified on mobile viewport (390 px).
- Validation confirmed: empty screens cannot advance; compositions must total 100;
  ranks are unique; every question offers the three response controls.
- Transfer-size audit: survey path ~64 KB gzipped, landing ~17 KB gzipped.

## Prototype scope vs. the full platform

This prototype implements the respondent experience and the public insight surfaces of
the **Survey Platform Build Prompt v1.0** (Deliverable D). Deliberately not included at
prototype stage: authentication and role-based access, the CMS and translation workbench,
tokenized invitations and reminders, the review-queue workflow, respondent-level exports
and API, evidence uploads, and server-side aggregation with the n≥3 threshold. Deliverable D
specifies all of these for the production build. The question bank, routing, tier table
and no-fabrication rules used here are identical to Deliverables A-C, so content carries
over unchanged.

## Data rules

The platform never displays invented data as real. Everything on the insights page is
either a verified published status carrying its as-of date, or a chart watermarked
DEMO DATA. The tier table is versioned; see the Survey Methodology (Deliverable B,
section 4) for the scoring rule and sources.

Prototype build, 19 August 2026.
