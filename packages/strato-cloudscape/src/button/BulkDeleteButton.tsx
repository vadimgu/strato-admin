
import { useState } from 'react';
import {
  useBulkDeleteController,
  useTranslate,
  useListContext,
  useResourceDefinition,
} from '@strato-admin/core';
import Modal from '@cloudscape-design/components/modal';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { Button } from './Button';

export interface BulkDeleteButtonProps {
  label?: string;
  variant?: 'primary' | 'normal' | 'link';
  mutationMode?: 'undoable' | 'optimistic' | 'pessimistic';
  dialogTitle?: string;
  dialogDescription?: string;
}

export const BulkDeleteButton = ({
  label,
  variant = 'normal',
  mutationMode = 'pessimistic',
  dialogTitle,
  dialogDescription,
}: BulkDeleteButtonProps) => {
  const translate = useTranslate();
  const { selectedIds } = useListContext();
  const { options } = useResourceDefinition();
  const { handleDelete, isPending, isLoading } = useBulkDeleteController({
    mutationMode,
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

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };
  const defaultTitle = translate('ra.message.bulk_delete_title', {
    smart_count: selectedIds?.length || 0,
    _: `Delete ${selectedIds?.length || 0} items`,
  });

  const defaultDescription = translate('ra.message.bulk_delete_content', {
    smart_count: selectedIds?.length || 0,
    _: `Are you sure you want to delete these ${selectedIds?.length || 0} items?`,
  });
  return (
    <>
      <Button
        variant={variant}
        onClick={handleOpen}
        loading={isBusy}
        disabled={isBusy || !selectedIds || selectedIds.length === 0}
      >
        {label || translate('ra.action.delete', { _: 'Delete' })}
      </Button>
      <Modal
        onDismiss={handleClose}
        visible={isOpen}
        closeAriaLabel={translate('ra.action.close', { _: 'Close' })}
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={handleClose}>
                {translate('ra.action.cancel', { _: 'Cancel' })}
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirm}
                loading={isBusy}
                data-testid="confirm-bulk-delete"
              >
                {translate('ra.action.confirm', { _: 'Confirm' })}
              </Button>
            </SpaceBetween>
          </Box>
        }
        header={dialogTitle || defaultTitle}
      >
        {dialogDescription || defaultDescription}
      </Modal>
    </>
  );
};

export default BulkDeleteButton;
