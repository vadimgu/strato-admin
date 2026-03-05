import { useListContext, RaRecord } from 'ra-core';
import { UseCollectionOptions, UseCollectionResult,  } from './interfaces';


export function useCollection<T extends RaRecord>(_options: UseCollectionOptions<T>): UseCollectionResult<T> {
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
        // Selection
        selectedIds, // Array of the selected record IDs
        onSelect, // Callback to change the selection, e.g. onSelect([123, 456])
        // Sorting
        sort, // Current sort. E.g. { field: 'id', order: 'ASC' }
        setSort, // Callback to change the sort. E.g. setSort({ field: 'id', order: 'ASC' })
    } = useListContext<T>();

    const selectedItems = (selectedIds || []).map(id => {
        const item = data?.find(i => i.id === id);
        if (item) return item;
        return { id } as T;
    });

    return {
        items: data,
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
    };
}