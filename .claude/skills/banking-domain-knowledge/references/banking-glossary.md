# Banking Domain Glossary & Business Rules Reference

## Accounts

- **Current/checking account** — transactional account, no/limited interest, frequent withdrawals expected
- **Savings account** — interest-bearing, may limit withdrawal frequency
- **Escrow account** — holds funds for a third party pending a condition (e.g. property closing)
- **Account status**: `active` → `dormant` (no activity for a defined period, often triggers regulatory reporting) → `closed`. Separately, an account can be `frozen`/`blocked` (temporary, reversible, often compliance- or fraud-triggered) vs. `closed` (terminal).
- **Ownership**: single owner, joint (and/or — either can act alone; and — requires both), authorized signer (can operate but doesn't own)
- Typical business rules: minimum balance requirements, overdraft eligibility/limits, dormancy triggers, closure eligibility (zero balance, no pending transactions)

## Cards

- **Debit card** — draws directly from a linked account, no credit extended
- **Credit card** — draws against a credit line, has a billing cycle and statement/due date
- **Authorization** — a hold placed on funds/credit limit at time of purchase; **settlement** — the actual funds movement, often T+1/T+2 after authorization (amounts can differ, e.g. tips added after auth)
- **Chargeback/dispute** — cardholder-initiated reversal process, has defined windows and evidence requirements
- Lifecycle: issuance → activation (often requires cardholder action, e.g. first-use PIN set) → active → suspended/blocked (lost/stolen/fraud) → expired/reissued → closed
- **PCI-DSS**: any system that stores, processes, or transmits card numbers (PAN) is in scope — flag this as a compliance consideration whenever a requirement involves storing/displaying card data; full PAN should generally not be stored/displayed except by systems explicitly scoped for it (masked/tokenized forms used elsewhere)

## Client Onboarding & KYC

- **KYC (Know Your Customer)** — identity verification for individuals; **KYB (Know Your Business)** — equivalent for business entities (beneficial ownership, business registration)
- **Risk-based approach**: verification depth (tiering) typically scales with the client's assessed risk (e.g. simplified/standard/enhanced due diligence)
- **AML screening**: checks against sanctions lists, politically exposed persons (PEP) lists, adverse media — typically run at onboarding AND periodically/on trigger events afterward, not just once
- **Ongoing monitoring** — transaction monitoring for patterns inconsistent with the client's stated profile, not just a point-in-time onboarding check
- Typical business rules: required documents by client type/risk tier, re-verification schedule, what triggers enhanced due diligence (large transactions, high-risk jurisdiction, PEP status)

## Loan Products

- Lifecycle: **origination** (application) → **underwriting** (creditworthiness assessment) → **approval/decline** → **disbursement** → **servicing** (repayment period) → **closure** (paid off) or **default/collections**
- **Secured** (backed by collateral, e.g. mortgage, auto loan) vs. **unsecured** (personal loan, credit card) — affects risk, rate, and recovery process
- **Interest**: fixed (rate doesn't change) vs. variable (tied to a reference rate); **APR** includes fees, distinct from the nominal/stated interest rate
- **Delinquency**: typically has defined stages (e.g. 30/60/90 days past due) with escalating actions, ending in default/write-off/collections if unresolved
- Typical business rules: eligibility criteria, LTV (loan-to-value) limits for secured loans, DTI (debt-to-income) checks, grace periods, prepayment terms

## Deposits

- **Demand deposit** — withdrawable anytime (checking/savings) vs. **term/time deposit** — fixed term, penalty for early withdrawal
- **Interest accrual**: simple vs. compound; capitalization frequency (daily/monthly/annually) affects actual yield
- **Early withdrawal**: typically incurs a penalty (forfeited interest) — a requirement touching term deposits should specify this handling
- **Deposit insurance** — many jurisdictions insure deposits up to a limit per depositor per institution; relevant to disclosures and risk communication, not typically a system business rule

## Bonds / Investments

- **Issuance** — primary market (new issue) vs. secondary market (resale)
- **Coupon** — periodic interest payment; **maturity** — date principal is repaid
- **Custody** — who holds/records ownership of the security on behalf of the client
- **Suitability/appropriateness** — many jurisdictions require assessing whether an investment product is appropriate for a given retail client's risk profile/experience before allowing purchase — flag this as a likely requirement for any retail bond/investment feature

## Cross-cutting terms

- **Hold** — temporary restriction on availability of funds (e.g. pending check clearance, card authorization) — reversible, time-bound
- **Block** — restriction on an account/instrument, often compliance or fraud driven, may require manual review to lift
- **Freeze** — typically a stronger, often legally-mandated restriction (court order, regulatory action) — distinct process from a routine hold/block
- **Reconciliation** — matching records between systems (e.g. core banking vs. card processor) to ensure consistency — often a required non-functional consideration for anything moving money between systems
