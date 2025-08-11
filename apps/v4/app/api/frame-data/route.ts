import { NextRequest } from 'next/server'
import { FrameDataManager } from '@/lib/frame-data-manager'

export async function GET(request: NextRequest) {
  try {
    console.log('🔗 API: Getting current frame data')
    
    // Get current frame (always from current-frame.json)
    const frameDataManager = new FrameDataManager()
    const frameData = await frameDataManager.getCurrentFrame()
    
    if (!frameData) {
      return Response.json({
        success: false,
        error: 'No current frame found',
        suggestion: 'Run frame fetch command in Cursor first:\n\nnpm run frame:fetch <frameNodeId>\n\nOr for URLs:\nnpm run frame:fetch-url "https://figma.com/..."'
      }, { status: 404 })
    }
    
    console.log(`✅ API: Returning current frame data for ${frameData.frameNodeId}`)
    console.log(`   - Children: ${frameData.children.length}`)
    console.log(`   - Valid components: ${frameData.children.filter(c => c.publishedCode).length}`)
    
    return Response.json({
      success: true,
      data: frameData
    })
    
  } catch (error) {
    console.error('❌ API: Failed to get frame data:', error)
    return Response.json({
      success: false,
      error: 'Failed to load frame data'
    }, { status: 500 })
  }
}
