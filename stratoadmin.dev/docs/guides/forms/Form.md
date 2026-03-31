---
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Forms

Creating and editing data is at the heart of any admin panel. Strato Admin provides seamless form integration, combining React Admin's robust state management (powered by `react-hook-form`) with Cloudscape's pristine form layouts.

You can build forms using the automated **Schema-First** approach, compose them manually in **View-Mode**, or wire them up yourself using **Headless** hooks.

## Usage

<Tabs>
  <TabItem value="schema" label="Schema-First (Recommended)" default>
    Using `<FormSchema>`, Strato Admin automatically generates both the `<Create>` and `<Edit>` views, complete with validation and error handling.

    ```tsx
    import { StratoResource, FormSchema, TextInput, NumberInput } from '@strato-admin/admin';
    import { required, minValue } from '@strato-admin/ra-core';

    export const PostResource = () => (
        <StratoResource name="posts">
            <FormSchema>
                <TextInput source="title" validate={required()} />
                <NumberInput source="views" validate={minValue(0)} />
            </FormSchema>
        </StratoResource>
    );
    ```

  </TabItem>
  <TabItem value="view" label="View-Mode (Components)">
    If you need a bespoke layout (like a multi-column grid or tabbed form), you can use the `<Create>`, `<Edit>`, and `<Form>` components directly to compose your UI.

    ```tsx
    import { Create, Form, TextInput, NumberInput } from '@strato-admin/admin';
    import { Container, SpaceBetween } from '@cloudscape-design/components';

    export const PostCreate = () => (
        <Create>
            <Form>
                <SpaceBetween direction="vertical" size="l">
                    <Container header="Basic Details">
                        <TextInput source="title" />
                    </Container>
                    <Container header="Metrics">
                        <NumberInput source="views" />
                    </Container>
                </SpaceBetween>
            </Form>
        </Create>
    );
    ```

  </TabItem>
  <TabItem value="headless" label="Headless (Hooks)">
    For maximum control, use `useCreateController` or `useEditController` to manage the submission state, and hook up your own form elements.

    ```tsx
    import { useCreateController } from '@strato-admin/admin';
    import { Form, FormField, Input, Button } from '@cloudscape-design/components';
    import { useState } from 'react';

    export const CustomPostCreate = () => {
        const { save, isPending } = useCreateController();
        const [title, setTitle] = useState('');

        return (
            <Form
                actions={<Button variant="primary" loading={isPending} onClick={() => save({ title })}>Save</Button>}
            >
                <FormField label="Title">
                    <Input value={title} onChange={e => setTitle(e.detail.value)} />
                </FormField>
            </Form>
        );
    };
    ```

  </TabItem>
</Tabs>

## The `<Form>` Component

When composing views manually (View-Mode), the `<Form>` component acts as a wrapper around Cloudscape's `Form` component. It seamlessly integrates with React Admin's form state management, handles form submission, manages layout spacing, and automatically renders a "Save" button.

## Props

import PropsTable from '@site/src/components/PropsTable';

<PropsTable name="Form" />

### `children`

The form fields to render.

### `toolbar`

Custom actions to display in the form footer. If not provided, it defaults to a `<SaveButton />`.

### `onSubmit`

A custom submit handler. If not provided, it uses the `save` function from the current `SaveContext` (provided by `<Create>` or `<Edit>`).

## `Form.Field`

A helper component that wraps individual inputs with a Cloudscape `FormField`. It handles labels, descriptions, and error messages automatically.

Most built-in inputs (like `<TextInput>`, `<NumberInput>`) already use `Form.Field` internally. Use it directly when building custom inputs.

### Props

<PropsTable name="FormField" />

#### `source`

The name of the property in the record.

#### `label`

The label for the field. If not provided, it's automatically generated from the `source`. Set to `false` to hide the label.

#### `description`

Additional description text to display below the label.

#### `constraintText`

Text to display below the input (e.g., "Minimum 5 characters").

#### `info`

An info link or icon to display next to the label.
