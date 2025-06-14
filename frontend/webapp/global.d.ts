import * as React from 'react';

// La definición más permisiva posible para JSX
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
  interface Element extends React.ReactElement<any, any> {}
  interface ElementClass extends React.Component<any, any> {}
  interface ElementAttributesProperty { props: {}; }
  interface ElementChildrenAttribute { children: {}; }
}

// Definiciones para módulos personalizados
declare module 'api' {}
declare module 'components' {}
declare module 'contexts' {}
declare module 'hooks' {}
declare module 'store' {}
declare module 'views' {}

// Definiciones para los iconos de Lucide React
declare module 'lucide-react' {
  import { FC, SVGProps } from 'react';

  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
  }

  export type LucideIcon = FC<LucideProps>;
  
  // Declarar todos los iconos como tipo LucideIcon
  export const X: LucideIcon;
  export const Edit3: LucideIcon;
  export const Trash2: LucideIcon;
  export const CheckCircle: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const PlusCircle: LucideIcon;
  export const Download: LucideIcon;
  export const Upload: LucideIcon;
  // ... cualquier otro icono que necesites
}

// Las declaraciones de todos los módulos personalizados ya están al inicio del archivo
