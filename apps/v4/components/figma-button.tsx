"use client"

import { FigmaCodeConnectButton } from "@/registry/new-york-v4/ui/button"
import { Client } from "figma-js"
import { useState } from "react"

export function FigmaButton() {
  const [showCodePanel, setShowCodePanel] = useState(false)
  const [publishedCode, setPublishedCode] = useState<string>("")

  const handleFigmaClick = async () => {
    try {
      // You'll need to get your Figma access token from https://www.figma.com/developers/api#access-tokens
      const accessToken = process.env.NEXT_PUBLIC_FIGMA_ACCESS_TOKEN
      
      if (!accessToken) {
        console.log("Please set NEXT_PUBLIC_FIGMA_ACCESS_TOKEN environment variable")
        // Open the new Figma design system
        window.open("https://www.figma.com/design/rgqHmkJX2Uw9PhGoon1OIh/MCP-Code-Connect-DS?node-id=28-1289&m=dev", "_blank")
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
      window.open("https://www.figma.com/design/rgqHmkJX2Uw9PhGoon1OIh/MCP-Code-Connect-DS?node-id=28-1289&m=dev", "_blank")
      
    } catch (error) {
      console.error("Error connecting to Figma:", error)
      // Fallback: open the new design system
      window.open("https://www.figma.com/design/rgqHmkJX2Uw9PhGoon1OIh/MCP-Code-Connect-DS?node-id=28-1289&m=dev", "_blank")
    }
  }

  const handleShowPublishedCode = () => {
    // Set the published code from Figma Code Connect
    const code = `<!-- Published Code from Figma Code Connect -->
<button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2">
  Button
</button>`

    setPublishedCode(code)
    setShowCodePanel(true)
  }

  return (
    <>
      <div className="flex gap-4">
        <FigmaCodeConnectButton
          variant="figma"
          onClick={handleFigmaClick}
        >
          View Design System
        </FigmaCodeConnectButton>
        
        <FigmaCodeConnectButton
          variant="outline"
          onClick={handleShowPublishedCode}
        >
          Show Published Code
        </FigmaCodeConnectButton>
      </div>

      {/* Bottom Right Code Panel */}
      {showCodePanel && (
        <div className="fixed bottom-4 right-4 w-96 h-64 bg-gray-900 text-green-400 rounded-lg shadow-2xl border border-gray-700 overflow-hidden z-50">
          <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
            <h3 className="text-sm font-medium text-gray-200">Published Code from Figma</h3>
            <button
              onClick={() => setShowCodePanel(false)}
              className="text-gray-400 hover:text-gray-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4 h-full overflow-auto">
            <pre className="text-xs leading-relaxed">
              <code>{publishedCode}</code>
            </pre>
          </div>
        </div>
      )}
    </>
  )
} 