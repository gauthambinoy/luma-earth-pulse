# Contributing to Unified World Data

## Setup
```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Architecture
- **Next.js 14** App Router with Server Components
- **SWR** for data fetching with automatic revalidation
- **Circuit Breaker** pattern for API resilience
- **Zod** for runtime data validation
- **Server-Sent Events** for real-time updates

## Adding a New Data Tab
1. Create component in `components/tabs/`
2. Add API route in `app/api/`
3. Register in tab configuration
4. Add Zod schemas for validation
5. Wire up SWR hooks with error boundaries

## Adding a New API Source
1. Add API client in `lib/apis/`
2. Implement circuit breaker wrapper
3. Add Zod validation schema
4. Update relevant tab component

## Code Style
- TypeScript strict mode — no `any` types
- Tailwind for all styling
- Zod for all external data validation
- Error boundaries per tab
