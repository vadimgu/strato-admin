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
    paginationProps: {
        disabled?: boolean;
        currentPageIndex: number;
        pagesCount: number;
        onChange(event: CustomEventLike<{ currentPageIndex: number }>): void;
    };
}
