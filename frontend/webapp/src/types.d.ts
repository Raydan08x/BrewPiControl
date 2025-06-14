import React from 'react';

// Asegurar que JSX.Element sea asignable a React.ReactNode
declare module 'react' {
  interface ReactElement {
    type: any;
    props: any;
    key: string | null;
  }
}

// Asegurar que JSX.Element sea compatible con ReactNode
declare global {
  namespace JSX {
    interface Element extends React.ReactNode {}
  }
}

export {};
