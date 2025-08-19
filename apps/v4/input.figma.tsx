import figma from "@figma/code-connect"
import React from "react"
import { Input } from "./registry/new-york-v4/ui/input"

/**
 * Input component connected to Figma Design System
 * This connects the React Input component to the Figma input at node-id=81-2039
 */

figma.connect(
  Input,
  "https://www.figma.com/design/rgqHmkJX2Uw9PhGoon1OIh/MCP-Code-Connect-DS?node-id=81-2039&t=RlLEGH9QbXYTHXjC-1",
  {
    props: {
      placeholder: figma.string("Placeholder Text"),
      labelText: figma.string("Label Text"),
      showLabel: figma.boolean("Show Label"),
      descriptionText: figma.string("Description Text"),
      showDescription: figma.boolean("Show Description"),
      horizontalLayout: figma.enum("Horizontal Layout", {
        "No": false,
        "Yes": true
      }),
      variant: figma.enum("Variant", {
        "Default": "text",
        "File": "file"
      }),
      state: figma.enum("State", {
        "Default": "default",
        "Focus": "focus",
        "Filled": "filled",
        "Disabled": "disabled",
        "Error": "error",
        "Error (Focus)": "error-focus"
      })
    },
    example: (props) => (
      <div className="grid w-full items-center gap-1.5">
        {props.showLabel && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {props.labelText}
          </label>
        )}
        <Input 
          type={props.variant === "file" ? "file" : "text"}
          disabled={props.state === "disabled"}
          className={props.state === "error" || props.state === "error-focus" ? "border-destructive w-full" : "w-full"}
        />
        {props.showDescription && (
          <p className="text-sm text-muted-foreground">
            {props.descriptionText}
          </p>
        )}
      </div>
    ),
  },
) 