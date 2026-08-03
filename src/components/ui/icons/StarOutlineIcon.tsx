import React from 'react';
import { BaseIcon, IconProps } from './BaseIcon';

export const StarOutlineIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} viewBox="0 0 15 15" width={props.width || 15} height={props.height || 15}>
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.5 9.804L5.337 11l.413-2.533L4 6.674l2.418-.37L7.5 4l1.082 2.304l2.418.37l-1.75 1.793L9.663 11L7.5 9.804Z"
    />
  </BaseIcon>
);
