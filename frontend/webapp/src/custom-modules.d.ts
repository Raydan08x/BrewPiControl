// Declaraciones para módulos personalizados
declare module 'api' {
  export * from './api/inventory';
  export * from './api/settings';
  // Agrega cualquier otro export de api que necesites
}

declare module 'components' {
  // Declara cualquier componente exportado aquí
}

declare module 'contexts' {
  // Declara cualquier contexto exportado aquí
}

declare module 'hooks' {
  // Declara cualquier hook exportado aquí
}

declare module 'store' {
  // Declara cualquier store exportado aquí
}

declare module 'views' {
  // Declara cualquier vista exportada aquí
}

// Asegúrate de que el compilador entienda que este es un módulo
export {};
