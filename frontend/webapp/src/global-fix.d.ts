// Esta es una solución temporal para los errores de tipos JSX y módulos personalizados
import React from 'react';

// Definición general para todos los elementos JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Definiciones para Lucide React
declare module 'lucide-react' {
  import { FC, SVGProps } from 'react';

  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
  }

  export type LucideIcon = FC<LucideProps>;
  
  // Definir todos los iconos que uses
  export const X: LucideIcon;
  export const Edit3: LucideIcon;
  export const Trash2: LucideIcon;
  export const CheckCircle: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const PlusCircle: LucideIcon;
  export const Download: LucideIcon;
  export const Upload: LucideIcon;
  export const BarChart3: LucideIcon;
  export const Gauge: LucideIcon;
  export const Zap: LucideIcon;
  export const FlaskConical: LucideIcon;
  export const Settings: LucideIcon;
  export const Cpu: LucideIcon;
  export const Database: LucideIcon;
  export const Home: LucideIcon;
  export const Flame: LucideIcon;
  export const Beaker: LucideIcon;
  export const Boxes: LucideIcon;
  export const BookOpen: LucideIcon;
}

// Módulos personalizados
declare module 'api' { const api: any; export default api; }
declare module 'components' { const components: any; export default components; }
declare module 'contexts' { const contexts: any; export default contexts; }
declare module 'hooks' { const hooks: any; export default hooks; }
declare module 'store' { const store: any; export default store; }
declare module 'views' { const views: any; export default views; }
