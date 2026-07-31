---
name: refinement-sessions
description: Prepare and facilitate backlog refinement sessions — surfacing ambiguities, missing acceptance criteria, dependencies, and risks in stories so they reach Definition of Ready before sprint planning. Use whenever the user asks to "prepare for refinement", "refine the backlog", "review this story" for readiness, or "sprint planning prep", or pastes a story/set of stories and wants to know if they're ready for development.
---

# Conducting High-Quality Refinement Sessions

The point of refinement isn't to reformat a story — it's to find the ambiguity *before* a developer finds it mid-sprint, when it's expensive to resolve. Read every story looking for what a developer would get stuck on.

## Definition of Ready checklist

Run every story against this before calling it refinement-ready:

- [ ] Business value/goal is clear (the "so that" isn't vague filler)
- [ ] Acceptance criteria exist and cover edge cases, not just the happy path
- [ ] Dependencies on other stories, teams, or systems are identified
- [ ] No open questions blocking a developer from starting
- [ ] Story is small enough to fit in a sprint (if not, flag for splitting)
- [ ] UI/UX is available or explicitly not needed for this story
- [ ] Non-functional expectations are stated if relevant (performance, security)
- [ ] Data/business rules referenced in AC are fully specified, not "TBD"

A story can look complete and still fail this — e.g. AC that only covers success cases, or a dependency on an API that doesn't exist yet.

## What to look for in each story

- **Ambiguous language** — "handle appropriately", "as needed", "similar to X" without specifics. Flag these explicitly; they read as clear to the author but aren't.
- **Missing actors** — does the AC account for every role who'd interact with this (admin vs. end user, internal vs. external)?
- **Unstated assumptions** — things the story assumes are already true (a field exists, a permission model is in place) that haven't been confirmed.
- **Sizing red flags** — a story with 10+ AC scenarios or multiple unrelated capabilities bundled together usually needs splitting.
- **Undocumented dependencies** — references to "the new API" or "once X ships" without a tracked link.

## Refinement session agenda template

```markdown
# Refinement: [Sprint/Date]

## Stories under review
1. [STORY-ID] — [Title]

## Per-story discussion points
### [STORY-ID]
- Clarification needed: ...
- Dependency: ...
- Suggested AC addition: ...
- Sizing note: ...

## Stories ready for sprint
## Stories needing follow-up (owner + question)
```

## Output

For each story reviewed, give a **Definition of Ready verdict** (Ready / Not Ready) plus the specific gaps found — not a vague "looks mostly okay." If a story is Ready, say so plainly; don't manufacture nitpicks to seem thorough.
