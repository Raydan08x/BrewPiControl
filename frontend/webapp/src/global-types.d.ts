// Definiciones globales para todos los tipos necesarios en la aplicación BrewPi Control

import * as React from 'react';

// Definición para los elementos JSX intrínsecos
declare global {
  namespace JSX {
    // Extiende IntrinsicElements con todos los elementos HTML que necesitamos
    interface IntrinsicElements {
      // Elementos de texto y layout
      div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
      span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
      p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
      h1: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h2: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h3: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h4: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h5: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h6: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      
      // Elementos de formulario
      form: React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
      input: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
      button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
      textarea: React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
      select: React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
      option: React.DetailedHTMLProps<React.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>;
      label: React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
      
      // Elementos de tabla
      table: React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>;
      thead: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
      tbody: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
      tr: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;
      th: React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>;
      td: React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>;
      
      // Otros elementos
      a: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
      img: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
      nav: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      aside: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      ul: React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>;
      li: React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>;
      header: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      footer: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      section: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      main: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
  
  // Para cualquier módulo interno que pueda faltar
  interface Window {
    api: any;
  }
}

// Definición para los componentes de Lucide React
declare module 'lucide-react' {
  import * as React from 'react';
  
  export interface LucideProps extends React.SVGAttributes<SVGSVGElement> {
    color?: string;
    size?: number | string;
    strokeWidth?: number | string;
    absoluteStrokeWidth?: boolean;
  }
  
  export type LucideIcon = React.FC<LucideProps>;
  
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

// Declaraciones para los módulos personalizados que generan errores
declare module 'api' {}
declare module 'components' {}
declare module 'contexts' {}
declare module 'hooks' {}
declare module 'store' {}
declare module 'views' {}
