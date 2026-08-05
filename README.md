# AI Agent for BA Onboarding

Generates a **BA Onboarding Plan** (`.docx`) for new Business Analysts and interns.

The plan follows a fixed, hands-on curriculum — negotiation/requirements
simulation, PRD & Epic/User Story documentation, MVP scope-splitting, process
modeling (BPMN), wireframing, a mentor "grooming session" presentation, a SQL
learning module, and a feature-ideation exercise — while the **topic/product
each BA is assigned changes every time** (e.g. "Loyalty Points Program
Enhancements", "Referral Program Redesign", etc.). Only the topic-driven text
changes between BAs; the underlying skill-building structure (SQL resources,
exercise flow) stays consistent.

## Setup

```bash
npm install
```

## Generate a plan (standalone page, no server)

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

This regenerates `public/standalone.html` by bundling those modules (via
esbuild) together with the page in `web/standalone-header.html` /
`web/standalone-footer.html`.

## Generate a plan (web form with a server)

Needs `npm start` running, but is otherwise the same experience:

```bash
npm start
```

Then open **http://localhost:3000** in your browser, fill in the form, and
click **Generate Onboarding Plan** — the `.docx` downloads automatically.

## Generate a plan (command line)

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

Another ready-made topic — a returns/refunds workflow, which is a common
first assignment because it touches multiple user types (customer, support
agent, finance) and has clear approval branching for the process-modeling
exercise:

```bash
node src/generatePlan.js --config examples/order-return-refund-example.json
```

Run `node src/generatePlan.js --help` for the full option list.

### Options

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

## What the generated plan contains

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

## Project structure

```
src/
  planContent.js   # builds the structured plan data from inputs
  buildDocx.js      # renders that data into a .docx (docx-js)
  generatePlan.js   # CLI entry point
  server.js          # web form entry point (npm start)
public/
  index.html         # the server-backed web form
  standalone.html     # generated: the no-server, client-side page
web/
  standalone-header.html  # standalone.html's <head>/styles
  standalone-footer.html  # standalone.html's markup + page script
scripts/
  build-standalone.js     # bundles src/*.js + web/*.html -> public/standalone.html
examples/
  loyalty-points-example.json
```

## Extending

- To change the SQL curriculum (links/questions) team-wide, edit the
  defaults in `src/planContent.js` (`DEFAULT_SQL_RESOURCES`,
  `DEFAULT_SQL_TASKS`), or override per-run via a `--config` file.
- To change the document's look (colors, fonts, page size), edit
  `src/buildDocx.js`.
- To add/remove/reorder curriculum sections, edit the `sections` array
  built in `src/planContent.js`.
