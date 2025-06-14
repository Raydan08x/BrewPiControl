import React from 'react';

// Solución para los errores JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Definiciones para los iconos de Lucide React
declare module 'lucide-react' {
  import { FC, SVGProps } from 'react';

  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
    absoluteStrokeWidth?: boolean;
  }

  export type LucideIcon = FC<LucideProps>;

  // Permitir cualquier icono de lucide-react
  export const X: LucideIcon;
  export const Edit3: LucideIcon;
  export const Trash2: LucideIcon;
  export const CheckCircle: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const PlusCircle: LucideIcon;
  export const Download: LucideIcon;
  export const Upload: LucideIcon;
  
  // Permitir importar cualquier icono de lucide-react
  const icons: { [key: string]: LucideIcon };
  export default icons;
}

// Módulos personalizados
declare module 'api' {}
declare module 'components' {}
declare module 'contexts' {}
declare module 'hooks' {}
declare module 'store' {}
declare module 'views' {}
