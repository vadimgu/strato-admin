import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { useListContext } from 'ra-core';
import { useCollection } from './useCollection';

vi.mock('ra-core', () => ({
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

    expect(result.current.collectionProps.selectedItems).toEqual([
      { id: 1, name: 'Item 1' },
      { id: 2 },
    ]);
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
});
