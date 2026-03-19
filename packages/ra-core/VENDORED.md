# Vendored Package: ra-core

This package is a vendored version of `ra-core` from the official `react-admin` project.

## Metadata

- **Original Source:** https://github.com/marmelab/react-admin/tree/master/packages/ra-core
- **Original Version:** 5.14.1 (as per package.json)
- **Original Git Hash:** 19dcb264898c8e01c408eb66ce02c50b67c851ab (from original gitHead)
- **Vendored Date:** March 14, 2026
- **Vendored By:** Gemini CLI

## Reason for Vendoring

- To provide full control and the ability to customize `ra-core` to align with the Cloudscape design system.
- To avoid being blocked by upstream PR reviews for architectural changes specific to Strato Admin.
- To resolve deep integration issues with Cloudscape that are not supported by the standard `react-admin` core.

## Local Modifications

- Updated `tsconfig.json` to be self-contained and compatible with the Strato Admin workspace.
- Added `@ts-expect-error` and type adjustments in several files to ensure compatibility with React 19 (original code was written for React 18).
- Removed `@types/eslint__js` dependency causing type conflicts.
- Added missing devDependencies: `@tiptap/react`, `@remix-run/router`.
