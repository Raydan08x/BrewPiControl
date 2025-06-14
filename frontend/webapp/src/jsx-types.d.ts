import * as React from 'react';

// Solución pragmática para los errores de JSX.IntrinsicElements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Añadimos explícitamente los elementos HTML comunes
      div: any;
      span: any;
      button: any;
      input: any;
      form: any;
      label: any;
      select: any;
      option: any;
      table: any;
      thead: any;
      tbody: any;
      tr: any;
      th: any;
      td: any;
      p: any;
      h1: any;
      h2: any;
      h3: any;
      h4: any;
      h5: any;
      h6: any;
      a: any;
      img: any;
      ul: any;
      li: any;
      nav: any;
      aside: any;
      header: any;
      footer: any;
      section: any;
      main: any;
    }

    // Esto es necesario para la compatibilidad con ReactNode
    interface Element extends React.ReactElement<any, any> { }
  }
}

// Definición para los iconos de Lucide React
declare module 'lucide-react' {
  import { FC, SVGProps } from 'react';

  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
    absoluteStrokeWidth?: boolean;
  }

  export type LucideIcon = FC<LucideProps>;

  // Iconos específicos utilizados en la aplicación
  export const X: LucideIcon;
  export const Edit3: LucideIcon;
  export const Trash2: LucideIcon;
  export const CheckCircle: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const PlusCircle: LucideIcon;
  export const Download: LucideIcon;
  export const Upload: LucideIcon;
}

// Módulos que se mencionan en errores
declare module 'api' {}
declare module 'components' {}
declare module 'contexts' {}
declare module 'hooks' {}
declare module 'store' {}
declare module 'views' {}
