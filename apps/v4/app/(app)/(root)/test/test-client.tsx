"use client"

import { Input } from "@/registry/new-york-v4/ui/input"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Card, CardContent } from "@/registry/new-york-v4/ui/card"
import { useState, useEffect } from "react"
import { FigmaMCPService, FigmaComponentData } from "@/lib/figma-mcp"

export default function TestClient() {
  const [figmaLink, setFigmaLink] = useState("")
  const [componentData, setComponentData] = useState<FigmaComponentData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const figmaService = FigmaMCPService.getInstance()

  // Handle Figma link processing
  const handleLoadComponent = async () => {
    if (!figmaLink.trim()) {
      setError("Please enter a Figma link")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const parsed = figmaService.parseFigmaUrl(figmaLink)
      if (!parsed) {
        throw new Error("Invalid Figma URL format")
      }

      const data = await figmaService.fetchComponentData(parsed.fileKey, parsed.nodeId)
      setComponentData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load component")
      setComponentData(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Render the component dynamically
  const renderComponent = () => {
    if (!componentData) return null

    // For now, we'll render a simple button or input based on the node ID
    // In a real implementation, this would use the actual component code
    if (componentData.nodeId === "28-1289") {
      return <Button>Button</Button>
    } else if (componentData.nodeId === "12-272") {
      return <Input placeholder="Enter text..." />
    }

    return <div className="text-gray-500">Component rendered here</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Figma Component Test
          </h1>
          <p className="text-gray-600">
            Paste a Figma link to test and generate code for components
          </p>
        </div>

        {/* Input Section */}
        <div className="space-y-4">
          <label htmlFor="figma-link" className="block text-sm font-medium text-gray-700">
            Figma Component Link
          </label>
          <div className="flex gap-4">
            <Input
              id="figma-link"
              placeholder="https://figma.com/file/...?node-id=..."
              value={figmaLink}
              onChange={(e) => setFigmaLink(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleLoadComponent}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Load Component"}
            </Button>
          </div>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </div>

        {/* Component Preview Container */}
        <Card className="border-2 border-gray-200 rounded-lg">
          <CardContent className="p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Component Preview
            </h3>
            <div className="min-h-[200px] bg-white rounded-lg border border-gray-200 p-8 flex items-center justify-center">
              {isLoading ? (
                <div className="text-center text-gray-500">
                  <p>Loading component...</p>
                </div>
              ) : componentData ? (
                <div className="text-center">
                  {renderComponent()}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <p>Paste a Figma link above to see the component preview</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Code Display Container */}
        <Card className="border-2 border-gray-200 rounded-lg">
          <CardContent className="p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Generated Code
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* React Component Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">React Component</h4>
                <div className="bg-gray-900 rounded-lg p-4">
                  <pre className="text-sm text-gray-300 overflow-x-auto">
                    <code>
                      {componentData?.reactCode || `// Paste a Figma link to see the React component code`}
                    </code>
                  </pre>
                </div>
              </div>

              {/* Figma Code Connect Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Figma Code Connect</h4>
                <div className="bg-gray-900 rounded-lg p-4">
                  <pre className="text-sm text-gray-300 overflow-x-auto">
                    <code>
                      {componentData?.figmaCode || `// Paste a Figma link to see the Figma Code Connect definition`}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 