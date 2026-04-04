import React from 'react';
import CloudscapeButton, { ButtonProps as CloudscapeButtonProps } from '@cloudscape-design/components/button';

export interface ButtonProps extends Pick<
  CloudscapeButtonProps,
  | 'variant'
  | 'iconName'
  | 'iconSvg'
  | 'iconAlign'
  | 'iconAlt'
  | 'href'
  | 'target'
  | 'rel'
  | 'download'
  | 'onClick'
  | 'onFollow'
  | 'loading'
  | 'loadingText'
  | 'disabled'
  | 'disabledReason'
  | 'ariaLabel'
  | 'ariaDescribedby'
  | 'ariaExpanded'
  | 'ariaControls'
  | 'formAction'
  | 'form'
  | 'nativeButtonAttributes'
  | 'nativeAnchorAttributes'
  | 'wrapText'
  | 'fullWidth'
  | 'external'
> {
  children: React.ReactNode;
}

export const Button = ({ children, ...props }: ButtonProps) => {
  return <CloudscapeButton {...props}>{children}</CloudscapeButton>;
};

export default Button;
