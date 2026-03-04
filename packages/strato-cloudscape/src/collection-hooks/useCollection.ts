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
    } = useListContext<T>();

    return {
        items: data,
        paginationProps: {
            disabled: isPending || isFetching || isLoading,
            currentPageIndex: page,
            pagesCount: total !== undefined && perPage ? Math.ceil(total / perPage) : 1,
            onChange: (event) => setPage(event.detail.currentPageIndex + 1),
        },
    };
}