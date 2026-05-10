# Tests

## How to Run

```bash
npm test
```

## Test Files

### `__tests__/auditEngine.test.ts`

Covers the core audit engine logic. All 5 tests must pass.

| Test | What it covers |
|------|---------------|
| Copilot Enterprise with 3 seats recommends downgrade to Business | Verifies that GitHub Copilot Enterprise with a small team triggers a downgrade recommendation with savings > 0 |
| GitHub Copilot Individual with 1 seat is already optimal | Verifies that an already-optimal plan returns zero savings — engine does not manufacture savings |
| ChatGPT Team with 2 seats recommends Plus | Verifies that ChatGPT Team with 2 users triggers a downgrade to Plus with correct plan name |
| Total monthly savings is sum of all tool savings | Verifies that totalMonthlySavings correctly aggregates savings across multiple tools |
| Annual savings equals 12x monthly savings | Verifies that totalAnnualSavings is exactly 12 times totalMonthlySavings |

## Running Tests

```bash
# Run all tests
npm test

# Expected output
✓ Copilot Enterprise with 3 seats recommends downgrade to Business
✓ GitHub Copilot Individual with 1 seat is already optimal
✓ ChatGPT Team with 2 seats recommends Plus
✓ Total monthly savings is sum of all tool savings
✓ Annual savings equals 12x monthly savings

Test Files  1 passed (1)
Tests  5 passed (5)
```

## Test Coverage

The audit engine is the most critical logic in the app — it is the part a finance person reads and must agree with. All 5 tests cover the engine specifically as required.

Areas not covered by automated tests (would add in week 2):
- API routes (would use Vitest with mocked Supabase)
- Form state persistence (would use Playwright e2e tests)
- Groq fallback behavior (would mock the Groq SDK)