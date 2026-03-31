import { useState } from 'react';
import { useBulkDeleteController, useTranslate, useListContext, useResourceDefinition } from '@strato-admin/ra-core';
import { useSettingValue } from '@strato-admin/core';
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
  const resolve = useSettingValue();
  const rawDefault = resolve(undefined, 'bulkDeleteSuccessMessage');
  const resolvedDefault = typeof rawDefault === 'function'
    ? rawDefault(selectedIds?.length ?? 0)
    : rawDefault;
  const { handleDelete, isPending, isLoading } = useBulkDeleteController({
    mutationMode: resolve(mutationMode, 'mutationMode'),
    successMessage: successMessage ?? options?.bulkDeleteSuccessMessage ?? resolvedDefault,
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
  const defaultTitle = translate("strato.message.bulk_delete_title", {
    smart_count: selectedIds?.length || 0,
    _: `{smart_count, plural, one {Delete this item} other {Delete these # items}}`,
  });

  const defaultDescription = translate("strato.message.bulk_delete_content", {
    smart_count: selectedIds?.length || 0,
    _: `{
      smart_count, plural,
        one {Are you sure you want to delete this item?}
        other {Are you sure you want to delete these # items?}
      }`,
  });
  return (
    <>
      <Button
        variant={variant}
        onClick={handleOpen}
        loading={isBusy}
        disabled={isBusy || !selectedIds || selectedIds.length === 0}
      >
        {label || translate("strato.action.delete", { _: 'Delete' })}
      </Button>
      <Modal
        onDismiss={handleClose}
        visible={isOpen}
        closeAriaLabel={translate("strato.action.close", { _: 'Close' })}
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={handleClose}>
                {translate("strato.action.cancel", { _: 'Cancel' })}
              </Button>
              <Button variant="primary" onClick={handleConfirm} loading={isBusy} data-testid="confirm-bulk-delete">
                {translate("strato.action.confirm", { _: 'Confirm' })}
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
