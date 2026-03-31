---
sidebar_label: useSettingValue
---

# `useSettingValue`

Returns a resolver function that applies three-tier precedence when resolving an [`AdminSettings`](../Settings.md) value:

1. **Local prop** — the component's own prop value
2. **Schema override** — an optional per-resource override (e.g. from `useResourceSchema`)
3. **Admin settings** — the value from [`<Settings>`](../Settings.md) / [`useSettings`](./useSettings.md)

Use this hook when building components that accept a local prop but should fall back to the global admin setting when the prop is not provided.

```tsx
import { useSettingValue } from '@strato-admin/core';

const MyButton = ({ mutationMode }: { mutationMode?: 'pessimistic' | 'optimistic' | 'undoable' }) => {
  const resolve = useSettingValue();
  const resolvedMode = resolve(mutationMode, 'mutationMode');
  // ...
};
```

## Signature

```ts
function useSettingValue(): Resolver;

type Resolver = <K extends keyof AdminSettings>(
  propValue: AdminSettings[K] | undefined,
  settingKey: K,
  schemaValue?: AdminSettings[K],
) => AdminSettings[K] | undefined;
```

The hook itself is called once per component. The returned `resolve` function can then be called as many times as needed — once per setting to resolve.

## Parameters of the resolver

| Parameter     | Type                            | Description                                                                 |
| :------------ | :------------------------------ | :-------------------------------------------------------------------------- |
| `propValue`   | `AdminSettings[K] \| undefined` | The component's own prop, already destructured. Pass `undefined` to skip.   |
| `settingKey`  | `keyof AdminSettings`           | The `AdminSettings` key to look up as the fallback.                         |
| `schemaValue` | `AdminSettings[K] \| undefined` | Optional middle-tier override (e.g. a per-resource schema value). Optional. |

The resolver uses strict `!== undefined` checks (not `??`) at every tier, so that `false` is treated as an intentional value — for example, `resolve(false, 'editRedirect')` returns `false` (disabling redirect) rather than falling through to the setting.

## Examples

### Resolving a single setting

```tsx
const resolve = useSettingValue();
const resolvedMode = resolve(mutationMode, 'mutationMode');
```

### Resolving multiple settings

```tsx
const resolve = useSettingValue();
const resolvedMutationMode = resolve(mutationMode, 'mutationMode');
const resolvedRedirect = resolve(redirect, 'editRedirect');
```

### Passing a per-resource schema override

```tsx
const schema = useResourceSchema();
const resolve = useSettingValue();

// Resolution order: prop → schema.mutationMode → settings.mutationMode
const resolvedMode = resolve(mutationMode, 'mutationMode', schema.mutationMode);
```

## When to use `useSettingValue` vs `useSettings`

- Use **`useSettingValue`** when your component accepts a prop that should fall back to the global setting. The resolver handles all the precedence logic for you.
- Use **[`useSettings`](./useSettings.md)** when you need to read multiple settings directly without any local-prop override logic (e.g. reading `listComponent` to render a preview).

## See also

- [`useSettings`](./useSettings.md) — reads raw settings values from context
- [`<Settings>`](../Settings.md) — declares admin-level defaults
