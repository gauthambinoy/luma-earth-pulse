# Security Policy

## Reporting a Vulnerability
1. **Do NOT** open a public issue
2. Email the maintainer directly

## Security Measures
- No API keys required for basic functionality (all 200+ APIs are free/keyless)
- Circuit breaker prevents cascading failures
- Zod validation on all external API responses
- CSP headers in production
