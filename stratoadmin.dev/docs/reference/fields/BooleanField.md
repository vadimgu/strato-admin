---
sidebar_position: 7
---

# `<BooleanField>`

Displays a boolean value as a Cloudscape `StatusIndicator` (checkmark or cross).

import PropsTable from '@site/src/components/PropsTable';

## Usage

```tsx
<BooleanField source="isActive" />
```

### With Labels

By default, it only shows an icon. You can enable text labels which are automatically translated.

```tsx
<BooleanField source="isActive" showLabel />
```

## Props

<PropsTable name="BooleanField" />
