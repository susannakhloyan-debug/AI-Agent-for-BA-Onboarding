---
name: banking-domain-knowledge
description: Apply retail/commercial banking domain expertise — cards, accounts, client onboarding & KYC, loan products, deposits, bonds/investments — to validate business rules, spot missing regulatory or compliance considerations, and explain banking terminology. Use automatically whenever a discussion involves banking products or processes (cards, accounts, payments, loans, onboarding, KYC/AML, deposits, investments, compliance) even if the user's actual ask is one of the other BA skills (requirements, documentation, process modeling) — this skill supplies the domain-correctness layer on top of those, not a replacement for them.
---

# Domain Knowledge: Cards, Accounts, KYC, Loans, Deposits, Bonds

This skill is a cross-cutting layer: when a requirement, process, or document touches a banking product, use this alongside whatever BA skill is doing the primary work (e.g. requirement-gathering + banking-domain-knowledge together) to make sure the output is domain-correct, not just structurally correct.

## How to use this

1. Identify which product domain(s) the task touches (see `references/banking-glossary.md` for term definitions and typical business rules per domain).
2. Check the requirement/process/document against the domain's **typical business rules and regulatory touchpoints** — flag anything missing or inconsistent with how the domain normally works.
3. Use correct terminology — banking has precise meanings for terms that sound interchangeable to a layperson (e.g. "hold" vs. "block" vs. "freeze" on an account are often legally/operationally distinct). If the input uses a term loosely, clarify rather than propagate the ambiguity.
4. Don't assert specific regulatory requirements as universal fact — banking regulation is jurisdiction-specific (AML/KYC thresholds, data residency, consumer protection rules differ by country/regulator). Frame these as "typically requires X — confirm against [jurisdiction]'s specific regulation" rather than stating them as given.

## Domain quick-reference

- **Accounts** — account types (current/checking, savings, escrow), status lifecycle (active, dormant, closed, frozen), ownership models (single, joint, authorized signer)
- **Cards** — debit vs. credit, issuance/activation flow, authorization vs. settlement, chargebacks/disputes, PCI-DSS scope for anything touching card data
- **Client onboarding & KYC** — identity verification tiers, KYC vs. KYB (business), AML screening (sanctions/PEP lists), risk-based due diligence, ongoing monitoring vs. one-time onboarding check
- **Loan products** — origination → underwriting → disbursement → servicing → closure lifecycle, collateral/secured vs. unsecured, interest calculation basics (fixed/variable, APR vs. nominal rate), delinquency/default handling
- **Deposits** — term vs. demand deposits, interest accrual/capitalization, early withdrawal handling, deposit insurance considerations
- **Bonds/investments** — issuance, coupon/maturity terms, custody, suitability/appropriateness checks for retail clients

See `references/banking-glossary.md` for fuller definitions, common business rules, and typical validation logic per domain — read it when the task needs specific terminology or rule detail rather than the summary above.

## Regulatory considerations to flag (generically — always confirm specifics)

- AML/KYC: identity verification, sanctions screening, transaction monitoring thresholds
- Data privacy: what client data can be stored/shared, retention periods
- Consumer protection: disclosure requirements (rates, fees, terms), cooling-off/cancellation rights
- Audit trail: many banking actions require an immutable record of who did what, when — flag if a requirement doesn't account for this

## Output

Don't produce a standalone "domain analysis" document unless asked — instead, weave domain corrections and flags directly into whatever the primary skill (requirements, documentation, process model, etc.) is producing, clearly marked, e.g. *"Domain note: KYC re-verification is typically required here on a risk-based schedule, not just at onboarding — confirm this is covered."*
