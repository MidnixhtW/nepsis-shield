# Security policy

Nepsis Shield keeps prayer notes, confession prep, and other private material on the person's own device. Prayer groups and the fast count are the only features that talk to a server, and they store first names, short prayer requests, and random ids only.

## Reporting a problem

If you find a security problem, please report it privately:

- Use GitHub's "Report a vulnerability" button on the Security tab of this repository, or
- Email security@nepsisshield.com

Please do not open a public issue for security problems. You will get a reply within 7 days.

## What is in scope

- nepsisshield.com and www.nepsisshield.com
- The `/api/groups` and `/api/fasts` endpoints
- The Android app built from this repository

Please do not run load tests or automated scanners against the live site, and do not access other people's prayer groups.

## Protections in place

- Strict security headers and a Content Security Policy (see `SECURITY_HEADERS.md`)
- CORS limited to the app's own origins
- Per-IP rate limits on every API action, plus a daily cap on new prayer groups
- Request body size limit and strict input checks on the API
- Passphrase backups use PBKDF2 (600,000 rounds) and AES-GCM
- Dependabot, CodeQL, and `pnpm audit` in CI
