import figma from "@figma/code-connect"
import React from "react"
import { Alert, AlertTitle, AlertDescription } from "@/registry/new-york-v4/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"

/**
 * Alert component connected to Figma Design System
 * This connects the React Alert component to the Figma alert at node-id=139-364
 */

figma.connect(
  Alert,
  "https://www.figma.com/design/rgqHmkJX2Uw9PhGoon1OIh/MCP-Code-Connect-DS?node-id=139-364&m=dev",
  {
    props: {
      variant: figma.enum("Variant", {
        "Default": "default",
        "Destructive": "destructive"
      }),
      title: figma.string("Title Text"),
      description: figma.string("Description Text"),
      showIcon: figma.boolean("Icon")
    },
    example: (props) => (
      <Alert variant={props.variant}>
        {props.showIcon && (
          props.variant === "destructive" ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )
        )}
        <AlertTitle>{props.title}</AlertTitle>
        <AlertDescription>{props.description}</AlertDescription>
      </Alert>
    ),
  }
)
