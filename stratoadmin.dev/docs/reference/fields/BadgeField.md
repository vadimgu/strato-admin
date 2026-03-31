---
sidebar_position: 9
---

# `<BadgeField>`

Displays a field value inside a Cloudscape `Badge` component. Useful for surfacing short labels like statuses or categories at a glance.

import PropsTable from '@site/src/components/PropsTable';

## Usage

```tsx
<BadgeField source="tier" />
```

### Badge Color

Use the `color` prop to set the badge color. Accepts any color supported by the Cloudscape `Badge` component (`"blue"`, `"grey"`, `"green"`, `"red"`, `"severity-critical"`, etc.).

```tsx
<BadgeField source="tier" color="blue" />
```

### With a Link

```tsx
<BadgeField source="tier" link="detail" />
```

## Props

<PropsTable name="BadgeField" />
