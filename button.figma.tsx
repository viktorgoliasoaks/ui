import figma from "@figma/code-connect"

/**
 * Button component connected to Figma Design System
 * This connects the React Button component to the Figma button at node-id=28-1289
 */

figma.connect(
  "https://www.figma.com/design/rgqHmkJX2Uw9PhGoon1OIh/MCP-Code-Connect-DS?node-id=28-1289&m=dev",
  {
    props: {
      children: figma.string("Button Text"),
      variant: figma.enum("Variant", {
        "Default": "default",
        "Secondary": "secondary", 
        "Destructive": "destructive",
        "Outline": "outline",
        "Ghost": "ghost",
        "Link": "link"
      }),
      size: figma.enum("Size", {
        "Default": "default",
        "Small": "sm",
        "Large": "lg",
        "Icon": "icon"
      })
    },
    example: ({ children, variant, size }) => {
      return `<Button variant="${variant}" size="${size}">
  ${children}
</Button>`
    },
  },
)
