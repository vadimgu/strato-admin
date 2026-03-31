# `<CreateButton>`

`CreateButton` navigates to the create page for the current resource. It renders only when the resource has `hasCreate` set (i.e. a `<Resource>` with a `create` prop). It is typically placed in the `actions` area of a `<List>`.

## Usage

```tsx
import { CreateButton } from '@strato-admin/cloudscape';

// Inside a List — resource is inferred from context
<List actions={<CreateButton />}>...</List>;
```

The button label defaults to the translated string for `strato.action.create` ("Create"). Pass `label` to override it.

```tsx
<CreateButton label="New product" />
```

### Specifying a resource

By default `CreateButton` reads the resource from the current resource context. You can override it explicitly:

```tsx
<CreateButton resource="products" />
```

### Changing the variant

The default variant is `primary`. Use `normal` for a secondary-style button.

```tsx
<CreateButton variant="normal" />
```

## Props

import PropsTable from '@site/src/components/PropsTable';

<PropsTable name="CreateButton" />

### `label`

**Type:** `string`
**Default:** translated `"Create"`

Override the button label. Useful when a more descriptive call-to-action is needed (e.g. `"Add product"`).

### `variant`

**Type:** `'primary' | 'normal' | 'link'`
**Default:** `'primary'`

Controls the Cloudscape button style. Use `'primary'` when this is the dominant action on the page, `'normal'` when it sits alongside other primary actions.
