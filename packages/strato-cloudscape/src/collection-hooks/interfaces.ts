// shim for dom types
interface CustomEventLike<T> {
  detail: T;
}

export interface UseCollectionOptions<_T> {
    filtering?: any;
    pagination?: any;
    sorting?: any;
}

export interface UseCollectionResult<T> {
    items: ReadonlyArray<T> | undefined;
    collectionProps: {
        selectedItems: T[];
        onSelectionChange(event: CustomEventLike<{ selectedItems: T[] }>): void;
        trackBy: string | ((item: T) => string | number);
        sortingColumn?: { sortingField?: string };
        sortingDescending?: boolean;
        onSortingChange?(event: CustomEventLike<{ sortingColumn: { sortingField?: string }; isDescending?: boolean }>): void;
    };
    paginationProps: {
        disabled?: boolean;
        currentPageIndex: number;
        pagesCount: number;
        onChange(event: CustomEventLike<{ currentPageIndex: number }>): void;
    };
}
