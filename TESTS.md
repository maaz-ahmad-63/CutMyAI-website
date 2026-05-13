# Tests

## 1. `tests/audit-engine.test.ts`
- **What it covers:** The audit engine logic in `lib/audit-engine.ts`, including keep recommendations, downgrade logic, overlapping-tool consolidation, switch recommendations, sorting by savings, and shareable ID passthrough.
- **How to run it:** `npm test`
- **Notes:** This file contains 5 audit-engine test cases and runs with Vitest in a Node environment.

## Test coverage summary

- Free tool stays on current plan when the use case matches.
- Business plan downgrades when the use case does not need it.
- Overlapping LLM tools get consolidated.
- Strong alternatives trigger a switch recommendation.
- Multiple recommendations are sorted by savings and totals are calculated correctly.
