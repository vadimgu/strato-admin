---
sidebar_position: 2
---

# `<Table>`

The `Table` component is the primary way to display collections of data in Strato Admin. It wraps the Cloudscape Table component and integrates seamlessly with React Admin's data-fetching and state management.

## Basic Table

A standard table with columns for different data types.

<div className="component-preview">
  <img src="/img/components/Table_Basic.png" alt="Basic Table" />
</div>

## Usage

The `Table` component uses a declarative syntax with sub-components for different column types.

import CodeBlock from '@theme/CodeBlock';
import ExampleCode from '!!raw-loader!@site/../packages/strato-cloudscape/src/list/Table.examples.tsx';

<CodeBlock language="tsx">{ExampleCode}</CodeBlock>

### Column Types

Strato Admin provides specialized column components to handle common data types with appropriate formatting:

- `Column`: The default column, uses `TextField`.
- `NumberColumn`: Right-aligned, uses `NumberField`.
- `DateColumn`: Formats dates, uses `DateField`.
- `BooleanColumn`: Displays a checkmark/cross, uses `BooleanField`.
- `ReferenceColumn`: Fetches and displays related data, uses `ReferenceField`.

### Features

- **Filtering**: Enable a search filter by adding the `filtering` prop.
- **Preferences**: Allow users to customize page size, visible columns, and row styling with the `preferences` prop.
- **Sorting**: Columns are sortable by default based on their `source` prop.
- **Reordering**: Enable column reordering via the preferences panel (enabled by default).

### Storybook Full Source

import StoryCode from '!!raw-loader!@site/../packages/strato-cloudscape/src/list/Table.stories.tsx';

<CodeBlock language="tsx">{StoryCode}</CodeBlock>

## Props

### Table

import PropsTable from '@site/src/components/PropsTable';

<PropsTable name="Table" />
