import { figma, html } from "@figma/code-connect/html"

/**
 * This file connects your input component to Figma.
 * 
 * To use this:
 * 1. Make sure you have the Figma Code Connect CLI installed: npm install -g @figma/code-connect
 * 2. Run: npx figma connect publish
 * 3. The code will be published to Figma and available in the Code Connect panel
 * 
 * You can modify the props and example function to match your actual
 * code component, and update the `example` function to return the
 * code example you'd like to see in Figma
 */

figma.connect(
  "https://www.figma.com/design/rgqHmkJX2Uw9PhGoon1OIh/MCP-Code-Connect-DS?node-id=12-301&m=dev",
  {
    props: {
      placeholder: "Enter text...",
      type: "text"
    },
    example: (props: any) => html`
      <input
        type="text"
        data-slot="input"
        class="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
        placeholder="Enter text..."
      />
    `,
  },
) 