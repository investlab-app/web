# InvestLab Web

[![Test](https://github.com/investlab-app/web/actions/workflows/test.yml/badge.svg)](https://github.com/investlab-app/web/actions/workflows/test.yml)
[![Dependency Analysis](https://github.com/investlab-app/web/actions/workflows/dependency-check.yml/badge.svg)](https://github.com/investlab-app/web/actions/workflows/dependency-check.yml)

InvestLab is a beginner-friendly paper-trading platform.

# Getting Started

To run this application:

```bash
pnpm install
pnpm dev
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
pnpm test
```

## End-to-End Testing (Playwright)

This project uses [Playwright](https://playwright.dev/) for end-to-end (E2E) testing.

- E2E test files are located in the `e2e/` directory.
- To run all Playwright tests:

```bash
pnpm test:e2e
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.

## Shadcn

This project uses [Shadcn](https://ui.shadcn.com/) components.

## Routing

This project uses [TanStack Router](https://tanstack.com/router).

## Linting

This project uses [ESLint](https://eslint.org/) for linting. You can run the linter with:

```bash
pnpm lint
```

## Formatting

This project uses [Prettier](https://prettier.io/) for code formatting. You can run the formatter with:

```bash
pnpm format
```

