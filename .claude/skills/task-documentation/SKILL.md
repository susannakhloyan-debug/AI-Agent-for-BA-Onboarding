---
name: task-documentation
description: Generate well-structured, team-consumable documentation and task descriptions formatted for Jira, Confluence, Azure DevOps, or similar tools — tickets, subtasks, release notes, and wiki pages. Use whenever the user asks to "create a Jira ticket", "write a Confluence page", "document this feature" for the team wiki, or "prepare a task" for a tracker — this is about tool-ready formatting on top of already-defined requirements, not the requirements work itself (see requirement-documentation for that).
---

# Documentation and Task Management Tools

The output here needs to drop cleanly into the target tool with minimal reformatting — right heading levels, right field structure, no BA-only jargon left unexplained for a dev/QA audience.

## Jira-style ticket

```markdown
**Title:** [Concise, action-oriented — "Add X" not "X"]

**Type:** Story / Bug / Task

**Description:**
As a [role], I want [capability], so that [benefit].

**Acceptance Criteria:**
- Given... When... Then...

**Subtasks:**
- [ ] ...

**Labels/Components:** ...
**Linked issues:** [blocks / is blocked by / relates to]
```

Keep the title scannable in a backlog list — someone should understand roughly what it is without opening the ticket.

## Confluence-style page

```markdown
# [Feature/Process Name]

## Overview
[2-3 sentences — what this is and why it exists]

## Details
[Main content — process, requirement, or reference material]

## Related Links
- [Linked tickets, other pages]

## Revision Notes
| Date | Author | Change |
```

Use Confluence's native structure conventions: short paragraphs, tables for anything comparative, and a table of contents for pages longer than a few screens.

## Release notes

```markdown
## [Version/Release] — [Date]

### New Features
- ...

### Improvements
- ...

### Bug Fixes
- ...

### Known Issues
- ...
```

Write release notes for the *audience reading them* — internal engineering notes can be technical; customer-facing notes should describe user-visible impact, not implementation detail.

## Task breakdown (epic → tasks)

When breaking a feature into tracker-ready tasks, keep each task independently assignable (one owner, one clear "done" state) and cross-reference the parent story/epic ID so traceability holds in the tool, not just in a separate doc.

## Formatting checklist

- [ ] Headings match the target tool's conventions (Jira issue fields vs. Confluence page structure)
- [ ] No unresolved placeholders (TBD, XXX) left in a ticket meant to be actionable now
- [ ] Links/references use the tool's linking convention, not plain text like "see the other ticket"
- [ ] Audience-appropriate language (internal jargon fine for eng tickets, avoided in customer-facing release notes)
