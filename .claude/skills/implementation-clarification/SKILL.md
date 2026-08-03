---
name: implementation-clarification
description: Answer developer/QA questions about business requirements during implementation, resolve ambiguities against the original intent, log decisions, and assess the impact of proposed changes on existing acceptance criteria. Use whenever the user relays a "developer question", "QA question", asks to "clarify this requirement", describes an "implementation issue" found mid-build, or needs to evaluate a change request that surfaced after development started.
---

# Providing Clarification During Implementation Stage

During implementation, a BA's job is to keep the build aligned with business intent even as reality surfaces things the original requirement didn't anticipate — without silently expanding scope or leaving a decision undocumented.

## Answering a clarification question

1. **Restate the question** in your own words to confirm you understood what's actually being asked (implementation questions are often underspecified in the way they're relayed).
2. **Check it against the original requirement/AC** — is this genuinely ambiguous, or does the existing documentation already answer it and just wasn't read closely?
3. **Answer directly**, grounded in the stated business objective — not just "what seems reasonable," but what serves the original goal.
4. **State whether this changes the acceptance criteria.** If the answer reveals a gap the AC didn't cover, say so explicitly and propose the AC update — don't let it stay undocumented.
5. **Log the decision** (see below) so it isn't re-litigated later or lost when the next question touches the same area.

## Assessing a change request mid-implementation

- **What's changing** and why it's being requested now (new information, changed business need, technical constraint discovered)
- **Impact on existing AC/stories** — which need to be updated, added, or removed
- **Impact on work already done** — is anything built going to need rework?
- **Impact on timeline/scope** — be honest if the change is non-trivial rather than downplaying it to avoid friction
- **Recommendation**: accept as-is, accept with modified scope, or defer to a follow-up story

Don't wave through scope creep dressed as a "small clarification" — if a question is really asking for new functionality, name that distinction explicitly.

## Decision log entry format

```markdown
**Date:** ...
**Raised by:** [Dev/QA/Stakeholder]
**Question/Issue:** ...
**Decision:** ...
**Rationale:** [tied to business objective]
**AC/Story updated:** [Yes — link / No, no change needed]
```

Keep a running decision log per feature/epic if multiple clarifications come in — it prevents the same question being answered two different ways by two different people.

## Output

Give a direct answer first, then the supporting reasoning and any documentation updates needed — developers reading this mid-build want the answer immediately, not buried after three paragraphs of context.
