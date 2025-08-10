import figma from "@figma/code-connect"
import React from "react"
import { Button } from "@/registry/new-york-v4/ui/button"

/**
 * Button component connected to Figma Design System
 * This connects the React Button component to the Figma button at node-id=28-1289
 */

figma.connect(
  Button,
  "https://www.figma.com/design/rgqHmkJX2Uw9PhGoon1OIh/MCP-Code-Connect-DS?node-id=28-1289&m=dev",
  {
    props: {
      buttontext: figma.string("Button Text"),
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
    example: (props) => {
      // Return proper React JSX using React.createElement
      return <Button
              variant={props.variant}
              size={props.size}>{props.buttontext}
              </Button>
    },
  },
)
