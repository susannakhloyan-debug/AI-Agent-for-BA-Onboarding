# AI Agent for BA Onboarding

Two document generators for Business Analysts:

1. **[BA Onboarding Plan Generator](#ba-onboarding-plan-generator)** — a `.docx` onboarding plan for new BAs/interns.
2. **[Banking PRD Generator](#banking-prd-generator)** — a BABOK-aligned `.docx` Product Requirements Document for a Senior Business Analyst specialized in banking/fintech applications.

Both work the same three ways: **standalone HTML** (no server), a **web form** (`npm start`), and the **command line**.

## Setup

```bash
npm install
```

---

## BA Onboarding Plan Generator

Generates a **BA Onboarding Plan** (`.docx`) for new Business Analysts and interns.

The plan follows a fixed, hands-on curriculum — negotiation/requirements
simulation, PRD & Epic/User Story documentation, MVP scope-splitting, process
modeling (BPMN), wireframing, a mentor "grooming session" presentation, a SQL
learning module, and a feature-ideation exercise — while the **topic/product
each BA is assigned changes every time** (e.g. "Loyalty Points Program
Enhancements", "Referral Program Redesign", etc.). Only the topic-driven text
changes between BAs; the underlying skill-building structure (SQL resources,
exercise flow) stays consistent.

### Generate a plan (standalone page, no server)

Open `public/standalone.html` directly in your browser (double-click it, or
drag it into a browser tab) — no `npm start`, no server, nothing installed
required once the file exists. It runs entirely client-side: fill in the
form, click **Generate Onboarding Plan**, and the `.docx` downloads. You can
also host this single file anywhere static (e.g. GitHub Pages).

If you change `src/planContent.js` or `src/buildDocx.js`, rebuild it with:

```bash
npm install
npm run build:standalone
```

This regenerates `public/standalone.html` (and `public/prd-standalone.html`)
by bundling those modules (via esbuild) together with the page in
`web/standalone-header.html` / `web/standalone-footer.html`.

### Generate a plan (web form with a server)

Needs `npm start` running, but is otherwise the same experience:

```bash
npm start
```

Then open **http://localhost:3000** in your browser, fill in the form, and
click **Generate Onboarding Plan** — the `.docx` downloads automatically.

### Generate a plan (command line)

Via CLI flags:

```bash
node src/generatePlan.js \
  --name "Shushanik Avetisyan" \
  --role intern \
  --topic "Loyalty Points Program Enhancements" \
  --product "MyBusiness" \
  --mentor "Susanna Khloyan" \
  --duration 3 \
  --out ./output/Shushanik_Avetisyan_Onboarding_Plan.docx
```

Or via a JSON config (CLI flags override config values):

```bash
node src/generatePlan.js --config examples/loyalty-points-example.json
```

Run `node src/generatePlan.js --help` for the full option list.

#### Options

| Flag | Required | Description |
|---|---|---|
| `--name` | yes | New BA / intern's full name |
| `--topic` | yes | The theme/feature this BA will work on |
| `--mentor` | yes | Mentor's full name |
| `--role` | no | `new_ba` (default) or `intern` — adjusts pacing/independence language |
| `--product` | no | Product/system name the topic belongs to |
| `--sub-process` | no | Feature/workflow used for the process-modeling (BPMN) exercise; defaults to something derived from `--topic` |
| `--duration` | no | Duration in months (default `3`) |
| `--evaluation` | no | Evaluation frequency (default `"Weekly check-ins + Project assessment"`) |
| `--start-date` | no | Onboarding start date |
| `--prd-template-name` | no | Name of the team's PRD template (default `"Product Requirement Document_template"`) |
| `--prd-template-link` | no | Link to the PRD template, if you have one (renders as a hyperlink instead of plain text) |
| `--out` | no | Output path (default `./output/<Name>_Onboarding_Plan.docx`) |
| `--config` | no | JSON file with any of the above (plus `sqlResources`, `sqlTasks`, `sqlAccessNote`, `sqlAccessSource` to override the SQL module's defaults) |

### What the generated plan contains

1. **Cover / Overview** — Duration, Goal, Mentor, Evaluation Frequency, role, topic, product
2. **Contents** — auto-generated, clickable table of contents
3. **Requirement Gathering & Negotiation Session (imitation)** — Background, Scenario, Task, tailored to the assigned topic/product
4. **Requirements Analysis & Documentation** — Epic → User Story decomposition, PRD
5. **Scope splitting** — MVP + 3 prioritized stages
6. **Process Modeling** — BPMN/flowchart exercise (draw.io/Camunda)
7. **Wireframing** — Figma/Miro exercise
8. **Mentor presentation** — grooming-session simulation
9. **SQL module** — curated learning links, access notes, and a practice-question table (Question / Query / Remarks from BA / Remarks from Mentor)
10. **Feature ideation** — new feature/improvement brainstorm on the assigned topic
11. **Alternative solution proposal** — for the Section 1 scenario

### Extending

- To change the SQL curriculum (links/questions) team-wide, edit the
  defaults in `src/planContent.js` (`DEFAULT_SQL_RESOURCES`,
  `DEFAULT_SQL_TASKS`), or override per-run via a `--config` file.
- To change the document's look (colors, fonts, page size), edit
  `src/buildDocx.js` (or the shared helpers in `src/docxHelpers.js`).
- To add/remove/reorder curriculum sections, edit the `sections` array
  built in `src/planContent.js`.

---

## Banking PRD Generator

Generates a **Product Requirements Document** (`.docx`) written the way a
**Senior Business Analyst specialized in banking/fintech applications**
would structure it. The section order is fixed and maps directly onto the
six **BABOK v3** (*A Guide to the Business Analysis Body of Knowledge*)
knowledge areas, plus banking-specific additions — only the
feature/product content changes between PRDs:

| # | Section | BABOK Knowledge Area |
|---|---|---|
| — | Cover Page & Document Control (revision history) | Business Analysis Planning & Monitoring |
| 1 | Purpose & Business Need | Strategy Analysis |
| 2 | Business Objectives & Success Metrics (KPIs) | Strategy Analysis / Solution Evaluation |
| 3 | Stakeholder Analysis (RACI) | Business Analysis Planning & Monitoring |
| 4 | Elicitation Summary (techniques & sources) | Elicitation & Collaboration |
| 5 | Scope (In / Out of scope, channels affected) | Requirements Analysis & Design Definition |
| 6 | Current State (As-Is) & Future State (To-Be) | Strategy Analysis |
| 7 | Assumptions, Constraints & Dependencies | Requirements Life Cycle Management |
| 8 | Regulatory & Compliance Requirements (KYC/AML, PCI DSS, PSD2/SCA, data privacy, operational risk, internal controls) | Requirements Analysis & Design Definition (banking-specific) |
| 9 | Business Rules | Requirements Analysis & Design Definition |
| 10 | Functional Requirements — Epics, User Stories & Acceptance Criteria (Given/When/Then) | Requirements Analysis & Design Definition |
| 11 | Non-Functional Requirements (Security, Performance, Availability, Auditability, Usability, Scalability) | Requirements Analysis & Design Definition |
| 12 | Data Requirements | Requirements Analysis & Design Definition |
| 13 | Risk Assessment | Strategy Analysis |
| 14 | Requirements Traceability Matrix | Requirements Life Cycle Management |
| 15 | Acceptance & Sign-off | Solution Evaluation |
| 16 | Glossary | Requirements Life Cycle Management |
| 17 | BABOK Coverage Checklist (appendix) — confirms all six knowledge areas + the BABOK requirement-quality characteristics (atomic, complete, consistent, concise, feasible, unambiguous, testable, prioritized, traceable) are addressed | Appendix |

Everything except `productName`, `featureName`, and `author` has a sensible
banking-flavored default (e.g. default regulatory requirements, NFR
categories, and glossary), so the tool is usable immediately — but every
field can be overridden for a real PRD via a `--config` JSON file.

### Generate a PRD (standalone page, no server)

Open `public/prd-standalone.html` directly in your browser — same
no-install, client-side experience as the onboarding plan's standalone
page. Fill in the form, click **Generate PRD**, and the `.docx` downloads.

Rebuild it (together with the onboarding plan's standalone page) after
changing `src/prdContent.js` or `src/buildPrdDocx.js`:

```bash
npm install
npm run build:standalone
```

### Generate a PRD (web form with a server)

```bash
npm start
```

Then open **http://localhost:3000/prd.html**, fill in the form, and click
**Generate PRD**.

### Generate a PRD (command line)

Via CLI flags (core fields only):

```bash
node src/generatePrd.js \
  --product "Digital Banking Platform" \
  --feature "Instant Card Freeze & Unfreeze" \
  --author "Susanna Khloyan" \
  --business-unit "Cards & Payments" \
  --priority High \
  --out ./output/Instant_Card_Freeze_PRD.docx
```

For a real PRD you'll want the full field set (stakeholders, epics/user
stories, risks, regulatory requirements, business objectives, etc.) — pass
those via a JSON config instead:

```bash
node src/generatePrd.js --config examples/banking-prd-example.json
```

`examples/banking-prd-example.json` is a complete, realistic example (an
"Instant Card Freeze & Unfreeze" feature) showing every supported field.
CLI flags override config values.

Run `node src/generatePrd.js --help` for the full option list.

#### Options

| Flag | Required | Description |
|---|---|---|
| `--product` | yes | Banking product/system name |
| `--feature` | yes | The feature/epic this PRD covers |
| `--author` | yes | Senior BA's full name (document author) |
| `--business-unit` | no | Default `"Retail Banking"` |
| `--version` | no | Document version (default `"0.1"`) |
| `--status` | no | Default `"Draft"` |
| `--priority` | no | `Critical` \| `High` \| `Medium` \| `Low` (default `"High"`) |
| `--target-release` | no | Target release / date |
| `--out` | no | Output path (default `./output/<Feature>_PRD.docx`) |
| `--config` | no | JSON file with any of the above, plus the rich fields not exposed as flags: `businessObjectives`, `successMetrics`, `stakeholders`, `inScope`, `outOfScope`, `assumptions`, `constraints`, `dependencies`, `risks`, `channelsAffected`, `regulatoryRequirements`, `businessRules`, `epics`, `nonFunctionalRequirements`, `dataRequirements`, `glossary`, `elicitationTechniques`, `elicitationSources`, `approvers` |

### Extending

- To change the default banking regulatory requirements, NFR categories,
  or glossary team-wide, edit the `DEFAULT_*` exports in
  `src/prdContent.js`, or override per-run via a `--config` file.
- To change the document's look, edit `src/buildPrdDocx.js` (or the shared
  helpers in `src/docxHelpers.js`).
- To add/remove/reorder PRD sections (or change the BABOK mapping), edit
  the `sections` array built in `src/prdContent.js`.

---

## Project structure

```
src/
  planContent.js    # onboarding plan: builds structured plan data from inputs
  buildDocx.js       # onboarding plan: renders plan data into a .docx
  generatePlan.js    # onboarding plan: CLI entry point
  prdContent.js      # banking PRD: builds structured, BABOK-aligned PRD data from inputs
  buildPrdDocx.js    # banking PRD: renders PRD data into a .docx
  generatePrd.js     # banking PRD: CLI entry point
  docxHelpers.js     # shared low-level docx-js building blocks (headings, tables, bullets, TOC)
  server.js          # web form entry point (npm start) — serves both tools
public/
  index.html            # onboarding plan: server-backed web form
  standalone.html        # onboarding plan: generated, no-server client-side page
  prd.html               # banking PRD: server-backed web form
  prd-standalone.html    # banking PRD: generated, no-server client-side page
web/
  standalone-header.html / standalone-footer.html          # onboarding plan standalone page
  prd-standalone-header.html / prd-standalone-footer.html  # banking PRD standalone page
scripts/
  build-standalone.js     # bundles src/*.js + web/*.html -> public/*.html for both tools
examples/
  loyalty-points-example.json  # onboarding plan example config
  banking-prd-example.json     # banking PRD example config
```
