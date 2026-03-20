import { useResourceContext, useRecordContext, useTranslate, useCreatePath, RaRecord } from '@strato-admin/core';
import { useNavigate } from 'react-router-dom';
import { Button, ButtonProps } from './Button';

export interface EditButtonProps extends Omit<ButtonProps, 'children'> {
  label?: string;
  record?: RaRecord;
}

export const EditButton = ({ label, record: recordProp, variant = 'primary', ...props }: EditButtonProps) => {
  const resource = useResourceContext();
  const record = useRecordContext(recordProp);
  const translate = useTranslate();
  const createPath = useCreatePath();
  const navigate = useNavigate();

  if (!record) {
    return null;
  }

  const handleClick = () => {
    const path = createPath({
      resource,
      id: record.id,
      type: 'edit',
    });
    navigate(path);
  };

  return (
    <Button variant={variant} onClick={handleClick} {...props}>
      {label || translate("strato.action.edit", { _: 'Edit' })}
    </Button>
  );
};

export default EditButton;
