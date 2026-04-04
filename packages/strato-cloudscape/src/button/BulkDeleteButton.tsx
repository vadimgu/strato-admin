import { useState } from 'react';
import { useBulkDeleteController, useTranslate, useListContext, useResourceDefinition } from '@strato-admin/ra-core';
import { useBulkDeleteMeta } from '@strato-admin/core';
import Modal from '@cloudscape-design/components/modal';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { Button } from './Button';

export interface BulkDeleteButtonProps {
  label?: string;
  variant?: 'primary' | 'normal' | 'link';
  mutationMode?: 'undoable' | 'optimistic' | 'pessimistic';
  successMessage?: string;
  dialogTitle?: string;
  dialogDescription?: string;
}

export const BulkDeleteButton = ({
  label,
  variant = 'normal',
  mutationMode,
  successMessage,
  dialogTitle,
  dialogDescription,
}: BulkDeleteButtonProps) => {
  const translate = useTranslate();
  const { selectedIds } = useListContext();
  const { options } = useResourceDefinition();
  const {
    title,
    description,
    successMessage: resolvedSuccessMessage,
    mutationMode: resolvedMutationMode,
  } = useBulkDeleteMeta({ title: dialogTitle, description: dialogDescription, successMessage, mutationMode });

  const evaluatedSuccessMessage =
    typeof resolvedSuccessMessage === 'function'
      ? resolvedSuccessMessage(selectedIds?.length ?? 0)
      : resolvedSuccessMessage;

  const { handleDelete, isPending, isLoading } = useBulkDeleteController({
    mutationMode: resolvedMutationMode,
    successMessage: evaluatedSuccessMessage,
  });

  const [isOpen, setIsOpen] = useState(false);

  if (options?.canDelete === false) {
    return null;
  }

  const isBusy = isPending || isLoading;

  const handleConfirm = () => {
    handleDelete();
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant={variant}
        onClick={() => setIsOpen(true)}
        loading={isBusy}
        disabled={isBusy || !selectedIds || selectedIds.length === 0}
      >
        {label || translate('strato.action.delete', { _: 'Delete' })}
      </Button>
      <Modal
        onDismiss={() => setIsOpen(false)}
        visible={isOpen}
        closeAriaLabel={translate('strato.action.close', { _: 'Close' })}
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => setIsOpen(false)}>
                {translate('strato.action.cancel', { _: 'Cancel' })}
              </Button>
              <Button variant="primary" onClick={handleConfirm} loading={isBusy} data-testid="confirm-bulk-delete">
                {translate('strato.action.confirm', { _: 'Confirm' })}
              </Button>
            </SpaceBetween>
          </Box>
        }
        header={title}
      >
        {description}
      </Modal>
    </>
  );
};

export default BulkDeleteButton;
