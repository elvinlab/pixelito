# Notes — Supabase terms for a free, commercial-leaning project (Phase 0, task 11)

- **Date:** 2026-10-22
- **Sources:** `supabase.com/terms` and `supabase.com/docs/guides/platform/billing-on-supabase`, read through a fetch tool that **summarises** pages. Quotes below come from that summary; read the pages yourself before relying on them. Not legal advice.
- **Not read:** the Acceptable Use Policy, the pricing page FAQ, and any fair-use text. The Terms footer links to an AUP.

## What the sources say

| Question | Answer from the sources |
|---|---|
| Does the Terms page restrict commercial use of the Free plan? | **Not addressed.** The page does not mention a Free plan. Section 2(a) says use is "limited to Customer's internal business purposes and the features and functionalities specified in the Order"; Section 13(b)(iii) mentions "Customer ... using the Service for commercial purposes" only for arbitration fees |
| Competing use | Section 2(c) bars "the development, provision, or use of a competing software service or product" (Pixelito is not a database service, so this is unlikely to matter) |
| Keep-alive pings or automated access | **Not mentioned.** Closest rule, Section 2(c)(vii): no access "other than by an Authorized User through the use of valid access credentials" |
| Pausing after inactivity | **Not in the Terms and not in the billing doc.** The billing doc says paused projects do not count toward the free project limit; the length of inactivity is not given there. The "paused after one week" figure in ADR 0001 comes from earlier research and is not confirmed by these two pages |
| Free plan limits (billing doc) | 2 free projects across the organisations you own or administer; 5 GB egress; 500 MB database per project; 50,000 monthly active users; 1 GB storage; 500,000 Edge Function invocations; 2 million Realtime messages; 200 Realtime peak connections |
| Suspension | Section 2(e) allows temporary suspension on grounds such as threats, fraud or security risk; inactivity is not listed there. Section 5(c) allows usage caps and throttling |
| Production or commercial use of Free | **Not covered** in the billing doc |

## Reading

- Nothing found **forbids** running a small commercial-leaning project on the Free plan, but nothing found **allows** it either. The Terms read as written for a paying "Customer" with an "Order", and do not say how they apply to free accounts. Treat commercial use of Free as **unconfirmed**.
- Keep-alive pings are **not** addressed. Do not depend on them: if Supabase changes rules or rate-limits them, the project pauses. Cheaper and safer ideas to evaluate later: real traffic keeps a project awake once the product has users; a scheduled job that does real work (cleanup of abandoned guests, already planned in ADR 0001) doubles as activity; or accept the paid plan when launch needs always-on.
- The MAU limit (50,000) and database size (500 MB) are generous for the MVP; the 500 MB cap is the first limit likely to bite if saves are stored in the database. That argues for storing save blobs in object storage or keeping saves local at first (the MVP is local-first).

## To confirm with the source

1. Read the Acceptable Use Policy and the pricing FAQ in a browser.
2. If the answer matters before launch, ask Supabase support in writing: "May a free, ad-free hobby-to-commercial web app run on the Free plan, and are scheduled health-check requests allowed?" (Nothing sent; owner decides.)
3. Re-check the inactivity-pause period on the live dashboard docs.

## Consequence for the plan

ADR 0001 unverified items 4 and 5 move from "unknown" to "no prohibition found, no permission found; keep-alive unaddressed". Billing for the backend stays a possible early cost; keep the backend choice behind the hexagonal boundary from ADR 0002 so it can be swapped.
