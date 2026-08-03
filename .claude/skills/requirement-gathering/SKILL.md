---
name: requirement-gathering
description: Elicit and structure business, functional, non-functional, and technical requirements from a stakeholder request, ticket, or discovery conversation — surfacing what's missing rather than just documenting what was said. Use this whenever the user pastes a stakeholder ask, a vague feature request, meeting notes, or says things like "gather requirements", "what am I missing here", "help me prep for discovery", "requirements workshop", or "analyze this request" — even if they don't use the word "requirements" explicitly. Trigger proactively any time a request looks incomplete: missing actors, no acceptance criteria, unstated constraints, or unclear scope.
---

# Requirement Gathering

A stakeholder's first description of what they want is almost always incomplete — it describes the *feature* they imagined, not the *problem* being solved or the edges the solution needs to handle. Your job is not to transcribe the request; it's to pressure-test it and surface what's missing before it reaches a developer.

## Approach

1. **Restate the business objective.** Before listing requirements, confirm *why* this is being asked for — what business outcome or user pain it addresses. If the input doesn't say, flag it as an open question; a requirement without a known "why" is easy to mis-scope.
2. **Work through the requirement categories below**, pulling out what's stated and explicitly listing what's not.
3. **Identify assumptions** — anything you or the stakeholder is taking for granted that hasn't been confirmed.
4. **Flag dependencies** — other teams, systems, or decisions this work depends on.
5. **List open questions** — the specific things that need an answer before this is ready for documentation or development.

Don't try to invent answers to fill gaps. The value of this exercise is precision about what's unknown, not a plausible-sounding guess.

## Requirement categories to cover

- **Business requirements** — objective, success metric, who benefits, priority/urgency
- **Actors / stakeholders** — who initiates, who approves, who's affected, who's the end user (these are often different people)
- **Functional requirements** — what the system must do, step by step
- **Data requirements** — what data is created, read, updated; source of truth; validation rules
- **Business rules** — conditions, calculations, eligibility logic, exceptions
- **Non-functional requirements** — performance, security, availability, compliance/regulatory, auditability, localization
- **Integration points** — other systems this touches, and in which direction
- **Constraints** — technical, regulatory, timeline, budget
- **Out of scope** — explicitly what this does *not* cover, to prevent scope creep later

## Question bank (use to identify gaps, don't dump all of them on the user)

- What happens when [the unhappy path]? (invalid input, permission denied, system unavailable, duplicate submission)
- Who can perform this action, and who explicitly cannot?
- Is there an existing process this replaces, or is this net-new?
- What does "done" look like — how will we know this requirement is satisfied?
- Are there regulatory/compliance implications (data retention, KYC, audit trail)?
- What's the expected volume/scale, and does that change the approach?
- Does this need to work the same way across all channels (web, mobile, branch, API)?

## Output structure

```markdown
# Requirements Summary: [Topic]

## Business Objective
[Stated objective, or "Not specified — needs confirmation"]

## Stakeholders & Actors
| Role | Involvement |

## Functional Requirements
1. ...

## Business Rules
- ...

## Non-Functional Requirements
- ...

## Data Requirements
- ...

## Dependencies
- ...

## Assumptions
- ...

## Out of Scope
- ...

## Open Questions
1. ...
```

Only include sections that have content or genuine open questions — don't pad the template with empty headers.
