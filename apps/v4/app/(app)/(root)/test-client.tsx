'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card'
import { Button } from '@/registry/new-york-v4/ui/button'

import { Alert, AlertDescription } from '@/registry/new-york-v4/ui/alert'
import { Badge } from '@/registry/new-york-v4/ui/badge'
import { Loader2, AlertCircle } from 'lucide-react'

// Declare MCP functions (available in Cursor context)
declare global {
  function mcp_Figma_get_code_connect_map(params: {
    nodeId: string
    clientName: string
    clientFrameworks: string
    clientLanguages: string
  }): Promise<any>
  
  function mcp_Figma_get_code(params: {
    nodeId: string
    clientName: string
    clientFrameworks: string
    clientLanguages: string
  }): Promise<string>
  

}

export default function TestClientTrueMCP() {
  const [figmaLink, setFigmaLink] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [componentData, setComponentData] = useState<any>(null)
  const [error, setError] = useState<string>("")
  const [publishedCode, setPublishedCode] = useState<string>("")
  const [reactCode, setReactCode] = useState<string>("")

    // Figma image fetching removed

  const [imageLoading, setImageLoading] = useState<boolean>(false)
  const [hasCodeConnect, setHasCodeConnect] = useState<boolean>(false)
  const [codeConnectInfo, setCodeConnectInfo] = useState<any>({})
  const [mcpStatus, setMcpStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking')
  const [componentName, setComponentName] = useState<string>("")


  // Get published code from Figma MCP
  const getPublishedCode = async (nodeId: string) => {
    try {
      console.log(`🔗 Getting published code for node: ${nodeId}`)
      
      const code = await mcp_Figma_get_code({
        nodeId: nodeId,
        clientName: 'cursor',
        clientFrameworks: 'react',
        clientLanguages: 'typescript'
      })
      
      console.log('✅ Published code retrieved from Figma MCP')
      return code
      
    } catch (error) {
      console.log('⚠️ Failed to get published code:', error instanceof Error ? error.message : String(error))
      return null
    }
  }

  // Get Code Connect mapping metadata from Figma MCP
  const getCodeConnectMapping = async (nodeId: string) => {
    try {
      console.log(`🔗 Getting Code Connect mapping for node: ${nodeId}`)
      
      const mapping = await mcp_Figma_get_code_connect_map({
        nodeId: nodeId,
        clientName: 'cursor',
        clientFrameworks: 'react',
        clientLanguages: 'typescript'
      })
      
      console.log('✅ Code Connect mapping retrieved from Figma MCP')
      return mapping
      
    } catch (error) {
      console.log('⚠️ Failed to get Code Connect mapping:', error instanceof Error ? error.message : String(error))
      return null
    }
  }





  // Load the current component data (whatever was last fetched)
  const loadCurrentComponent = async () => {
    
    setLoading(true)
    setError("")
    setComponentData(null)
    setPublishedCode("")
    setReactCode("")
    setHasCodeConnect(false)
    setCodeConnectInfo({})

    setImageLoading(true)
    setFigmaLink("") // Will be set from loaded component data

    try {
      console.log(`🚀 Loading current component via MCP Data Bridge`)

      // Use the proper data bridge - read current component from local MCP data
      setMcpStatus('checking')
      
      // Call the API that reads the current component (no nodeId needed)
      const response = await fetch(`/api/mcp-data`)
      const result = await response.json()
      
      if (result.success && result.data.figmaData) {
        const mcpData = result.data.figmaData
        
        // 1. Set published code (now properly separated from full code)
        if (mcpData.publishedCode) {
          setPublishedCode(mcpData.publishedCode)
          setHasCodeConnect(true)
          console.log("✅ Published code loaded from local MCP file")
        } else {
          setPublishedCode(`// ❌ No published code available
// 
// This component may not be published via Code Connect.
// To publish: npx @figma/code-connect publish`)
          setHasCodeConnect(false)
          console.log("⚠️ No published code found")
        }
        
        // 2. Set Code Connect mapping metadata and extract component name
        let extractedComponentName = ""
        if (mcpData.mapping && Object.keys(mcpData.mapping).length > 0) {
          setCodeConnectInfo(mcpData.mapping)
          console.log("✅ Code Connect mapping loaded from local MCP file")
          
          // Extract component name from the first mapping entry
          const firstMapping = Object.values(mcpData.mapping)[0] as any
          if (firstMapping?.componentName) {
            extractedComponentName = firstMapping.componentName
            console.log(`✅ Component name extracted: ${firstMapping.componentName}`)
          } else {
            extractedComponentName = "Unknown Component"
          }
        } else {
          setCodeConnectInfo({})
        }
        
        // Set component name (use extracted name or fallback to nodeId)
        if (extractedComponentName) {
          setComponentName(extractedComponentName)
        } else if (mcpData.nodeId) {
          setComponentName(`Component ${mcpData.nodeId}`)
        } else {
          setComponentName("")
        }
        
        // 3. Set component metadata (not the raw MCP data)
        const metadata = {
          nodeId: mcpData.nodeId,
          published: mcpData.published,
          timestamp: mcpData.timestamp,
          source: mcpData.source,
          variants: mcpData.variants || [],
          variantCount: mcpData.variants?.length || 0,
          hasMapping: !!(mcpData.mapping && Object.keys(mcpData.mapping).length > 0),
          mappingCount: mcpData.mapping ? Object.keys(mcpData.mapping).length : 0
        }
        setComponentData(metadata)
        
        // Reconstruct Figma URL if we have the data
        if (mcpData.nodeId) {
          const figmaUrl = `https://www.figma.com/design/rgqHmkJX2Uw9PhGoon1OIh/MCP-Code-Connect-DS?node-id=${mcpData.nodeId}&m=dev`
          setFigmaLink(figmaUrl)
        }
        
        // 4. Set React code from local file
        if (result.data.reactCode) {
          setReactCode(result.data.reactCode)
          console.log("✅ React code loaded from local file")
        }
        
      } else {
        // No MCP data available - show instructions
        setPublishedCode(`// ❌ No current component data available
// 
// Run this command in Cursor to fetch a component:
// npm run mcp:fetch <nodeId>
// or
// npm run mcp:button    (for button example)`)
        setCodeConnectInfo({})
        setComponentName("")
        setHasCodeConnect(false)
        setError(result.error || "No current component data available")
        console.log("⚠️ No current component found in local files")
      }
      
      setMcpStatus('connected')
      console.log("🎉 MCP data loaded successfully from local files!")

    } catch (error) {
      console.error("❌ Error loading Button component:", error)
      setError(error instanceof Error ? error.message : String(error))
    } finally {
      setLoading(false)
      setImageLoading(false)
    }
  }







  // Auto-load current component data on mount
  useEffect(() => {
    loadCurrentComponent()
  }, [])

  return (
    <div className="w-full max-w-[1440px] mx-auto p-6 space-y-6">
        {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Code Connect Component Inspector</h1>
        <p className="text-muted-foreground">
          🔄 Real MCP Data Bridge: Figma ↔ Cursor ↔ Web App
        </p>
        {componentName && (
          <div className="mt-4">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              Current Component: <span className="font-semibold ml-1">{componentName}</span>
            </Badge>
          </div>
        )}
      </div>





      

      {/* MCP Data Preview Section */}
      <div id="code-preview" className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">
          MCP Data Preview{componentName ? ` for: ${componentName}` : ''}
        </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Published Code Card */}
          <Card className="border-2 border-purple-200 rounded-lg">
            <CardContent className="p-6">
              <h4 className="text-sm font-medium text-gray-700 flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                  Published Code (publishedCode)
                </div>
                <span className="text-xs text-gray-500 font-mono">source: figma MCP</span>
              </h4>
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 max-h-80 overflow-auto">
                <pre className="text-xs text-gray-300 font-mono">
                    <code className="text-gray-300">
                    {publishedCode || `// No published code available\n// Load a Figma component to see published code`}
                    </code>
                  </pre>
                </div>
            </CardContent>
          </Card>

          {/* React Code Card */}
          <Card className="border-2 border-blue-200 rounded-lg">
            <CardContent className="p-6">
              <h4 className="text-sm font-medium text-gray-700 flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  React Code (reactCode)
                </div>
                <span className="text-xs text-gray-500 font-mono">source: local repository</span>
              </h4>
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 max-h-80 overflow-auto">
                <pre className="text-xs text-gray-300 font-mono">
                  <code className="text-gray-300">
                    {reactCode || `// No React code available\n// Load a Figma component to see React source`}
                  </code>
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Component Data Card */}
          <Card className="border-2 border-green-200 rounded-lg">
            <CardContent className="p-6">
              <h4 className="text-sm font-medium text-gray-700 flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  Component Metadata (componentData)
                </div>
                <span className="text-xs text-gray-500 font-mono">source: figma MCP</span>
              </h4>
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 max-h-80 overflow-auto">
                <pre className="text-xs text-gray-300 font-mono">
                    <code className="text-gray-300">
                    {componentData ? JSON.stringify(componentData, null, 2) : `// No component metadata available\n// Load a Figma component to see metadata`}
                    </code>
                  </pre>
                </div>
            </CardContent>
          </Card>

          {/* Code Connect Info Card */}
          <Card className="border-2 border-orange-200 rounded-lg">
            <CardContent className="p-6">
              <h4 className="text-sm font-medium text-gray-700 flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                  Code Connect Info (codeConnectInfo)
                </div>
                <span className="text-xs text-gray-500 font-mono">source: figma MCP</span>
              </h4>
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 max-h-80 overflow-auto">
                <pre className="text-xs text-gray-300 font-mono">
                  <code className="text-gray-300">
                    {codeConnectInfo ? JSON.stringify(codeConnectInfo, null, 2) : `// No Code Connect info available\n// Load a Figma component to see mapping data`}
                  </code>
                </pre>
            </div>
          </CardContent>
        </Card>

        </div>
      </div>
    </div>
  )
} 