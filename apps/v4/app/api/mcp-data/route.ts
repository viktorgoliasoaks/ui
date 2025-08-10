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
    
    // Get additional component data (React source, etc.)
    const componentData = await mcpDataManager.getComponentData(mcpData.nodeId)
    
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