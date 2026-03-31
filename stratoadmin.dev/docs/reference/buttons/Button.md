---
sidebar_position: 1
---

# `<Button>`

Strato Admin provides a wrapper around Cloudscape's Button component, ensuring consistent styling across the framework.

## Props

import PropsTable from '@site/src/components/PropsTable';

<PropsTable name="Button" />

## Primary Button

...

Used for the main action on a page.

<div className="component-preview">
  <img src="/img/components/Button_Primary.png" alt="Primary Button" />
</div>

## Normal Button

Used for secondary actions like "Cancel" or "Go Back".

<div className="component-preview">
  <img src="/img/components/Button_Normal.png" alt="Normal Button" />
</div>

## Usage

You can use the `Button` component from `strato-cloudscape`.

```tsx
import { Button } from '@strato-admin/cloudscape';

<Button variant="primary">Save Changes</Button>;
```

### Storybook Examples

Here is the source code for the examples shown above:

import CodeBlock from '@theme/CodeBlock';
import StoryCode from '!!raw-loader!@site/../packages/strato-cloudscape/src/button/Button.stories.tsx';

<CodeBlock language="tsx">{StoryCode}</CodeBlock>
