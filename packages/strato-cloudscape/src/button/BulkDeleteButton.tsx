import React from 'react';
import { useBulkDeleteController, useTranslate, useListContext } from 'ra-core';
import { Button } from './Button';

export interface BulkDeleteButtonProps {
  label?: string;
  variant?: 'primary' | 'normal' | 'link';
  mutationMode?: 'undoable' | 'optimistic' | 'pessimistic';
}

export const BulkDeleteButton = ({
  label,
  variant = 'normal',
  mutationMode = 'pessimistic',
}: BulkDeleteButtonProps) => {
  const translate = useTranslate();
  const { selectedIds } = useListContext();
  const { handleDelete, isPending, isLoading } = useBulkDeleteController({
    mutationMode,
  });

  const isBusy = isPending || isLoading;

  return (
    <Button
      variant={variant}
      onClick={handleDelete}
      loading={isBusy}
      disabled={isBusy || !selectedIds || selectedIds.length === 0}
    >
      {label || translate('ra.action.delete', { _: 'Delete' })}
    </Button>
  );
};

export default BulkDeleteButton;
