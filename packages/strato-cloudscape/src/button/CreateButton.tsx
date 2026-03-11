import React from 'react';
import { useResourceContext, useTranslate, useCreatePath, useResourceDefinitions } from 'ra-core';
import { useNavigate } from 'react-router-dom';
import { Button, ButtonProps } from './Button';

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

  const handleClick = () => {
    const path = createPath({
      resource,
      type: 'create',
    });
    navigate(path);
  };

  return (
    <Button variant={variant} onClick={handleClick} iconName="add-plus" {...props}>
      {label || translate('ra.action.create', { _: 'Create' })}
    </Button>
  );
};

export default CreateButton;
