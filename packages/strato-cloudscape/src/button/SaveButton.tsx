import { useTranslate } from '@strato-admin/core';
import { Button, ButtonProps } from './Button';

export interface SaveButtonProps extends Omit<ButtonProps, 'children'> {
  label?: string;
}

export const SaveButton = ({ label, variant = 'primary', ...props }: SaveButtonProps) => {
  const translate = useTranslate();

  return (
    <Button variant={variant} formAction="submit" nativeButtonAttributes={{ type: 'submit' }} {...props}>
      {label || translate("strato.action.save", { _: 'Save' })}
    </Button>
  );
};

export default SaveButton;
