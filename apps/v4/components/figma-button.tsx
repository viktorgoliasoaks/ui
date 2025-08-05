"use client"

import { FigmaCodeConnectButton } from "@/registry/new-york-v4/ui/button"
import { Client } from "figma-js"

export function FigmaButton() {
  const handleFigmaClick = async () => {
    try {
      // You'll need to get your Figma access token from https://www.figma.com/developers/api#access-tokens
      const accessToken = process.env.NEXT_PUBLIC_FIGMA_ACCESS_TOKEN
      
      if (!accessToken) {
        console.log("Please set NEXT_PUBLIC_FIGMA_ACCESS_TOKEN environment variable")
                                    // Open the new Figma design system
             window.open("https://www.figma.com/design/rgqHmkJX2Uw9PhGoon1OIh/MCP-Code-Connect-DS?node-id=12-65&m=dev", "_blank")
        return
      }

      // Initialize Figma client
      const client = Client({
        personalAccessToken: accessToken
      })

      // Open the new design system file
      const fileKey = "rgqHmkJX2Uw9PhGoon1OIh" // New design system file key
      
      try {
        const response = await client.file(fileKey)
        console.log("Figma Design System loaded:", response.data.name)
      } catch (error) {
        console.log("Could not load file info, but will open in browser")
      }
      
                   // Open the new design system in Figma
             window.open("https://www.figma.com/design/rgqHmkJX2Uw9PhGoon1OIh/MCP-Code-Connect-DS?node-id=12-65&m=dev", "_blank")
      
    } catch (error) {
      console.error("Error connecting to Figma:", error)
                   // Fallback: open the new design system
             window.open("https://www.figma.com/design/rgqHmkJX2Uw9PhGoon1OIh/MCP-Code-Connect-DS?node-id=12-65&m=dev", "_blank")
    }
  }

  return (
    <FigmaCodeConnectButton
      variant="figma"
      onClick={handleFigmaClick}
    >
      View Design System
    </FigmaCodeConnectButton>
  )
} 