---
sidebar_position: 10
---

# `useCollection`

Adapts `ListContext` state into prop bundles ready to spread onto [AWS Cloudscape](https://cloudscape.design/) collection components (`Table`, `Cards`, `Pagination`, `TextFilter`, `CollectionPreferences`).

This is the hook used internally by [`<Table>`](./Table.md) and [`<Cards>`](./Cards.md). Use it directly when building a custom list layout with Cloudscape primitives.

## Signature

```ts
import { useCollection } from '@strato-admin/cloudscape';

function useCollection<T extends RaRecord>(
  options: UseCollectionOptions<T>
): UseCollectionResult<T>
```

Must be called inside a `ListContext` (i.e. a descendant of `<List>`, `<ReferenceManyField>`, or `<ArrayField>`).

## Options

```ts
interface UseCollectionOptions<T> {
  /**
   * Set to true when using a client-side data provider where the data array
   * contains ALL records, not just the current page. The hook will slice the
   * array for pagination instead of relying on the server.
   * @default false
   */
  clientSidePagination?: boolean;

  preferences?: {
    /** Page size picker options shown in CollectionPreferences. */
    pageSizeOptions?: ReadonlyArray<{ value: number; label?: string }>;

    /** Columns available for show/hide in CollectionPreferences (Cards). */
    visibleContentOptions?: ReadonlyArray<{
      id: string;
      label: string;
      editable?: boolean;
    }>;

    /** Columns available for reordering in CollectionPreferences (Table). */
    contentDisplayOptions?: ReadonlyArray<{
      id: string;
      label: string;
      alwaysVisible?: boolean;
    }>;

    /** Initial wrap-lines preference. */
    wrapLines?: boolean;

    /** Initial striped-rows preference. */
    stripedRows?: boolean;

    /** Initially visible column IDs (Cards). */
    visibleContent?: ReadonlyArray<string>;

    /** Initial column display order/visibility (Table). */
    contentDisplay?: ReadonlyArray<{ id: string; visible: boolean }>;
  };
}
```

## Return value

```ts
interface UseCollectionResult<T> {
  /** Paginated slice of records to render. */
  items: ReadonlyArray<T> | undefined;

  /** Spread onto the Cloudscape Table or Cards component. */
  collectionProps: {
    selectedItems: T[];
    onSelectionChange(event): void;
    trackBy: string | ((item: T) => string);
    sortingColumn?: { sortingField?: string };
    sortingDescending?: boolean;
    onSortingChange?(event): void;
  };

  /** Spread onto the Cloudscape Pagination component. */
  paginationProps: {
    disabled?: boolean;
    currentPageIndex: number;
    pagesCount: number;
    onChange(event): void;
  };

  /** Spread onto the Cloudscape TextFilter component. */
  filterProps: {
    filteringText: string;
    onChange(event): void;
  };

  /** Spread onto the Cloudscape CollectionPreferences component. */
  preferencesProps: {
    preferences: CollectionPreferences;
    onConfirm(event): void;
    pageSizeOptions?: ReadonlyArray<{ value: number; label?: string }>;
    visibleContentOptions?: ReadonlyArray<{ id: string; label: string; editable?: boolean }>;
    contentDisplayOptions?: ReadonlyArray<{ id: string; label: string; alwaysVisible?: boolean }>;
  };
}
```

## Client-side pagination

When the `ListContext` supplies all records at once — for example inside an `<ArrayField>` backed by an in-memory provider — pass `clientSidePagination: true`. The hook will slice `items` to the current page instead of expecting the server to paginate.

```tsx
useCollection({ clientSidePagination: true, preferences: { ... } })
```

Without this flag the full data array is returned as-is, which is correct for server-side providers that already return only the current page.

## Example

```tsx
import {
  Table,
  Pagination,
  TextFilter,
  CollectionPreferences,
} from '@cloudscape-design/components';
import { useCollection } from '@strato-admin/cloudscape';

function CustomTable() {
  const { items, collectionProps, paginationProps, filterProps, preferencesProps } =
    useCollection({
      preferences: {
        pageSizeOptions: [
          { value: 10, label: '10' },
          { value: 25, label: '25' },
        ],
      },
    });

  return (
    <Table
      {...collectionProps}
      items={items ?? []}
      columnDefinitions={[
        { id: 'name', header: 'Name', cell: (r) => r.name },
        { id: 'status', header: 'Status', cell: (r) => r.status },
      ]}
      filter={<TextFilter {...filterProps} filteringPlaceholder="Find records" />}
      pagination={<Pagination {...paginationProps} />}
      preferences={<CollectionPreferences {...preferencesProps} title="Preferences" />}
    />
  );
}
```
