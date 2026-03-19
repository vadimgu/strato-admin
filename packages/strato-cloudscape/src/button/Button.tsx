import CloudscapeButton, { ButtonProps as CloudscapeButtonProps } from '@cloudscape-design/components/button';

export interface ButtonProps extends CloudscapeButtonProps {
  children: React.ReactNode;
}

export const Button = ({ children, ...props }: ButtonProps) => {
  return <CloudscapeButton {...props}>{children}</CloudscapeButton>;
};

export default Button;
