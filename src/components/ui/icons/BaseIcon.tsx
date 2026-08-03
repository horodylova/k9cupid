import React from 'react';

export interface IconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  fill?: string;
  stroke?: string;
}

interface BaseIconProps extends IconProps {
  viewBox?: string;
  children: React.ReactNode;
}

export const BaseIcon: React.FC<BaseIconProps> = ({
  className,
  width = 24,
  height = 24,
  viewBox = '0 0 24 24',
  children,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox={viewBox}
    className={className}
  >
    {children}
  </svg>
);
