# Contributing to Unified World Data

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+

### Local Setup
1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Copy environment variables: `cp .env.example .env.local`
4. Get free API keys (see `.env.example` for links to each service)
5. Start dev server: `npm run dev`
6. Open [http://localhost:3000](http://localhost:3000)

## Code Standards

- **TypeScript:** Strict mode enabled — no `any` types
- **Zod:** All external API responses must be validated with a Zod schema in `lib/schemas.ts`
- **Error handling:** All API routes must use the circuit breaker pattern from `lib/circuit-breaker.ts`
- **Formatting:** Run `npm run lint` before committing

## Adding a New Data Source

1. Get a free API key for your data source
2. Add the env var to `.env.example` (no real keys!) and `README.md`
3. Add a Zod schema to `lib/schemas.ts`
4. Add TypeScript types to `lib/types.ts` (if separate from schema inference)
5. Create the API route: `app/api/your-source/route.ts`
   - Use `circuitBreaker.execute()` for the external call
   - Validate response with your Zod schema
   - Set appropriate `revalidate` value
6. Create a SWR hook: `hooks/useYourSource.ts`
7. Create the tab component: `components/tabs/YourSourceTab.tsx`
8. Register in `lib/constants.ts` TABS array
9. Add tests: `tests/api/your-source.test.ts`
10. Update the README data sources table
11. Submit a PR with a description of the data source and its refresh rate

## Testing

```bash
npm run test           # Run all tests once
npm run test:watch     # Watch mode
npm run test:coverage  # With coverage report
```

All PRs must pass CI (lint + type-check + tests + build).

## Commit Messages

Use semantic commit prefixes:
- `feat:` New tab or data source
- `fix:` Bug fix
- `docs:` Documentation only
- `chore:` Config, deps, tooling
- `test:` Adding or updating tests

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes with tests
3. Run `npm run lint && npm run test && npm run build`
4. Submit PR with a clear description
5. CI must pass before merge
