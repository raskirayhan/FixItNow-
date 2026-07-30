# Contributing to FixItNow

Thank you for contributing. FixItNow has separate frontend and backend packages, so keep changes focused on the package or documentation area they affect.

## Before You Start

- Read the [README](README.md) and [SECURITY.md](SECURITY.md).
- Search existing issues and pull requests before starting duplicate work.
- Never commit credentials, tokens, customer data, local `.env` files, or generated build output.
- Do not run database reset, push, or seed commands against a shared environment.

## Local Setup

```bash
cd backend
npm ci
npx prisma generate

cd ../frontend
npm ci
```

Copy the environment examples as described in the README and use local PostgreSQL and Stripe test resources only.

## Development Workflow

1. Create a focused branch from `main`.
2. Make the smallest change that solves the issue.
3. Keep frontend and backend changes independently understandable where possible.
4. Update documentation, API examples, or environment examples when behavior changes.
5. Run the validation commands that apply to the files you changed.
6. Open a pull request using the repository template.

## Validation

Run these commands from the relevant package directory:

```bash
# Backend
cd backend
npx prisma generate
npm run build
```

```bash
# Frontend
cd frontend
npm run lint
npm run build
```

The repository does not currently define automated test scripts. If you add behavior that is difficult to validate manually, include tests and the corresponding package script in the same change.

For documentation or configuration-only changes, also validate JSON/YAML syntax and confirm that no secret-looking values were introduced.

## Pull Requests

Include:

- A concise description of the problem and solution.
- The package or files affected.
- Validation commands and their results.
- Screenshots or a short recording for meaningful UI changes.
- Migration, environment, deployment, or security notes when relevant.

Keep commits reviewable, avoid unrelated formatting churn, and call out known limitations rather than hiding them.

## Code Style

- Follow the existing TypeScript, React, and naming conventions.
- Prefer existing utilities and components before introducing new abstractions.
- Keep API changes reflected in Swagger annotations, the Postman collection, and the README when appropriate.
- Use safe, explicit error handling and preserve role boundaries.

## Questions

For general questions, open a discussion or issue without including private data. Report security vulnerabilities through the private process in [SECURITY.md](SECURITY.md).
