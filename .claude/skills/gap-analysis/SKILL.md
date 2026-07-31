---
name: gap-analysis
description: Analyze current state vs. desired future state, investigate root causes of an issue, assess impact across systems, and define integration requirements between systems. Use this whenever the user asks to "perform gap analysis", "investigate" an issue or discrepancy, compare "current vs future state" / "as-is vs to-be", find a "root cause", or analyze how systems should integrate (APIs, data flows, batch jobs). Also trigger when a bug report or "why is X happening" question actually needs a structured investigation rather than a quick guess.
---

# Investigation, Gap Analysis & Integration Analysis

The goal here is to move from "something is wrong" or "we want X but have Y" to a structured, evidence-based account of the gap, its cause, and what closing it requires — not to jump straight to a fix.

## Gap analysis (current vs. desired state)

1. **Describe the current state (As-Is)** as precisely as the input allows — what actually happens today, step by step, including systems and data involved. If you don't have enough detail, say what's missing rather than assuming.
2. **Describe the desired state (To-Be)** — what should happen instead.
3. **Enumerate the gaps** — the specific differences between the two, not just "current is worse." Each gap should be concrete enough to turn into a requirement.
4. **Classify each gap**: process gap, system/technical gap, data gap, policy/compliance gap, or skills/resourcing gap. The category determines who needs to be involved to close it.

## Root cause investigation

Don't stop at the first plausible explanation. Use **5 Whys** (ask "why" repeatedly until you hit something actionable, not just "why did the user see an error" → "because the API returned a 500") or a **fishbone-style breakdown** across categories: people/process, systems, data, external dependencies. Distinguish:
- **Symptom** — what was observed
- **Root cause** — the actual originating condition
- **Contributing factors** — things that made it worse or more likely, but aren't the root cause

## Integration analysis

When systems need to talk to each other:
- **Identify each system** involved and its role (source of truth, consumer, orchestrator)
- **Identify the interface**: REST API, SOAP, file/batch transfer, message queue, direct DB access — and note if this is unknown and needs technical discovery
- **Data flow direction** — what moves where, and whether it's real-time, near-real-time, or batch
- **Data mapping concerns** — fields that don't map 1:1, format mismatches, required transformations
- **Failure handling** — what happens if the integration fails mid-flow (retries, reconciliation, manual fallback)
- **Ownership** — which team owns each side of the integration

## Impact assessment

For every gap or root cause identified, assess:
| Area | Impacted? | Severity | Notes |
|---|---|---|---|
| Users/customers | | | |
| Other systems | | | |
| Data integrity | | | |
| Compliance/regulatory | | | |
| Timeline/other initiatives | | | |

## Output structure

```markdown
# Gap Analysis: [Topic]

## Current State (As-Is)
## Desired State (To-Be)
## Identified Gaps
| # | Gap | Category | Severity |

## Root Cause (if investigating an issue)
Symptom → Root cause → Contributing factors

## Integration Requirements (if applicable)
Systems involved, interface type, data flow, failure handling

## Impact Assessment
## Recommendations
```

Keep recommendations proportional to the evidence — if the investigation surfaced open questions rather than a confirmed root cause, say so instead of forcing a conclusion.
