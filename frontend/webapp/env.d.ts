/// <reference types="vite/client" />

// Bypass para módulos personalizados sin tipos
declare module "api/*" {
  const content: any;
  export default content;
}

declare module "components/*" {
  const content: any;
  export default content;
}

declare module "contexts/*" {
  const content: any;
  export default content;
}

declare module "hooks/*" {
  const content: any;
  export default content;
}

declare module "store/*" {
  const content: any;
  export default content;
}

declare module "views/*" {
  const content: any;
  export default content;
}

// Soporte para JSX.IntrinsicElements
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
