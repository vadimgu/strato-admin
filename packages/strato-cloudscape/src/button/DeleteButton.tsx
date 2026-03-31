import { useState } from 'react';
import { useDeleteController, useTranslate, useResourceDefinition, RaRecord } from '@strato-admin/ra-core';
import { useSettingValue } from '@strato-admin/core';
import Modal from '@cloudscape-design/components/modal';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { Button } from './Button';

export interface DeleteButtonProps {
  label?: string;
  variant?: 'primary' | 'normal' | 'link';
  mutationMode?: 'undoable' | 'optimistic' | 'pessimistic';
  successMessage?: string;
  dialogTitle?: string;
  dialogDescription?: string;
  record?: RaRecord;
  redirect?: string;
}

export const DeleteButton = ({
  label,
  variant = 'normal',
  mutationMode,
  successMessage,
  dialogTitle,
  dialogDescription,
  record,
  redirect,
}: DeleteButtonProps) => {
  const translate = useTranslate();
  const { options } = useResourceDefinition();
  const resolve = useSettingValue();
  const { handleDelete, isPending, isLoading } = useDeleteController({
    mutationMode: resolve(mutationMode, 'mutationMode'),
    successMessage: successMessage ?? options?.deleteSuccessMessage ?? resolve(undefined, 'deleteSuccessMessage'),
    record,
    redirect,
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

  const defaultTitle = translate('strato.message.delete_title', {
    _: 'Delete this item',
  });

  const defaultDescription = translate('strato.message.delete_content', {
    _: 'Are you sure you want to delete this item?',
  });

  return (
    <>
      <Button variant={variant} onClick={() => setIsOpen(true)} loading={isBusy} disabled={isBusy} data-testid="delete-button">
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
              <Button variant="primary" onClick={handleConfirm} loading={isBusy} data-testid="confirm-delete">
                {translate('strato.action.confirm', { _: 'Confirm' })}
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

export default DeleteButton;
