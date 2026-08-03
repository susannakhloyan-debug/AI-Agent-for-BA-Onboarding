---
name: backlog-management
description: Prioritize, organize, split, and maintain a healthy product backlog aligned with business goals — epic decomposition, dependency mapping, and release/roadmap sequencing. Use whenever the user asks to "prioritize the backlog", do "backlog grooming", break down an "epic", plan a "roadmap" or "release", or has a pile of unorganized stories/ideas that need structure and sequencing.
---

# Facilitating Product Backlog Management

A healthy backlog isn't just a long list — it's sequenced by value, right-sized for delivery, and free of hidden dependencies that will surprise the team mid-sprint. Your job is to bring that structure, and to make the *reasoning* behind prioritization visible so it's defensible to stakeholders.

## Prioritization frameworks

Pick the one that fits the situation (or ask if unclear):
- **MoSCoW** (Must/Should/Could/Won't) — fast, good for scope negotiation on a single release
- **Value vs. Effort** (2x2 grid) — good for a mixed backlog with wildly different sizes; favor high-value/low-effort ("quick wins") first
- **WSJF** (Weighted Shortest Job First: Cost of Delay ÷ Job Size) — better when there are many competing items and rough size estimates exist

Whichever is used, the rationale should be visible per item, not just a rank number — a stakeholder should be able to see *why* something is #3 and not #8.

## Epic decomposition

Split an epic into stories along natural seams, not arbitrarily:
- **Workflow steps** — each step in a process becomes its own story
- **Business rules/variations** — a rule with 3 distinct cases can become 3 stories if they're independently valuable
- **CRUD operations** — create/read/update/delete often split cleanly
- **User roles/permission tiers** — "admin can X" vs "end user can X" if they differ meaningfully
- **Data variations** — different data types or sources handled differently

Every resulting story should still be independently valuable (see INVEST in the requirement-documentation skill) — splitting for the sake of smallness without value is a common mistake.

## Dependency mapping

For each backlog item, note:
- What it depends on (must be done first)
- What depends on it (blocked until this is done)
- Whether the dependency is technical, data, or cross-team

Surface circular or chained dependencies explicitly — they're the most common cause of a sprint stalling.

## Output structure

```markdown
# Backlog: [Product/Epic]

## Prioritized Items
| # | Item | Priority/Score | Rationale | Dependencies |

## Epic Breakdown: [Epic Name]
- [Epic]
  - Story 1: ... (value: ..., depends on: ...)
  - Story 2: ...

## Release Recommendation
[What fits in the next release/sprint and why, what's deferred and why]
```

## Backlog health check

- [ ] No item has sat unrefined for multiple cycles without a reason
- [ ] Top of backlog (next 1-2 sprints) is fully Definition-of-Ready (see refinement-sessions skill)
- [ ] No orphaned dependencies (an item blocked by something not in the backlog at all)
- [ ] Prioritization rationale is stated, not just an ordinal rank
