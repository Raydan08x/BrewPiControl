import React from 'react';

// Corregir tipado de los componentes de Lucide React para que sean compatibles con JSX
declare module 'lucide-react' {
  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
  }

  export type LucideIcon = React.FC<LucideProps>;

  export const X: LucideIcon;
  export const Edit3: LucideIcon;
  export const Trash2: LucideIcon;
  export const PlusCircle: LucideIcon;
  export const Download: LucideIcon;
  export const Upload: LucideIcon;
  export const CheckCircle: LucideIcon;
  export const AlertTriangle: LucideIcon;
}
