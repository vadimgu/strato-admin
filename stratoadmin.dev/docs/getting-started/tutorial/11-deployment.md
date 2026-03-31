# Deployment & Best Practices

StratoShop is complete. In this final chapter, we will build it for production, cover the basics of testing, and point you toward the next steps in the Strato Admin documentation.

## Production Build

Strato Admin projects use **Vite**, which produces a highly optimized static bundle. Run:

```bash title="Terminal"
npm run build
```

Vite outputs a `dist/` directory containing minified HTML, JS, and CSS. The bundle is code-split automatically — Cloudscape design system components are loaded on demand.

### Preview the Production Build Locally

Before deploying, you can serve the production build locally to catch any issues:

```bash title="Terminal"
npm run preview
```

### Environment Variables

Your data provider's API base URL should come from an environment variable, not be hardcoded. Vite exposes variables prefixed with `VITE_`:

```ts title="src/dataProvider.ts"
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
```

Create a `.env.production` file at the project root:

```
VITE_API_URL=https://api.stratoshop.example.com
```

## Deployment Options

The `dist/` folder is a standard single-page application. It can be deployed to any static hosting service:

| Provider                | Command                               |
| ----------------------- | ------------------------------------- |
| **Netlify**             | `netlify deploy --prod --dir=dist`    |
| **Vercel**              | `vercel --prod`                       |
| **AWS S3 + CloudFront** | `aws s3 sync dist/ s3://your-bucket`  |
| **GitHub Pages**        | Push `dist/` to the `gh-pages` branch |

Because the app uses client-side routing, configure your host to serve `index.html` for all routes (a "SPA fallback" or "404 → index.html" rule).

## Testing Strategy

### Unit Tests with Vitest

Strato Admin uses **Vitest** for unit tests. You can test custom hooks and pure logic without a browser:

```bash title="Terminal"
npx vitest run
```

For component tests that render Strato components, wrap the component under test in `<Admin>` with a mock data provider:

```tsx title="src/MyComponent.test.tsx"
import { render } from '@testing-library/react';
import { Admin } from '@strato-admin/admin';
import { dataProvider } from '@strato-admin/faker-ecommerce';
import { MyComponent } from './MyComponent';

test('renders without error', () => {
  render(
    <Admin dataProvider={dataProvider}>
      <MyComponent />
    </Admin>,
  );
});
```

### Browser Tests with Playwright

For end-to-end tests, use **Playwright** to drive a real browser against a running dev server:

```bash title="Terminal"
# Install Playwright once
npx playwright install chromium

# Run end-to-end tests
npx playwright test
```

A typical test navigates to a list page, clicks into a record, and asserts on the rendered content:

```ts title="e2e/products.spec.ts"
import { test, expect } from '@playwright/test';

test('can view a product', async ({ page }) => {
  await page.goto('/products');
  await page
    .getByRole('link', { name: /product/i })
    .first()
    .click();
  await expect(page.getByRole('heading')).toBeVisible();
});
```

## Checklist Before Going Live

- [ ] `VITE_API_URL` is set in `.env.production`
- [ ] Auth provider is wired to your real backend (not the mock)
- [ ] SPA fallback rule configured on your hosting provider
- [ ] `npm run build` succeeds with no TypeScript errors

## Next Steps

You've completed the StratoShop tutorial. Here is where to go from here:

**Reference documentation**

- [Admin](/docs/reference/Admin) — all props for the root component
- [ResourceSchema](/docs/reference/ResourceSchema) — the full schema API
- [Fields](/docs/reference/fields/common-props) and [Inputs](/docs/reference/inputs) — every built-in component

**Core Concepts**

- [Data Providers](/docs/core-concepts/data-providers) — connecting to a real REST or GraphQL API
- [Auth Providers](/docs/core-concepts/auth-providers) — deeper authentication patterns
- [Translation](/docs/core-concepts/translation) — advanced ICU MessageFormat usage

**Community**

- [GitHub](https://github.com/stratoadmin/strato-admin) — issues, discussions, and source code
