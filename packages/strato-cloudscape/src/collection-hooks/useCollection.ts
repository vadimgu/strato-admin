import { useState, useMemo } from 'react';
import { useListContext, RaRecord } from 'strato-core';
import { UseCollectionOptions, UseCollectionResult, TableColumnDisplay } from './interfaces';

export function useCollection<T extends RaRecord>(options: UseCollectionOptions<T>): UseCollectionResult<T> {
  const {
    data, // Array of the list records, e.g. [{ id: 123, title: 'hello world' }, { ... }
    total, // Total number of results for the current filters, excluding pagination. Useful to build the pagination controls, e.g. 23
    isPending, // Boolean, true until the data is available
    isFetching, // Boolean, true while the data is being fetched, false once the data is fetched
    isLoading, // Boolean, true until the data is fetched for the first time
    // Pagination
    page, // Current page. Starts at 1
    perPage, // Number of results per page. Defaults to 25
    setPage, // Callback to change the page, e.g. setPage(3)
    setPerPage, // Callback to change the number of results per page, e.g. setPerPage(50)
    // Selection
    selectedIds, // Array of the selected record IDs
    onSelect, // Callback to change the selection, e.g. onSelect([123, 456])
    // Sorting
    sort, // Current sort. E.g. { field: 'id', order: 'ASC' }
    setSort, // Callback to change the sort. E.g. setSort({ field: 'id', order: 'ASC' })
    // Filtering
    filterValues,
    setFilters,
  } = useListContext<T>();

  const [wrapLines, setWrapLines] = useState(options.preferences?.wrapLines);
  const [stripedRows, setStripedRows] = useState(options.preferences?.stripedRows);
  const [visibleContent, setVisibleContent] = useState<ReadonlyArray<string> | undefined>(
    options.preferences?.visibleContent ?? options.preferences?.visibleContentOptions?.map((o) => o.id),
  );
  const [contentDisplay, setContentDisplay] = useState<ReadonlyArray<TableColumnDisplay> | undefined>(
    options.preferences?.contentDisplay ?? options.preferences?.contentDisplayOptions?.map((o) => ({ id: o.id, visible: true })),
  );

  useMemo(() => {
    setVisibleContent(
      options.preferences?.visibleContent ?? options.preferences?.visibleContentOptions?.map((o) => o.id),
    );
    setContentDisplay(
      options.preferences?.contentDisplay ?? options.preferences?.contentDisplayOptions?.map((o) => ({ id: o.id, visible: true })),
    );
  }, [options.preferences?.visibleContent, options.preferences?.visibleContentOptions, options.preferences?.contentDisplay, options.preferences?.contentDisplayOptions]);

  const selectedItems = (selectedIds || []).map((id) => {
    const item = data?.find((i) => i.id === id);
    if (item) return item;
    return { id } as T;
  });

  const items = useMemo(() => {
    // If it's a client-side list (data contains all records), we need to slice it for pagination.
    // We detect this by checking if data.length equals total and if data.length is greater than perPage.
    if (data && total === data.length && data.length > (perPage || 0)) {
      const p = page || 1;
      const pp = perPage || 25;
      return data.slice((p - 1) * pp, p * pp);
    }
    return data;
  }, [data, total, page, perPage]);

  return {
    items,
    collectionProps: {
      selectedItems,
      onSelectionChange: (event) => onSelect(event.detail.selectedItems.map((item) => item.id)),
      trackBy: 'id',
      sortingColumn: sort ? { sortingField: sort.field } : undefined,
      sortingDescending: sort?.order === 'DESC',
      onSortingChange: (event) => {
        const { sortingColumn, isDescending } = event.detail;
        if (sortingColumn?.sortingField) {
          setSort({ field: sortingColumn.sortingField, order: isDescending ? 'DESC' : 'ASC' });
        }
      },
    },
    paginationProps: {
      disabled: isPending || isFetching || isLoading,
      currentPageIndex: page,
      pagesCount: total !== undefined && perPage ? Math.ceil(total / perPage) : 1,
      onChange: (event) => setPage(event.detail.currentPageIndex),
    },
    filterProps: {
      filteringText: filterValues?.q || '',
      onChange: (event) => {
        setFilters({ ...filterValues, q: event.detail.filteringText });
      },
    },
    preferencesProps: {
      preferences: {
        pageSize: perPage,
        wrapLines,
        stripedRows,
        visibleContent,
        contentDisplay,
      },
      onConfirm: (event) => {
        const {
          pageSize,
          wrapLines: newWrapLines,
          stripedRows: newStripedRows,
          visibleContent: newVisibleContent,
          contentDisplay: newContentDisplay,
        } = event.detail;
        if (pageSize !== undefined && pageSize !== perPage) {
          setPerPage(pageSize);
        }
        if (newWrapLines !== undefined) {
          setWrapLines(newWrapLines);
        }
        if (newStripedRows !== undefined) {
          setStripedRows(newStripedRows);
        }
        if (newVisibleContent !== undefined) {
          setVisibleContent(newVisibleContent);
        }
        if (newContentDisplay !== undefined) {
          setContentDisplay(newContentDisplay);
        }
      },
      ...options.preferences,
    },
  };
}
