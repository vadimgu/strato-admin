# Strato Admin Constraints

These constraints enforce the architectural and UI design principles for the
Strato Admin project. They are designed to make the system more manageable,
predictable, and easier to use.

### 1. Strict UI Pattern Adherence (No Bespoke Designs)

**Constraint:** All UI layouts and components must strictly map to an
established AWS Cloudscape Design System pattern.

**Why:** Consistency builds trust and speeds up development. By outright
prohibiting custom CSS (e.g., banning inline styles or custom styled-components
unless absolutely necessary for a workaround) and bespoke layouts, you force
developers and designers to solve problems using the existing vocabulary (e.g.,
Split Panels, standard Table with Actions, standard Form layouts).

### 2. Strict Separation of Core Logic and UI (Package Boundaries)

**Constraint:** `strato-core` must remain 100% UI-agnostic, and
`strato-cloudscape` must act purely as a presentation layer mapped to
React-Admin hooks.

**Why:** To maintain the "Backend Agnostic" and decoupled nature of the
framework. `strato-cloudscape` components should not contain raw `fetch` calls
or custom state management for data; they should only consume React-Admin's
data context. Conversely, `strato-core` should never import anything from
`@cloudscape-design/components`.

### 3. Mandatory Internationalization (No Hardcoded Strings)

**Constraint:** All user-facing text inside `strato-cloudscape` and application
examples must be routed through the translation framework (`strato-i18n-icu` /
`strato-language-en`).

**Why:** The project lists "I18n Built-in" as a core feature. Enforcing no raw
text in JSX ensures the framework remains universally applicable and prevents
localization debt from accumulating.

### 4. Declarative-Only Component APIs (Prevent Prop Bloat)

**Constraint:** Component APIs must remain declarative and avoid exposing
underlying Cloudscape escape hatches unless explicitly wrapped.

**Why:** "Simple is better than complex." When wrapping a complex Cloudscape
component (like a Table or Form), do not just pass through all of its native
props. Instead, carefully curate the props exposed in the Strato Admin wrapper
to only those that align with React-Admin's declarative style. If a user needs
a highly specific Cloudscape feature, they should drop down to using raw
Cloudscape components alongside headless Strato Admin hooks, rather than
bloating the wrapper API.

### 5. Standardized Example/Demo Requirements

**Constraint:** Any new feature, prop, or component added to `strato-cloudscape`
must be accompanied by a Storybook story AND an update to the `dummyjson-demo`
or `demo` app.

**Why:** "Errors should never pass silently." Cloudscape components are complex
to configure correctly. Forcing developers to prove their wrapper works in a
real-world React-Admin context (the demo app) prevents regressions where a
component looks fine in Storybook but fails when hooked up to an actual
React-Admin data provider.
