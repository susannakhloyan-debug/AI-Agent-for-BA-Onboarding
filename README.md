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

## Generate a plan

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
