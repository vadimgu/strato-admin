import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { useListContext } from '@strato-admin/core';
import { useCollection } from './useCollection';

vi.mock('@strato-admin/core', () => ({
  useListContext: vi.fn(),
}));

describe('useCollection', () => {
  it('should return collection items and pagination props', () => {
    const mockSetPage = vi.fn();
    const mockData = [{ id: 1, name: 'Item 1' }];

    (useListContext as any).mockReturnValue({
      data: mockData,
      page: 1,
      isPending: false,
      isFetching: false,
      isLoading: false,
      setPage: mockSetPage,
      selectedIds: [],
      onSelect: vi.fn(),
    });

    const { result } = renderHook(() => useCollection({}));

    expect(result.current.items).toEqual(mockData);
    expect(result.current.paginationProps.currentPageIndex).toBe(1);
    expect(result.current.paginationProps.disabled).toBe(false);
  });

  it('should call setPage with the correct page index when onChange is called', () => {
    const mockSetPage = vi.fn();

    (useListContext as any).mockReturnValue({
      data: [],
      page: 1,
      isPending: false,
      isFetching: false,
      isLoading: false,
      setPage: mockSetPage,
      selectedIds: [],
      onSelect: vi.fn(),
    });

    const { result } = renderHook(() => useCollection({}));

    act(() => {
      result.current.paginationProps.onChange({ detail: { currentPageIndex: 2 } });
    });

    expect(mockSetPage).toHaveBeenCalledWith(2); // React Admin and Cloudscape both use 1-based indexing
  });

  it('should return selected items based on selectedIds', () => {
    const mockData = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
    ];
    const mockSelectedIds = [1, 3];

    (useListContext as any).mockReturnValue({
      data: mockData,
      page: 1,
      isPending: false,
      isFetching: false,
      isLoading: false,
      setPage: vi.fn(),
      selectedIds: mockSelectedIds,
      onSelect: vi.fn(),
    });

    const { result } = renderHook(() => useCollection({}));

    expect(result.current.collectionProps.selectedItems).toEqual([
      { id: 1, name: 'Item 1' },
      { id: 3, name: 'Item 3' },
    ]);
  });

  it('should include dummy objects for selectedIds not in current data', () => {
    const mockData = [{ id: 1, name: 'Item 1' }];
    const mockSelectedIds = [1, 2];

    (useListContext as any).mockReturnValue({
      data: mockData,
      page: 1,
      isPending: false,
      isFetching: false,
      isLoading: false,
      setPage: vi.fn(),
      selectedIds: mockSelectedIds,
      onSelect: vi.fn(),
    });

    const { result } = renderHook(() => useCollection({}));

    expect(result.current.collectionProps.selectedItems).toEqual([{ id: 1, name: 'Item 1' }, { id: 2 }]);
  });

  it('should call onSelect when onSelectionChange is called', () => {
    const mockOnSelect = vi.fn();
    const mockData = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ];

    (useListContext as any).mockReturnValue({
      data: mockData,
      page: 1,
      isPending: false,
      isFetching: false,
      isLoading: false,
      setPage: vi.fn(),
      selectedIds: [],
      onSelect: mockOnSelect,
    });

    const { result } = renderHook(() => useCollection({}));

    act(() => {
      result.current.collectionProps.onSelectionChange({
        detail: {
          selectedItems: [{ id: 2, name: 'Item 2' }],
        },
      });
    });

    expect(mockOnSelect).toHaveBeenCalledWith([2]);
  });

  it('should return sorting props from sort object', () => {
    (useListContext as any).mockReturnValue({
      data: [],
      sort: { field: 'name', order: 'DESC' },
      setSort: vi.fn(),
      page: 1,
      isPending: false,
      isFetching: false,
      isLoading: false,
      setPage: vi.fn(),
      selectedIds: [],
      onSelect: vi.fn(),
    });

    const { result } = renderHook(() => useCollection({}));

    expect(result.current.collectionProps.sortingColumn).toEqual({ sortingField: 'name' });
    expect(result.current.collectionProps.sortingDescending).toBe(true);
  });

  it('should call setSort when onSortingChange is called', () => {
    const mockSetSort = vi.fn();
    (useListContext as any).mockReturnValue({
      data: [],
      sort: { field: 'name', order: 'ASC' },
      setSort: mockSetSort,
      page: 1,
      isPending: false,
      isFetching: false,
      isLoading: false,
      setPage: vi.fn(),
      selectedIds: [],
      onSelect: vi.fn(),
    });

    const { result } = renderHook(() => useCollection({}));

    act(() => {
      result.current.collectionProps.onSortingChange!({
        detail: {
          sortingColumn: { sortingField: 'price' },
          isDescending: true,
        },
      });
    });

    expect(mockSetSort).toHaveBeenCalledWith({ field: 'price', order: 'DESC' });
  });

  it('should disable pagination if loading, fetching, or pending', () => {
    (useListContext as any).mockReturnValue({
      data: [],
      page: 1,
      isPending: true,
      isFetching: false,
      isLoading: false,
      setPage: vi.fn(),
      selectedIds: [],
      onSelect: vi.fn(),
    });

    const { result } = renderHook(() => useCollection({}));
    expect(result.current.paginationProps.disabled).toBe(true);
  });

  it('should return filteringText from filterValues.q', () => {
    (useListContext as any).mockReturnValue({
      data: [],
      page: 1,
      isPending: false,
      isFetching: false,
      isLoading: false,
      setPage: vi.fn(),
      selectedIds: [],
      onSelect: vi.fn(),
      filterValues: { q: 'search term', status: 'active' },
      setFilters: vi.fn(),
    });

    const { result } = renderHook(() => useCollection({}));

    expect(result.current.filterProps.filteringText).toBe('search term');
  });

  it('should call setFilters with updated q value when filter onChange is called', () => {
    const mockSetFilters = vi.fn();
    (useListContext as any).mockReturnValue({
      data: [],
      page: 1,
      isPending: false,
      isFetching: false,
      isLoading: false,
      setPage: vi.fn(),
      selectedIds: [],
      onSelect: vi.fn(),
      filterValues: { status: 'active' },
      setFilters: mockSetFilters,
    });

    const { result } = renderHook(() => useCollection({}));

    act(() => {
      result.current.filterProps.onChange({
        detail: { filteringText: 'new search' },
      });
    });

    expect(mockSetFilters).toHaveBeenCalledWith({ status: 'active', q: 'new search' });
  });

  it('should return preferencesProps with pageSize from perPage', () => {
    (useListContext as any).mockReturnValue({
      data: [],
      perPage: 50,
      setPerPage: vi.fn(),
      page: 1,
      isPending: false,
      isFetching: false,
      isLoading: false,
      setPage: vi.fn(),
      selectedIds: [],
      onSelect: vi.fn(),
    });

    const { result } = renderHook(() => useCollection({}));

    expect(result.current.preferencesProps.preferences.pageSize).toBe(50);
  });

  it('should call setPerPage when preferences onConfirm is called with new pageSize', () => {
    const mockSetPerPage = vi.fn();
    (useListContext as any).mockReturnValue({
      data: [],
      perPage: 25,
      setPerPage: mockSetPerPage,
      page: 1,
      isPending: false,
      isFetching: false,
      isLoading: false,
      setPage: vi.fn(),
      selectedIds: [],
      onSelect: vi.fn(),
    });

    const { result } = renderHook(() => useCollection({}));

    act(() => {
      result.current.preferencesProps.onConfirm({
        detail: { pageSize: 50 },
      });
    });

    expect(mockSetPerPage).toHaveBeenCalledWith(50);
  });

  it('should not call setPerPage if pageSize is unchanged', () => {
    const mockSetPerPage = vi.fn();
    (useListContext as any).mockReturnValue({
      data: [],
      perPage: 25,
      setPerPage: mockSetPerPage,
      page: 1,
      isPending: false,
      isFetching: false,
      isLoading: false,
      setPage: vi.fn(),
      selectedIds: [],
      onSelect: vi.fn(),
    });

    const { result } = renderHook(() => useCollection({}));

    act(() => {
      result.current.preferencesProps.onConfirm({
        detail: { pageSize: 25 },
      });
    });

    expect(mockSetPerPage).not.toHaveBeenCalled();
  });

  it('should initialize visibleContent from visibleContentOptions if provided', () => {
    (useListContext as any).mockReturnValue({
      data: [],
      perPage: 25,
      setPerPage: vi.fn(),
      page: 1,
      isPending: false,
      isFetching: false,
      isLoading: false,
      setPage: vi.fn(),
      selectedIds: [],
      onSelect: vi.fn(),
    });

    const visibleContentOptions = [
      { id: 'id', label: 'ID' },
      { id: 'name', label: 'Name' },
    ];
    const { result } = renderHook(() =>
      useCollection({
        preferences: {
          visibleContentOptions,
        },
      }),
    );

    expect(result.current.preferencesProps.preferences.visibleContent).toEqual(['id', 'name']);
  });

  it('should initialize visibleContent and contentDisplay from preferences if provided', () => {
    (useListContext as any).mockReturnValue({
      data: [],
      perPage: 25,
      setPerPage: vi.fn(),
      page: 1,
      isPending: false,
      isFetching: false,
      isLoading: false,
      setPage: vi.fn(),
      selectedIds: [],
      onSelect: vi.fn(),
    });

    const visibleContent = ['id', 'name'];
    const contentDisplay = [
      { id: 'id', visible: true },
      { id: 'name', visible: true },
      { id: 'price', visible: false },
    ];

    const { result } = renderHook(() =>
      useCollection({
        preferences: {
          visibleContent,
          contentDisplay,
        },
      }),
    );

    expect(result.current.preferencesProps.preferences.visibleContent).toEqual(visibleContent);
    expect(result.current.preferencesProps.preferences.contentDisplay).toEqual(contentDisplay);
  });

  it('should update wrapLines and stripedRows when preferences onConfirm is called', () => {
    (useListContext as any).mockReturnValue({
      data: [],
      perPage: 25,
      setPerPage: vi.fn(),
      page: 1,
      isPending: false,
      isFetching: false,
      isLoading: false,
      setPage: vi.fn(),
      selectedIds: [],
      onSelect: vi.fn(),
    });

    const { result } = renderHook(() =>
      useCollection({
        preferences: {
          wrapLines: false,
          stripedRows: false,
        },
      }),
    );

    expect(result.current.preferencesProps.preferences.wrapLines).toBe(false);
    expect(result.current.preferencesProps.preferences.stripedRows).toBe(false);

    act(() => {
      result.current.preferencesProps.onConfirm({
        detail: { wrapLines: true, stripedRows: true },
      });
    });

    expect(result.current.preferencesProps.preferences.wrapLines).toBe(true);
    expect(result.current.preferencesProps.preferences.stripedRows).toBe(true);
  });
});
