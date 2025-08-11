#!/usr/bin/env tsx

/**
 * Frame CLI - Convenient command-line interface for frame operations
 * 
 * Usage examples:
 *   tsx scripts/frame-cli.ts fetch 22:1167
 *   tsx scripts/frame-cli.ts fetch-url "https://www.figma.com/design/..."
 *   tsx scripts/frame-cli.ts list
 *   tsx scripts/frame-cli.ts help
 */

import { fetchAndSaveFrame } from './frame-fetch.js'
import { FrameDataManager } from '../lib/frame-data-manager.js'
import { readdir, readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const commands = {
  fetch: 'Fetch frame data for a specific frame ID',
  'fetch-url': 'Fetch frame data from a Figma URL',
  list: 'List all cached frame data',
  help: 'Show this help message'
}

async function fetchByFrameId(frameId: string) {
  console.log(`🔗 Fetching frame data for: ${frameId}`)
  
  const result = await fetchAndSaveFrame(frameId)
  
  if (result.success) {
    console.log(`✅ Success! Frame data saved.`)
    console.log(`📊 Children: ${result.childrenCount}`)
    console.log(`✅ Valid components: ${result.validComponents}`)
  } else {
    console.log(`❌ Failed: ${result.error}`)
    process.exit(1)
  }
}

async function fetchByUrl(figmaUrl: string) {
  console.log(`🔗 Parsing Figma URL: ${figmaUrl}`)
  
  const frameDataManager = new FrameDataManager()
  const parsed = frameDataManager.parseFigmaUrl(figmaUrl)
  
  if (!parsed) {
    console.log('❌ Invalid Figma URL format')
    console.log('   Expected format: https://www.figma.com/design/.../...?node-id=...')
    process.exit(1)
  }
  
  console.log(`📍 Extracted frame ID: ${parsed.frameNodeId}`)
  await fetchByFrameId(parsed.frameNodeId)
}

async function listCachedData() {
  console.log('📁 Listing cached frame data...')
  
  const framesDir = path.join(process.cwd(), 'mcp-data', 'frames')
  
  if (!existsSync(framesDir)) {
    console.log('❌ No frames directory found')
    return
  }
  
  try {
    const files = await readdir(framesDir)
    const jsonFiles = files.filter(file => file.endsWith('.json'))
    
    if (jsonFiles.length === 0) {
      console.log('📭 No cached frame data found')
      return
    }
    
    console.log(`📋 Found ${jsonFiles.length} frame data file(s):`)
    
    for (const file of jsonFiles) {
      const filePath = path.join(framesDir, file)
      const content = await readFile(filePath, 'utf-8')
      const data = JSON.parse(content)
      
      console.log(`\n📄 ${file}:`)
      console.log(`   Frame ID: ${data.frameNodeId}`)
      console.log(`   Children: ${data.children?.length || 0}`)
      console.log(`   Valid components: ${data.children?.filter((c: any) => c.publishedCode)?.length || 0}`)
      console.log(`   Timestamp: ${data.timestamp}`)
      console.log(`   Published: ${data.published}`)
      
      if (data.error) {
        console.log(`   Error: ${data.error}`)
      }
    }
    
  } catch (error) {
    console.error('❌ Failed to list cached data:', error)
  }
}

function showHelp() {
  console.log('🔧 Frame CLI - Figma Frame Data Management\n')
  console.log('Commands:')
  
  for (const [cmd, desc] of Object.entries(commands)) {
    console.log(`  ${cmd.padEnd(12)} ${desc}`)
  }
  
  console.log('\nExamples:')
  console.log('  tsx scripts/frame-cli.ts fetch 22:1167')
  console.log('  tsx scripts/frame-cli.ts fetch-url "https://www.figma.com/design/rgqHmkJX2Uw9PhGoon1OIh/MCP-Code-Connect-DS?node-id=22-1167"')
  console.log('  tsx scripts/frame-cli.ts list')
  console.log('')
  console.log('Note: fetch and fetch-url commands must run in Cursor context for MCP access.')
}

// Main CLI logic
async function main() {
  const [command, ...args] = process.argv.slice(2)
  
  if (!command || command === 'help') {
    showHelp()
    return
  }
  
  switch (command) {
    case 'fetch':
      if (!args[0]) {
        console.log('❌ Frame ID is required')
        console.log('   Usage: tsx scripts/frame-cli.ts fetch <frameId>')
        process.exit(1)
      }
      await fetchByFrameId(args[0])
      break
      
    case 'fetch-url':
      if (!args[0]) {
        console.log('❌ Figma URL is required')
        console.log('   Usage: tsx scripts/frame-cli.ts fetch-url "<figmaUrl>"')
        process.exit(1)
      }
      await fetchByUrl(args[0])
      break
      
    case 'list':
      await listCachedData()
      break
      
    default:
      console.log(`❌ Unknown command: ${command}`)
      console.log('   Run "tsx scripts/frame-cli.ts help" for available commands')
      process.exit(1)
  }
}

// Run CLI
if (import.meta.main || process.argv[1]?.includes('frame-cli.ts')) {
  main().catch(error => {
    console.error('💥 Unhandled error:', error)
    process.exit(1)
  })
}
