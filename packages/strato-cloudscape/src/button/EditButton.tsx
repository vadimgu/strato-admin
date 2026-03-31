import { useResourceContext, useRecordContext, useTranslate, RaRecord } from '@strato-admin/ra-core';
import { useCreatePath } from '@strato-admin/core';
import { useNavigate } from 'react-router-dom';
import { Button, ButtonProps } from './Button';
import type { ButtonProps as CloudscapeButtonProps } from '@cloudscape-design/components/button';

export interface EditButtonProps extends Omit<ButtonProps, 'children'> {
  label?: string;
  record?: RaRecord;
}

export const EditButton = ({ label, record: recordProp, variant = 'normal', ...props }: EditButtonProps) => {
  const resource = useResourceContext();
  const record = useRecordContext(recordProp);
  const translate = useTranslate();
  const createPath = useCreatePath();
  const navigate = useNavigate();

  if (!record) {
    return null;
  }

  const path = createPath({ resource, id: record.id, type: 'edit' });

  const handleClick: NonNullable<CloudscapeButtonProps['onClick']> = (e) => {
    if (!e.detail.metaKey && !e.detail.ctrlKey && !e.detail.shiftKey && e.detail.button === 0) {
      e.preventDefault();
      navigate(path);
    }
  };

  return (
    <Button variant={variant} href={path} onClick={handleClick} iconName="edit" {...props}>
      {label || translate("strato.action.edit", { _: 'Edit' })}
    </Button>
  );
};

export default EditButton;
