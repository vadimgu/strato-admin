---
sidebar_position: 3
---

# `<Resource>`

The `<Resource>` component maps a data entity to a set of views. It registers the resource in the application state and defines the components to use for listing, creating, editing, and showing records (now referred to as **Detail view**).

## Usage

```tsx
import { Resource } from '@strato-admin/admin';
import { PostList, PostCreate, PostEdit, PostDetail } from './posts';

<Resource
  name="posts"
  list={PostList}
  create={PostCreate}
  edit={PostEdit}
  show={PostDetail}
  icon="insert_drive_file"
/>;
```

## Props

import PropsTable from '@site/src/components/PropsTable';

<PropsTable name="Resource" />

### `name`

The only required prop. It defines the endpoint for data fetching and the URL segment.

### `list`

A component used to display a list of records for this resource. It typically renders a `<List>` with a list view.

### `create`

A component used to create a new record.

### `edit`

A component used to edit an existing record.

### `show`

A component used to display the details of a single record.

### `icon`

The name of the icon to display in the sidebar.

### `options`

A configuration object for the resource. Common options:

- `label`: A custom label for the resource, used in the sidebar and titles.
- `hide`: Set to `true` to hide the resource from the sidebar.

## `<ResourceSchema>`

If you want to define your data model in a central location, you can use [`<ResourceSchema>`](./ResourceSchema) instead of `<Resource>`. It allows you to define the field and input schemas that will be automatically used by views.
