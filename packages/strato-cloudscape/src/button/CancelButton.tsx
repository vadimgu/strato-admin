import { useTranslate } from '@strato-admin/ra-core';
import { useNavigate } from 'react-router-dom';
import { Button, ButtonProps } from './Button';

export interface CancelButtonProps extends Omit<ButtonProps, 'children'> {
  label?: string;
}

export const CancelButton = ({ label, variant = 'link', ...props }: CancelButtonProps) => {
  const translate = useTranslate();
  const navigate = useNavigate();

  return (
    <Button variant={variant} formAction="none" onClick={() => navigate(-1)} {...props}>
      {label || translate('strato.action.cancel', { _: 'Cancel' })}
    </Button>
  );
};

export default CancelButton;
