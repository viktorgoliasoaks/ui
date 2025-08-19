import { NextRequest } from 'next/server'
import { mcpDataManager } from '@/lib/mcp-utils'

export async function GET(request: NextRequest) {
  try {
    console.log('🔗 API: Getting current component data')
    
    // Get current component (always from current-component.json)
    const mcpData = await mcpDataManager.getCurrentComponent()
    
    if (!mcpData) {
      return Response.json({
        success: false,
        error: 'No current component found',
        suggestion: 'Run an MCP fetch command in Cursor first:\n\nnpm run mcp:fetch <nodeId>\n\nOr for URLs:\nnpm run mcp:cli fetch-url "https://figma.com/..."'
      }, { status: 404 })
    }
    
    // Try to infer component name from MCP data
    let componentName = 'checkbox' // Default for checkbox
    
    // Map known node IDs to component names
    const nodeIdToComponent: Record<string, string> = {
      '28:1289': 'button',
      '91:366': 'checkbox',
      '81:2039': 'input',
      '139-364': 'alert'
    }
    
    if (nodeIdToComponent[mcpData.nodeId]) {
      componentName = nodeIdToComponent[mcpData.nodeId]
    } else if (mcpData.mapping) {
      const firstMapping = Object.values(mcpData.mapping)[0] as any
      if (firstMapping?.componentName) {
        componentName = firstMapping.componentName.toLowerCase()
      }
    }
    
    // Get React component source
    const reactComponent = await mcpDataManager.readReactComponent(componentName)
    const codeConnectFile = await mcpDataManager.findCodeConnectFile(mcpData.nodeId)
    
    const componentData = {
      nodeId: mcpData.nodeId,
      figmaData: mcpData,
      reactCode: reactComponent?.code || null,
      reactPath: reactComponent?.path || null,
      codeConnectFile: codeConnectFile?.code || null,
      published: mcpData.published || false,
      timestamp: mcpData.timestamp || new Date().toISOString(),
      error: mcpData.error
    }
    
    console.log(`✅ API: Returning current component data for ${mcpData.nodeId}`)
    console.log(`   - Published: ${componentData.published}`)
    console.log(`   - React Code: ${componentData.reactCode ? 'Found' : 'Missing'}`)
    
    return Response.json({
      success: true,
      data: componentData
    })
    
  } catch (error) {
    console.error('❌ API: Error getting current component:', error)
    return Response.json({
      success: false,
      error: 'Internal server error',
      suggestion: 'Check server logs for details'
    }, { status: 500 })
  }
}