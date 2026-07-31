---
name: api-swagger-analysis
description: Interpret Swagger/OpenAPI documentation — explain endpoints, analyze request/response schemas, translate technical API contracts into business/integration requirements, and validate that a proposed integration is actually supported by the API. Use whenever the user mentions "Swagger", "OpenAPI", "API documentation", "endpoint", "REST API", pastes a request/response JSON schema, or needs to turn technical API details into requirements a non-technical stakeholder or developer handoff doc can use.
---

# Technical Knowledge – Swagger UI / API Analysis

A BA reading API documentation isn't debugging code — the goal is to translate a technical contract into business-usable requirements: what data is available, what's required vs. optional, what triggers an error, and whether the API actually supports what the business wants to do.

## Reading a Swagger/OpenAPI spec

For each relevant endpoint, extract:
- **Path + method** (e.g. `POST /accounts/{id}/hold`) and what business action it represents
- **Path/query parameters** — required vs. optional, and their meaning in business terms
- **Request body schema** — required fields, data types, constraints (max length, enum values, format like date/currency)
- **Response schema** — what's returned on success, and what fields the consuming system/UI will actually need
- **Status codes** — not just "200 OK", but what each error code means for the business flow (400 = bad input the user can fix, 403 = permission issue, 409 = conflict/already exists, 500 = system failure needing fallback handling)
- **Auth requirements** — what's needed to call this (API key, OAuth scope) — relevant for integration planning even if not for the BA to implement

## Translating to requirements

- Map each required field in the request schema to "what must the user/system provide" in the functional requirement
- Map response fields to "what can we actually display/use downstream" — if a stakeholder wants to show something the API doesn't return, that's a gap to flag immediately, not late
- Note **validation rules embedded in the schema** (enums, patterns, min/max) as business rules — these often ARE the business rules, just expressed technically
- Check for **rate limits, pagination, or idempotency requirements** mentioned in the spec — these affect integration design even at a BA level (e.g. "will need to handle paginated results" as a requirement)

## Output structure

```markdown
# API Analysis: [Endpoint/Feature]

## Endpoint
`METHOD /path` — [business purpose]

## Request
| Field | Required? | Type | Business meaning | Constraints |

## Response
| Field | Type | Business meaning |

## Status Codes / Error Handling
| Code | Meaning | Business handling |

## Gaps / Concerns
[Fields the business wants that aren't available, ambiguous constraints, missing error handling]

## Sample Request/Response
```json
...
```
```

## Validating a proposed integration

Before confirming an integration is feasible, check: does the API actually expose the data/action needed, in the right direction (can it push, or only be polled?), at the needed granularity (per-transaction vs. daily batch), and within any stated rate/volume limits. Flag any of these as a blocker if unmet rather than assuming it'll work out at build time.
