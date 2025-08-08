'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card'
import { Button } from '@/registry/new-york-v4/ui/button'
import { Input } from '@/registry/new-york-v4/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/new-york-v4/ui/select'
import { Alert, AlertDescription } from '@/registry/new-york-v4/ui/alert'
import { Badge } from '@/registry/new-york-v4/ui/badge'
import { Loader2, AlertCircle, CheckCircle, ExternalLink, Wifi, WifiOff } from 'lucide-react'

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
  
  function mcp_Figma_get_image(params: {
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
  const [figmaImage, setFigmaImage] = useState<string>("")
  const [selectedVariant, setSelectedVariant] = useState<string>("default")
  const [availableVariants, setAvailableVariants] = useState<string[]>([])
  const [imageLoading, setImageLoading] = useState<boolean>(false)
  const [hasCodeConnect, setHasCodeConnect] = useState<boolean>(false)
  const [codeConnectInfo, setCodeConnectInfo] = useState<any>({})
  const [mcpStatus, setMcpStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking')

  // Parse Figma URL to extract fileKey and nodeId
  const parseFigmaUrl = (url: string) => {
    const regex = /figma\.com\/design\/([a-zA-Z0-9]+)\/.*node-id=([0-9-:]+)/
    const match = url.match(regex)
    
    if (match) {
      return {
        fileKey: match[1],
        nodeId: match[2].replace(/-/g, ':')
      }
    }
    return null
  }

  // Real MCP function to get Code Connect mapping
  const getRealCodeConnectMapping = async (nodeId: string) => {
    try {
      console.log(`🔗 Attempting REAL MCP call: get_code_connect_map for node ${nodeId}`)
      
      // @ts-ignore - Direct MCP call
      const data = await mcp_Figma_get_code_connect_map({
        nodeId,
        clientName: 'cursor',
        clientFrameworks: 'react',
        clientLanguages: 'typescript'
      })

      if (data && Object.keys(data).length > 0) {
        console.log('✅ MCP Code Connect mapping received:', data)
        setMcpStatus('connected')
        return data
      } else {
        console.log('⚠️ No Code Connect data found for this component')
        setMcpStatus('connected')
        return null
      }
      
    } catch (error) {
      console.log('⚠️ MCP Code Connect mapping unavailable:', error instanceof Error ? error.message : String(error))
      setMcpStatus('disconnected')
      return null
    }
  }

  // Real MCP function to get component code
  const getRealComponentCode = async (nodeId: string) => {
    try {
      console.log(`🔗 Attempting REAL MCP call: get_code for node ${nodeId}`)
      
      // @ts-ignore - Direct MCP call
      const data = await mcp_Figma_get_code({
        nodeId,
        clientName: 'cursor',
        clientFrameworks: 'react',
        clientLanguages: 'typescript'
      })

      if (data && data.trim()) {
        console.log('✅ MCP component code received')
        setMcpStatus('connected')
        return data
      } else {
        console.log('⚠️ No Code Connect code found for this component')
        setMcpStatus('connected')
        return null
      }
      
    } catch (error) {
      console.log('⚠️ MCP component code unavailable:', error instanceof Error ? error.message : String(error))
      setMcpStatus('disconnected')
      return null
    }
  }

  // Real MCP function to get component image
  const getRealComponentImage = async (nodeId: string) => {
    try {
      setImageLoading(true)
      console.log(`🔗 Attempting REAL MCP call: get_image for node ${nodeId}`)
      
      // @ts-ignore - Direct MCP call
      const imageData = await mcp_Figma_get_image({
        nodeId,
        clientName: 'cursor',
        clientFrameworks: 'react',
        clientLanguages: 'typescript'
      })

      if (imageData) {
        console.log('✅ MCP component image received')
        setMcpStatus('connected')
        setFigmaImage(imageData)
      } else {
        console.log('⚠️ No image data received from MCP')
        setMcpStatus('connected')
        setFigmaImage("")
      }
      
    } catch (error) {
      console.log('⚠️ MCP component image unavailable:', error instanceof Error ? error.message : String(error))
      setMcpStatus('disconnected')
      setFigmaImage("")
    } finally {
      setImageLoading(false)
    }
  }

  // Test MCP connection
  const testMCPConnection = async () => {
    try {
      setMcpStatus('checking')
      
      // Check if MCP functions are available in this context
      console.log('🔍 Checking MCP function availability...')
      console.log('mcp_Figma_get_code_connect_map available:', typeof mcp_Figma_get_code_connect_map !== 'undefined')
      console.log('mcp_Figma_get_code available:', typeof mcp_Figma_get_code !== 'undefined')
      console.log('mcp_Figma_get_image available:', typeof mcp_Figma_get_image !== 'undefined')
      
      if (typeof mcp_Figma_get_code_connect_map === 'undefined') {
        throw new Error('MCP functions not available in browser context')
      }
      
      // @ts-ignore - Direct MCP call to test connection
      const testData = await mcp_Figma_get_code_connect_map({
        nodeId: "test",
        clientName: 'cursor',
        clientFrameworks: 'react',
        clientLanguages: 'typescript'
      })
      
      // Even if no data, if the call succeeds, MCP is connected
      console.log('✅ MCP connection test passed')
      setMcpStatus('connected')
      return true
      
    } catch (error) {
      console.log('⚠️ MCP connection test failed:', error instanceof Error ? error.message : String(error))
      setMcpStatus('disconnected')
      return false
    }
  }

  // Real React component source would come from MCP
  const loadRealReactSource = async (componentName: string) => {
    // In a real MCP implementation, this would fetch component source via MCP
    // Since we have no mock data, return a message indicating real MCP is needed
    return `// ❌ No component source available
// Component: ${componentName}
// 
// Real implementation requires:
// 1. Actual MCP connection to fetch component definitions
// 2. Integration with Figma Code Connect APIs
// 3. Live component source from repository
//
// No mock data available - only real MCP calls supported.`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!figmaLink.trim()) return

    setLoading(true)
    setError("")
    setComponentData(null)
    setPublishedCode("")
    setReactCode("")
    setFigmaImage("")
    setHasCodeConnect(false)
    setCodeConnectInfo({})
    setAvailableVariants([])
    setMcpStatus('checking')

    try {
      const parsed = parseFigmaUrl(figmaLink)
      if (!parsed) {
        throw new Error("Invalid Figma URL format")
      }

      console.log(`🚀 Processing component with REAL MCP: ${parsed.nodeId}`)

      // Test MCP connection first
      const mcpConnected = await testMCPConnection()
      if (!mcpConnected) {
        setError("❌ No MCP Connection Available - Real Figma MCP tools required")
        return
      }

      // 1. Get Code Connect mapping via REAL MCP
      console.log("📡 Step 1: Getting Code Connect mapping...")
      const codeConnectMapping = await getRealCodeConnectMapping(parsed.nodeId)
      
      if (codeConnectMapping && Object.keys(codeConnectMapping).length > 0) {
        console.log("✅ Code Connect mapping found:", codeConnectMapping)
        setHasCodeConnect(true)
        setCodeConnectInfo(codeConnectMapping)
        
        // Extract variants if available
        const variants = codeConnectMapping.props?.variant || ["default"]
        const variantList = Array.isArray(variants) ? variants : Object.values(variants) || ["default"]
        setAvailableVariants(variantList)
        setSelectedVariant(variantList[0])
        
      } else {
        console.log("❌ No Code Connect mapping found")
        setHasCodeConnect(false)
        setAvailableVariants(["default"])
        setSelectedVariant("default")
      }

      // 2. Get component code via REAL MCP
      console.log("📡 Step 2: Getting component code...")
      const componentCode = await getRealComponentCode(parsed.nodeId)
      
      if (componentCode) {
        console.log("✅ Component code retrieved")
        setPublishedCode(componentCode)
      } else {
        console.log("⚠️ No component code available via MCP")
        setPublishedCode(`// ❌ No published code available via MCP
// Node ID: ${parsed.nodeId}
//
// Real MCP implementation required to fetch component code.
// Current API endpoints return no data (no mock data available).`)
      }

      // 3. Load React component source
      console.log("📡 Step 3: Loading React component source...")
      const componentName = codeConnectMapping?.codeConnectName || "Component"
      const reactSource = await loadRealReactSource(componentName)
      setReactCode(reactSource)

      // 4. Get component image via REAL MCP
      console.log("📡 Step 4: Getting component image...")
      await getRealComponentImage(parsed.nodeId)

      setComponentData({
        nodeId: parsed.nodeId,
        fileKey: parsed.fileKey,
        hasCodeConnect,
        name: componentName
      })

      console.log("🎉 All MCP calls completed successfully!")

    } catch (err) {
      console.error("❌ Error in MCP-dependent processing:", err)
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)
      
      // If it's an MCP error, show helpful guidance
      if (err instanceof Error && err.message.includes('MCP')) {
        setError(`${errorMessage}

🔧 Troubleshooting:
1. Check Cursor's MCP status indicator (should be green)
2. Try: Cmd+Shift+P → "MCP: Restart Server" 
3. Verify you're logged into Figma
4. Check network connection`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVariantChange = async (variant: string) => {
    setSelectedVariant(variant)
    
    if (componentData && hasCodeConnect) {
      console.log(`🔄 Variant changed to: ${variant} - refreshing via MCP...`)
      
      try {
        // Refresh code for new variant via MCP
        const componentCode = await getRealComponentCode(componentData.nodeId)
        setPublishedCode(componentCode || "// No code available for this variant")
        
        // Refresh image for new variant via MCP
        await getRealComponentImage(componentData.nodeId)
      } catch (error) {
        console.error("❌ Failed to refresh for variant:", error)
        setError("Failed to refresh component data for new variant")
      }
    }
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto p-6 space-y-6">
      {/* MCP Status Indicator */}
      <div className="flex items-center justify-between">
                  <div className="text-center space-y-2 flex-1">
            <h1 className="text-3xl font-bold">Code Connect Component Inspector</h1>
            <p className="text-muted-foreground">
              ⚠️ Architecture Limitation: MCP functions not accessible in browser context
            </p>
          </div>
        
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border">
          {mcpStatus === 'connected' && (
            <>
              <Wifi className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">MCP Connected</span>
            </>
          )}
          {mcpStatus === 'disconnected' && (
            <>
              <WifiOff className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-600 font-medium">MCP Disconnected</span>
            </>
          )}
          {mcpStatus === 'checking' && (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-yellow-600" />
              <span className="text-sm text-yellow-600 font-medium">Checking MCP...</span>
            </>
          )}
        </div>
      </div>

      {/* MCP Warning */}
      {mcpStatus === 'disconnected' && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>MCP Not Accessible:</strong> While Cursor may have a green MCP indicator, MCP functions are not accessible in the browser context where this Next.js app runs. 
            <br/><br/>
            <strong>Architecture Limitation:</strong> MCP functions work in Cursor's internal environment but cannot be called from localhost browser applications.
            <br/><br/>
            <strong>Solutions:</strong>
            <br/>• Use Cursor's built-in Figma tools directly
            <br/>• Or: Build server-side MCP integration (requires Cursor MCP setup on server)
          </AlertDescription>
        </Alert>
      )}

      {/* Input Section */}
      <div className="max-w-2xl mx-auto">
        <div className="flex w-full scroll-mt-16 flex-col rounded-lg border">
          <div className="border-b px-4 py-3">
            <div className="text-sm font-medium">Figma Component Generator</div>
          </div>
          <div className="flex flex-1 items-center gap-2 p-4">
            <div className="w-full space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="figma-link" className="text-sm font-medium">
                    Figma Component Link
                  </label>
                  <Input
                    id="figma-link"
                    placeholder="https://www.figma.com/design/..."
                    value={figmaLink}
                    onChange={(e) => setFigmaLink(e.target.value)}
                    disabled={loading || mcpStatus === 'disconnected'}
                  />
                  <p className="text-xs text-muted-foreground">
                    🔗 Will make REAL MCP calls to fetch live data from Figma
                  </p>
                </div>

                {availableVariants.length > 1 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Component Variant (via MCP)</label>
                    <Select 
                      value={selectedVariant} 
                      onValueChange={handleVariantChange}
                      disabled={!hasCodeConnect || mcpStatus === 'disconnected'}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select variant" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableVariants.map((variant) => (
                          <SelectItem key={variant} value={variant}>
                            {variant}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={loading || mcpStatus === 'disconnected'} 
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Making MCP Calls...
                    </>
                  ) : mcpStatus === 'disconnected' ? (
                    <>
                      <WifiOff className="mr-2 h-4 w-4" />
                      MCP Required
                    </>
                  ) : (
                    <>
                      <Wifi className="mr-2 h-4 w-4" />
                      Inspect via MCP
                    </>
                  )}
                </Button>
              </form>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 whitespace-pre-line">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results - Only show if MCP is connected */}
      {componentData && mcpStatus === 'connected' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Component Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Figma Design Preview
                  <Badge className="bg-blue-100 text-blue-800">
                    <Wifi className="w-3 h-3 mr-1" />
                    Live MCP Data
                  </Badge>
                  {hasCodeConnect ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Published
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Not Published
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="aspect-video bg-gray-50 rounded-lg flex items-center justify-center">
                  {imageLoading ? (
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Fetching via MCP...</p>
                    </div>
                  ) : figmaImage ? (
                    <img 
                      src={figmaImage} 
                      alt="Component preview"
                      className="max-w-full max-h-full object-contain rounded"
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                      <p>No image from MCP</p>
                      <a 
                        href={figmaLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm inline-flex items-center mt-2"
                      >
                        Open in Figma <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Published Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Figma Code Connect
                  <Badge variant="outline" className="text-xs">
                    MCP Source
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto max-h-96">
                  <code>{publishedCode}</code>
                </pre>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* React Component */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  React Component Definition
                  <Badge variant="outline" className="text-xs">
                    Live Source
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto max-h-96">
                  <code>{reactCode}</code>
                </pre>
              </CardContent>
            </Card>

            {/* Code Connect Info */}
            {hasCodeConnect && Object.keys(codeConnectInfo).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Code Connect Metadata
                    <Badge variant="outline" className="text-xs">
                      MCP Data
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {codeConnectInfo.codeConnectSrc && (
                    <div>
                      <span className="font-medium">Source:</span>
                      <a 
                        href={codeConnectInfo.codeConnectSrc} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-600 hover:underline inline-flex items-center"
                      >
                        {codeConnectInfo.codeConnectSrc}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  )}
                  
                  {codeConnectInfo.codeConnectName && (
                    <div>
                      <span className="font-medium">Component:</span>
                      <span className="ml-2">{codeConnectInfo.codeConnectName}</span>
                    </div>
                  )}
                  
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      🔗 <strong>Live MCP Connection:</strong> This data is fetched in real-time from Figma via MCP. 
                      If the MCP indicator turns red, this section will fail to load.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}