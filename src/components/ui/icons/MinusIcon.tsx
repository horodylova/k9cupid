import React from 'react';
import { BaseIcon, IconProps } from './BaseIcon';

export const MinusIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path
      fill="currentColor"
      d="M19 11H5a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2Z"
    />
  </BaseIcon>
);
