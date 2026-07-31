---
name: implementation-suggestion
description: Recommend practical implementation approaches for a requirement or problem, weighing business value, technical feasibility, scalability, risk, and fit with existing architecture — producing real alternatives with tradeoffs, not a single unexamined answer. Use whenever the user asks "how should we implement this", "suggest an implementation", "what are our options here", "design recommendation", or presents a requirement and clearly wants a solution approach rather than just documentation of the requirement itself.
---

# Implementation Suggestion

A BA's implementation suggestion isn't a technical design document — it's a business-informed framing of the *options* so engineering and stakeholders can make a fast, well-informed decision. Resist collapsing straight to "here's what we should build"; the value is in showing the tradeoffs.

## Approach

1. **Restate the requirement/problem being solved** in one or two sentences — confirms you're optimizing for the right thing before proposing options.
2. **Generate 2-3 genuinely distinct options.** If you can only think of one, you probably haven't looked hard enough — consider: build vs. configure existing system, manual/process fix vs. automation, phased vs. all-at-once, buy/integrate vs. build.
3. **Evaluate each option against the same criteria**, so they're actually comparable:
   - Business value / how well it solves the stated problem
   - Technical feasibility given the known architecture
   - Scalability (does it hold up as volume/usage grows?)
   - Risk (what could go wrong, and how bad if it does)
   - Effort/timeline (relative, not a false-precision estimate)
   - Impact on existing systems/processes
4. **Recommend one option explicitly**, with the reasoning tied back to the criteria — don't just list options and leave the decision unstated.

## Output structure

```markdown
# Implementation Options: [Topic]

## Problem
[1-2 sentence restatement]

## Option A: [Name]
**Approach:** ...
**Pros:** ...
**Cons:** ...
**Risk:** ...

## Option B: [Name]
...

## Comparison
| Criteria | Option A | Option B | Option C |
|---|---|---|---|
| Business value | | | |
| Feasibility | | | |
| Scalability | | | |
| Risk | | | |
| Effort | | | |

## Recommendation
[Which option, and why — tie back to the criteria above]

## Open Questions / Assumptions
[Anything that would change the recommendation if answered differently]
```

## Things to watch for

- Don't propose an option that silently contradicts a stated constraint (regulatory, budget, timeline) — if all good options conflict with a constraint, say so instead of picking one anyway.
- If you don't have enough information about the existing architecture to assess feasibility, say what's unknown rather than assuming a greenfield build.
- A recommendation without a stated risk is a red flag — every real option has a downside; naming it builds trust and helps the decision-maker.
