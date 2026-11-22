declare module '@hugeicons/core-free-icons' {
  const icons: Record<string, any>;
  export const Delete02Icon: any;
  export const Archive02Icon: any;
  export default icons;
}

declare module '@hugeicons/react' {
  import React from 'react';
  export interface HugeiconsIconProps {
    icon: any;
    size?: number | string;
    color?: string;
    className?: string;
    [key: string]: any;
  }
  export const HugeiconsIcon: React.FC<HugeiconsIconProps>;
}
