import { useResourceContext, useTranslate, useResourceDefinitions } from '@strato-admin/ra-core';
import { useCreatePath } from '@strato-admin/core';
import { useNavigate } from 'react-router-dom';
import { Button, ButtonProps } from './Button';
import type { ButtonProps as CloudscapeButtonProps } from '@cloudscape-design/components/button';

export interface CreateButtonProps extends Omit<ButtonProps, 'children'> {
  label?: string;
}

export const CreateButton = ({ label, variant = 'primary', ...props }: CreateButtonProps) => {
  const resource = useResourceContext();
  const translate = useTranslate();
  const createPath = useCreatePath();
  const navigate = useNavigate();
  const definitions = useResourceDefinitions();

  const definition = resource ? definitions[resource] : undefined;

  if (!definition || !definition.hasCreate) {
    return null;
  }

  const path = createPath({ resource, type: 'create' });

  const handleClick: NonNullable<CloudscapeButtonProps['onClick']> = (e) => {
    if (!e.detail.metaKey && !e.detail.ctrlKey && !e.detail.shiftKey && e.detail.button === 0) {
      e.preventDefault();
      navigate(path);
    }
  };

  return (
    <Button variant={variant} href={path} onClick={handleClick} iconName="add-plus" {...props}>
      {label || translate('strato.action.create', { _: 'Create' })}
    </Button>
  );
};

export default CreateButton;
