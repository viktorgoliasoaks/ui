import figma from "@figma/code-connect"
import React from "react"
import { Input } from "./registry/new-york-v4/ui/input"

/**
 * Input component connected to Figma Design System
 * This connects the React Input component to the Figma input at node-id=81-2039
 */

figma.connect(
  Input,
  "https://www.figma.com/design/rgqHmkJX2Uw9PhGoon1OIh/MCP-Code-Connect-DS?node-id=81-2039&t=aFXYcC276ZBh3Qpz-1",
  {
    props: {
      placeholder: figma.string("Placeholder Text"),
      type: figma.enum("Input Type", {
        "Text": "text",
        "Email": "email",
        "Password": "password",
        "Number": "number",
        "Search": "search",
        "Tel": "tel",
        "URL": "url"
      }),
      disabled: figma.boolean("Disabled"),
      required: figma.boolean("Required"),
      value: figma.string("Value")
    },
    example: (props) => {
      // Return proper React JSX like Button component
      return <Input placeholder={props.placeholder} type={props.type} disabled={props.disabled} required={props.required} value={props.value} />
    },
  },
) 