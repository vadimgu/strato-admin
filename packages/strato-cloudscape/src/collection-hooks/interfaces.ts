// shim for dom types
interface CustomEventLike<T> {
  detail: T;
}

export interface TableColumnDisplay {
  id: string;
  visible: boolean;
}

export interface CollectionPreferences {
  pageSize?: number;
  wrapLines?: boolean;
  stripedRows?: boolean;
  visibleContent?: ReadonlyArray<string>;
  contentDisplay?: ReadonlyArray<TableColumnDisplay>;
  contentDensity?: 'comfortable' | 'compact';
}

export interface UseCollectionOptions<_T> {
  filtering?: any;
  pagination?: any;
  sorting?: any;
  preferences?: {
    pageSizeOptions?: ReadonlyArray<{ value: number; label?: string }>;
    visibleContentOptions?: ReadonlyArray<{
      id: string;
      label: string;
      editable?: boolean;
    }>;
    contentDisplayOptions?: ReadonlyArray<{
      id: string;
      label: string;
      alwaysVisible?: boolean;
    }>;
    wrapLines?: boolean;
    stripedRows?: boolean;
    visibleContent?: ReadonlyArray<string>;
  };
}

export interface UseCollectionResult<T> {
  items: ReadonlyArray<T> | undefined;
  collectionProps: {
    selectedItems: T[];
    onSelectionChange(event: CustomEventLike<{ selectedItems: T[] }>): void;
    trackBy: string | ((item: T) => string);
    sortingColumn?: { sortingField?: string };
    sortingDescending?: boolean;
    onSortingChange?(
      event: CustomEventLike<{ sortingColumn: { sortingField?: string }; isDescending?: boolean }>,
    ): void;
  };
  paginationProps: {
    disabled?: boolean;
    currentPageIndex: number;
    pagesCount: number;
    onChange(event: CustomEventLike<{ currentPageIndex: number }>): void;
  };
  filterProps: {
    filteringText: string;
    onChange(event: CustomEventLike<{ filteringText: string }>): void;
  };
  preferencesProps: {
    preferences: CollectionPreferences;
    onConfirm(event: CustomEventLike<CollectionPreferences>): void;
    pageSizeOptions?: ReadonlyArray<{ value: number; label?: string }>;
    visibleContentOptions?: ReadonlyArray<{
      id: string;
      label: string;
      editable?: boolean;
    }>;
    contentDisplayOptions?: ReadonlyArray<{
      id: string;
      label: string;
      alwaysVisible?: boolean;
    }>;
  };
}
