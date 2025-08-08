import { figma, html } from "@figma/code-connect/html"

/**
 * This file connects the button component to Figma node-id 28-1289.
 * This is a real Code Connect mapping that will be published to Figma.
 */

figma.connect(
  "https://www.figma.com/design/rgqHmkJX2Uw9PhGoon1OIh/MCP-Code-Connect-DS?node-id=28-1289&m=dev",
  {
    props: {
      buttonText: "Button",
      variant: "Default"
    },
    example: (props: any) => html`
      <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2">
        Button
      </button>
    `,
  },
)