import React from 'react';
import { BaseIcon, IconProps } from './BaseIcon';

export const CloseIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} viewBox="0 0 15 15" width={props.width || 15} height={props.height || 15}>
    <path
      fill="currentColor"
      d="M7.953 3.788a.5.5 0 0 0-.906 0L6.08 5.85l-2.154.33a.5.5 0 0 0-.283.843l1.574 1.613l-.373 2.284a.5.5 0 0 0 .736.518l1.92-1.063l1.921 1.063a.5.5 0 0 0 .736-.519l-.373-2.283l1.574-1.613a.5.5 0 0 0-.283-.844L8.921 5.85l-.968-2.062Z"
    />
  </BaseIcon>
);
