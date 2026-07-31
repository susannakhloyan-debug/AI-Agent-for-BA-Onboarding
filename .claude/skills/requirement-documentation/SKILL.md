---
name: requirement-documentation
description: Produce implementation-ready requirement documentation — user stories, acceptance criteria (Gherkin-style), use cases, BRDs, and functional/technical specs — following Agile and BA best practices (INVEST, traceability). Use whenever the user asks to "write a user story", "define acceptance criteria", "prepare a BRD", "write a use case", "functional specification", or "technical documentation" for a feature or requirement. This is about formal deliverables — for the upstream discovery/interview work, defer to the requirement-gathering skill instead.
---

# Formulating Requirement Documentation

The output here is a deliverable a developer or QA engineer can pick up and implement without needing to track down the author for clarification. Ambiguity is the main failure mode — every requirement should be specific enough that two different developers would build the same thing.

## User stories

Format: `As a [role], I want [capability], so that [benefit]`. The "so that" clause isn't decorative — if you can't articulate it, the story's value is unclear and it needs more discovery, not just a template fill.

Validate every story against **INVEST**:
- **I**ndependent — can be built/delivered without waiting on another unfinished story
- **N**egotiable — describes intent, not a rigid spec (implementation details belong in AC, not the story itself)
- **V**aluable — delivers something meaningful to a user or the business on its own
- **E**stimable — the team could size it; if not, it's missing information
- **S**mall — fits in a sprint; if not, split it (see backlog-management skill for splitting patterns)
- **T**estable — has clear pass/fail conditions

## Acceptance criteria (Gherkin)

```
Given [initial context/state]
When [action/event occurs]
Then [expected outcome]
```

Write one scenario per distinct behavior, including edge cases: invalid input, boundary values, permission denials, empty states. A story with only a single "happy path" AC scenario is usually underspecified — ask what should NOT happen, too.

## Use cases

For more complex, multi-step interactions, use the fuller use case template:

```markdown
**Use Case:** [Name]
**Actor(s):** [Primary actor, secondary actors/systems]
**Preconditions:** [What must be true before this starts]
**Main Flow:**
1. ...
**Alternate Flows:**
- A1 (branches from step N): ...
**Exception Flows:**
- E1: ...
**Postconditions:** [State after successful completion]
```

## BRD / Functional Specification outline

```markdown
# [Title]
## Business Objective
## Scope (In / Out)
## Stakeholders
## Functional Requirements
   FR-1: ...
## Business Rules
## Non-Functional Requirements
## Assumptions
## Dependencies
## Acceptance Criteria
## Open Questions / Risks
```

Number requirements (FR-1, FR-2, ...) so they can be referenced from test cases, tickets, and later documents — this is what makes traceability possible later, not a separate exercise.

## Consistency & traceability

- Use the same terminology throughout a document — if the business calls it a "hold," don't switch to "block" halfway through
- Reference upstream requirement IDs in stories/AC so a reviewer can trace a story back to its business requirement
- If documenting multiple related stories (an epic breakdown), keep role names and terminology identical across all of them

## Quick check before delivering

- [ ] Every story passes INVEST
- [ ] AC covers happy path + at least one edge case per story
- [ ] No implementation detail baked into the story title/description that belongs in AC or a technical note instead
- [ ] Terminology is consistent with existing docs (ask if unsure rather than guessing)
