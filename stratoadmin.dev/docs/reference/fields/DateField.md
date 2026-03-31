---
sidebar_position: 6
---

# `<DateField>`

Displays a date or time, formatted according to the user's locale using `Intl.DateTimeFormat`.

import PropsTable from '@site/src/components/PropsTable';

## Usage

```tsx
<DateField source="createdAt" options={{ dateStyle: 'long' }} />
```

### Displaying Time

```tsx
<DateField
  source="updatedAt"
  options={{
    dateStyle: 'short',
    timeStyle: 'medium',
  }}
/>
```

## Props

<PropsTable name="DateField" />
