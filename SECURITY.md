# Security Policy

## Supported Versions

FixItNow is under active development. The `main` branch is the only supported development line at this time.

| Version or branch | Supported |
| --- | --- |
| `main` | Yes |
| Older commits and untagged deployments | No |

## Reporting a Vulnerability

Please do not disclose exploitable details, credentials, tokens, or personal data in a public issue.

Use GitHub's private vulnerability reporting flow:

<https://github.com/raskirayhan/FixItNow-/security/advisories/new>

Include the affected area, reproduction steps, impact, and a suggested mitigation when safe to do so. If private reporting is unavailable, open an issue requesting a private contact channel without including technical vulnerability details.

There is currently no guaranteed response-time or remediation SLA. Maintainers will assess reports based on severity and available project capacity.

## Secret Exposure Response

If a secret is committed or exposed:

1. Revoke or rotate the credential immediately with its provider.
2. Rotate `JWT_SECRET` and invalidate tokens if authentication material was exposed.
3. Rotate Stripe keys or webhook signing secrets if payment credentials were exposed.
4. Remove the secret from the working tree and repository history where appropriate; do not rely on deletion alone.
5. Record the incident without copying the secret into issues, logs, commits, or documentation.

## Current Security Expectations

- Keep `.env` files local and use a secret manager in hosted environments.
- Use unique high-entropy secrets per environment.
- Use Stripe test mode for local development.
- Review CORS origins, rate limits, webhook verification, and role checks before production deployment.
- Treat seeded demo data and credentials as local-only until explicitly hardened.
- Do not enter real customer or payment data into local development environments.

## Known Limitations

The current SPA stores JWTs in `localStorage`, the wallet credit endpoint is not a provider-backed funding flow, and the Render blueprint runs database push and seeding during deployment. These are documented limitations and should be addressed before production use.
