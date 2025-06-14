// Declaraciones de módulos personalizados
declare module "api" {
  const api: any;
  export default api;
  export * from "api";
}

declare module "components" {
  const components: any;
  export default components;
  export * from "components";
}

declare module "contexts" {
  const contexts: any;
  export default contexts;
  export * from "contexts";
}

declare module "hooks" {
  const hooks: any;
  export default hooks;
  export * from "hooks";
}

declare module "store" {
  const store: any;
  export default store;
  export * from "store";
}

declare module "views" {
  const views: any;
  export default views;
  export * from "views";
}

// Declaración para los íconos de lucide
declare module "lucide-react" {
  import React from 'react';
  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number;
    absoluteStrokeWidth?: boolean;
  }
  export const Activity: React.FC<LucideProps>;
  export const ArrowDown: React.FC<LucideProps>;
  export const ArrowUp: React.FC<LucideProps>;
  export const Bell: React.FC<LucideProps>;
  export const Calendar: React.FC<LucideProps>;
  export const Check: React.FC<LucideProps>;
  export const ChevronDown: React.FC<LucideProps>;
  export const ChevronUp: React.FC<LucideProps>;
  export const Clock: React.FC<LucideProps>;
  export const Edit: React.FC<LucideProps>;
  export const File: React.FC<LucideProps>;
  export const Gauge: React.FC<LucideProps>;
  export const Home: React.FC<LucideProps>;
  export const List: React.FC<LucideProps>;
  export const Menu: React.FC<LucideProps>;
  export const MessageCircle: React.FC<LucideProps>;
  export const Plus: React.FC<LucideProps>;
  export const Search: React.FC<LucideProps>;
  export const Settings: React.FC<LucideProps>;
  export const Sliders: React.FC<LucideProps>;
  export const Trash: React.FC<LucideProps>;
  export const User: React.FC<LucideProps>;
  export const X: React.FC<LucideProps>;
  // Y cualquier otro icono necesario
}
