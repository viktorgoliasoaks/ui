#!/usr/bin/env tsx

/**
 * Frame Data Fetcher - Runs in Cursor context with MCP access
 */

import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { FrameDataResult } from '../lib/frame-types.js'
import { processFrameData } from '../lib/frame-utils.js'

// Reuse existing MCP function declarations
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

interface MCPDataResult {
  nodeId: string
  mapping: any
  code: string | null
  timestamp: string
  source: 'figma-mcp'
  published: boolean
  error?: string
}

// Reuse existing fetchMCPData function
export async function fetchMCPData(nodeId: string): Promise<MCPDataResult> {
  console.log(`🔗 Fetching MCP data for node: ${nodeId}`)
  
  const result: MCPDataResult = {
    nodeId,
    mapping: null,
    code: null,
    timestamp: new Date().toISOString(),
    source: 'figma-mcp',
    published: false
  }
  
  try {
    if (typeof globalThis.mcp_Figma_get_code_connect_map === 'undefined') {
      throw new Error('MCP functions not available. This script must run in Cursor with MCP enabled.')
    }
    
    console.log('📡 Getting Code Connect mapping...')
    result.mapping = await mcp_Figma_get_code_connect_map({
      nodeId,
      clientName: 'cursor',
      clientFrameworks: 'react',
      clientLanguages: 'typescript'
    })
    
    console.log('📡 Getting published code...')
    result.code = await mcp_Figma_get_code({
      nodeId,
      clientName: 'cursor',
      clientFrameworks: 'react',
      clientLanguages: 'typescript'
    })
    
    result.published = !!(result.mapping && Object.keys(result.mapping).length > 0) || !!result.code
    
    console.log(`✅ MCP data fetched successfully for ${nodeId}`)
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.log(`❌ MCP fetch failed for ${nodeId}:`, errorMessage)
    result.error = errorMessage
  }
  
  return result
}

async function ensureDirectories() {
  await mkdir(path.join(process.cwd(), 'mcp-data', 'frames'), { recursive: true })
}

async function saveToFile(filePath: string, data: any) {
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

export async function fetchFrameData(frameNodeId: string): Promise<FrameDataResult> {
  console.log(`🔗 Fetching frame data for: ${frameNodeId}`)
  
  // REUSE: Existing MCP fetch logic
  const frameData = await fetchMCPData(frameNodeId)
  
  // NEW: Process frame data to extract children and imports
  const processedData = processFrameData(frameData, frameNodeId)
  
  console.log(`✅ Frame data processed successfully`)
  console.log(`   - Children found: ${processedData.children.length}`)
  console.log(`   - Valid components: ${processedData.children.filter(c => c.publishedCode).length}`)
  
  return processedData
}

export async function saveFrameData(data: FrameDataResult) {
  await ensureDirectories()
  
  // Always save to current-frame.json
  const filePath = path.join(process.cwd(), 'mcp-data', 'frames', 'current-frame.json')
  await saveToFile(filePath, data)
  
  console.log(`💾 Frame data saved to: ${filePath}`)
  console.log(`🎯 Frame: ${data.frameNodeId} is now the current frame`)
}

// Main execution function
export async function fetchAndSaveFrame(frameNodeId: string) {
  try {
    const data = await fetchFrameData(frameNodeId)
    await saveFrameData(data)
    
    return {
      success: true,
      frameNodeId,
      childrenCount: data.children.length,
      validComponents: data.children.filter(c => c.publishedCode).length,
      filePath: `mcp-data/frames/current-frame.json`
    }
    
  } catch (error) {
    console.error(`💥 Failed to fetch and save frame data for ${frameNodeId}:`, error)
    return {
      success: false,
      frameNodeId,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

// CLI execution
if (import.meta.main || process.argv[1]?.includes('frame-fetch.ts')) {
  console.log('🚀 Frame Fetch Script Starting...')
  
  const frameNodeId = process.argv[2]
  if (!frameNodeId) {
    console.log('❌ Usage: tsx frame-fetch.ts <frameNodeId>')
    console.log('   Example: tsx frame-fetch.ts 22:1167')
    process.exit(1)
  }
  
  console.log(`🎯 Fetching frame data for: ${frameNodeId}`)
  
  fetchAndSaveFrame(frameNodeId).then(result => {
    if (result.success) {
      console.log(`🎉 Success! Frame data for ${frameNodeId} saved.`)
      console.log(`📊 Children: ${result.childrenCount}`)
      console.log(`✅ Valid components: ${result.validComponents}`)
    } else {
      console.log(`💥 Failed: ${result.error}`)
      process.exit(1)
    }
  }).catch(error => {
    console.error('💥 Unhandled error:', error)
    process.exit(1)
  })
}
