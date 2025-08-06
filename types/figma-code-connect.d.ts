declare module '@figma/code-connect/html' {
  export const html: (strings: TemplateStringsArray, ...values: any[]) => string;
  export const figma: {
    connect: (url: string, config: any) => void;
  };
}

declare module '@figma/code-connect/react' {
  export const figma: {
    connect: (url: string, config: any) => void;
  };
  export const jsx: (strings: TemplateStringsArray, ...values: any[]) => string;
} 