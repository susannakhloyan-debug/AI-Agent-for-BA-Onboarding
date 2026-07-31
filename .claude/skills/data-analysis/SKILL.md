---
name: data-analysis
description: Analyze datasets (CSV, Excel, pasted tables) at a business-analyst level — summary statistics, trend identification, anomaly detection, and business-readable insights and recommendations, not deep statistical modeling. Use whenever the user asks to "analyze this data", "review these metrics", "interpret this report", shares an Excel/CSV file and wants findings, or asks business-analysis questions about numbers (conversion rates, drop-off, volume trends). For building a chart/visualization as the primary deliverable, also consult the dataviz skill for chart design; for spreadsheet file creation/editing, consult the xlsx skill.
---

# Data Analysis (Novice Level)

This is business analysis of data, not data science — the goal is a clear, defensible business insight and recommendation, grounded in numbers a stakeholder can verify themselves. Keep the statistics simple (counts, rates, averages, trend direction) and the writing plain.

## Approach

1. **Understand the data first** — what does each column represent, what's the time range, what's the grain (one row per what?). State this up front so the reader can sanity-check your interpretation.
2. **Compute summary statistics** relevant to the business question: totals, averages, rates (conversion, drop-off, error rate), period-over-period change.
3. **Look for patterns**: trends over time, outliers, segments that behave differently (by product, region, channel, customer type).
4. **Validate before concluding** — check for an obvious data-quality explanation (missing values, duplicate rows, a spike from a known one-off event) before treating a pattern as a business insight. A calculation is only as trustworthy as the data it's built on.
5. **State findings as business observations**, not raw stats: "Conversion dropped 12% in week 3, driven by the mobile channel" rather than just a table of numbers with no interpretation.
6. **Recommend next steps** only when the data supports it — if the finding raises a question rather than answering one, say that instead of forcing a recommendation.

## Output structure

```markdown
# Analysis: [Topic]

## Data Overview
[Source, time range, grain, any caveats about completeness]

## Key Findings
1. [Business-readable observation, with the number backing it]

## Anomalies / Data Quality Notes
[Anything that looked off and how it was handled]

## Recommendations
[Only if warranted by the findings]

## Open Questions
[Where the data raises something that needs more investigation]
```

## When a chart helps

If a trend or comparison is easier to see visually than in a table, include one — but the chart should support a specific finding, not decorate the report. Load the **dataviz** skill for chart-design guidance (color, form, accessibility) before building it.

## Common pitfalls to avoid

- Reporting a percentage without the underlying counts (12% of what — 12 out of 100, or 1,200 out of 10,000? Very different confidence levels.)
- Treating correlation in a small sample as a confirmed cause
- Comparing periods of different length or seasonality without noting it
- Silently dropping rows with missing/bad data without mentioning it
