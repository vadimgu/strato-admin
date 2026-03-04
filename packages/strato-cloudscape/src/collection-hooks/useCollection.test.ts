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
    });

    const { result } = renderHook(() => useCollection({}));

    act(() => {
      result.current.paginationProps.onChange({ detail: { currentPageIndex: 1 } });
    });

    expect(mockSetPage).toHaveBeenCalledWith(2); // React Admin uses 1-based indexing, Cloudscape uses 0-based indexing (implied by currentPageIndex + 1 in useCollection)
  });

  it('should disable pagination if loading, fetching, or pending', () => {
    (useListContext as any).mockReturnValue({
      data: [],
      page: 1,
      isPending: true,
      isFetching: false,
      isLoading: false,
      setPage: vi.fn(),
    });

    const { result } = renderHook(() => useCollection({}));
    expect(result.current.paginationProps.disabled).toBe(true);

    (useListContext as any).mockReturnValue({
      data: [],
      page: 1,
      isPending: false,
      isFetching: true,
      isLoading: false,
      setPage: vi.fn(),
    });

    const { rerender } = renderHook(() => useCollection({}));
    expect(result.current.paginationProps.disabled).toBe(true);
  });
});
