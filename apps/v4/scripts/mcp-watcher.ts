#!/usr/bin/env tsx

/**
 * MCP Request Watcher - Monitors for MCP fetch requests
 * 
 * This script watches for request files created by the web app
 * and automatically triggers MCP data fetching when running in Cursor context.
 */

import { watch } from 'fs'
import { readFile, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { fetchAndSave } from './mcp-fetch.js'

const REQUESTS_DIR = path.join(process.cwd(), 'mcp-data', 'requests')

interface MCPRequest {
  nodeId: string
  requestedAt: string
  status: 'pending' | 'completed' | 'failed'
  requestId: string
}

async function processRequest(requestFilePath: string) {
  try {
    console.log(`🔍 Processing request: ${requestFilePath}`)
    
    const content = await readFile(requestFilePath, 'utf-8')
    const request: MCPRequest = JSON.parse(content)
    
    if (request.status !== 'pending') {
      console.log(`⏭️ Skipping ${request.requestId} - status: ${request.status}`)
      return
    }
    
    console.log(`🚀 Fetching MCP data for ${request.nodeId}...`)
    
    const result = await fetchAndSave(request.nodeId)
    
    if (result.success) {
      console.log(`✅ Successfully processed request ${request.requestId}`)
    } else {
      console.log(`❌ Failed to process request ${request.requestId}: ${result.error}`)
    }
    
    // Clean up the request file
    await unlink(requestFilePath)
    console.log(`🗑️ Cleaned up request file: ${requestFilePath}`)
    
  } catch (error) {
    console.error(`💥 Error processing request ${requestFilePath}:`, error)
  }
}

async function startWatcher() {
  if (!existsSync(REQUESTS_DIR)) {
    console.log(`📁 Requests directory doesn't exist: ${REQUESTS_DIR}`)
    console.log('   Create it by making a request through the web app first.')
    return
  }
  
  console.log(`👀 Watching for MCP requests in: ${REQUESTS_DIR}`)
  console.log('💡 This watcher must run in Cursor context to access MCP functions.')
  console.log('')
  
  watch(REQUESTS_DIR, { recursive: true }, (eventType, filename) => {
    if (eventType === 'rename' && filename && filename.endsWith('.json')) {
      const fullPath = path.join(REQUESTS_DIR, filename)
      
      // Check if file was created (not deleted)
      if (existsSync(fullPath)) {
        console.log(`📥 New request detected: ${filename}`)
        
        // Process with a small delay to ensure file is fully written
        setTimeout(() => {
          processRequest(fullPath)
        }, 100)
      }
    }
  })
  
  console.log('🔄 Watcher started. Press Ctrl+C to stop.')
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down MCP watcher...')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down MCP watcher...')
  process.exit(0)
})

// Start the watcher
startWatcher().catch(error => {
  console.error('💥 Failed to start MCP watcher:', error)
  process.exit(1)
})