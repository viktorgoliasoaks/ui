import figma from "@figma/code-connect"
import React from "react"
import { Checkbox } from "@/registry/new-york-v4/ui/checkbox"

/**
 * Checkbox component connected to Figma Design System
 * This connects the React Checkbox component to the Figma checkbox at node-id=91-366
 */

figma.connect(
  Checkbox,
  "https://www.figma.com/design/rgqHmkJX2Uw9PhGoon1OIh/MCP-Code-Connect-DS?node-id=91-366&t=xlBfzvne8ZfDEVIZ-4",
  {
    props: {
      checked: figma.enum("Status", {
        "Active": true,
        "Inactive": false
      }),
      disabled: figma.enum("State", {
        "Default": false,
        "Focus": false,
        "Disabled": true,
        "Pressed": false
      }),
      labelText: figma.string("Label Text"),
      descriptionText: figma.string("Description Text"), 
      showText: figma.boolean("Show Text"),
      showDescription: figma.boolean("Show Description")
    },
    example: (props) => {
      // If no text is shown, return just the checkbox
      if (!props.showText) {
        return <Checkbox checked={props.checked} disabled={props.disabled} />
      }
      
      // If text is shown, wrap with label and description
      return (
        <div className="flex items-start space-x-2">
          <Checkbox 
            checked={props.checked} 
            disabled={props.disabled}
            id="checkbox-with-text"
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="checkbox-with-text"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {props.labelText}
            </label>
            {props.showDescription && (
              <p className="text-sm text-muted-foreground">
                {props.descriptionText}
              </p>
            )}
          </div>
        </div>
      )
    },
  },
)