#!/usr/bin/env tsx

/**
 * MCP CLI - Convenient command-line interface for MCP operations
 * 
 * Usage examples:
 *   tsx scripts/mcp-cli.ts fetch 28:1289
 *   tsx scripts/mcp-cli.ts fetch-url "https://www.figma.com/design/..."
 *   tsx scripts/mcp-cli.ts list
 *   tsx scripts/mcp-cli.ts watch
 */

import { mcpDataManager } from '../lib/mcp-utils.js'
import { fetchAndSave } from './mcp-fetch.js'
import { readdir, readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const commands = {
  fetch: 'Fetch MCP data for a specific node ID',
  'fetch-url': 'Fetch MCP data from a Figma URL',
  list: 'List all cached MCP data',
  watch: 'Start watching for MCP requests (must run in Cursor)',
  help: 'Show this help message'
}

async function fetchByNodeId(nodeId: string) {
  console.log(`🔗 Fetching MCP data for node: ${nodeId}`)
  
  const result = await fetchAndSave(nodeId)
  
  if (result.success) {
    console.log(`✅ Success! Data saved to: ${result.filePath}`)
    console.log(`📊 Published: ${result.published}`)
  } else {
    console.log(`❌ Failed: ${result.error}`)
    process.exit(1)
  }
}

async function fetchByUrl(figmaUrl: string) {
  console.log(`🔗 Parsing Figma URL: ${figmaUrl}`)
  
  const parsed = mcpDataManager.parseFigmaUrl(figmaUrl)
  if (!parsed) {
    console.log('❌ Invalid Figma URL format')
    console.log('   Expected format: https://www.figma.com/design/.../...?node-id=...')
    process.exit(1)
  }
  
  console.log(`📍 Extracted node ID: ${parsed.nodeId}`)
  await fetchByNodeId(parsed.nodeId)
}

async function listCachedData() {
  const componentsDir = path.join(process.cwd(), 'mcp-data', 'components')
  
  if (!existsSync(componentsDir)) {
    console.log('📂 No MCP data directory found')
    console.log('   Run a fetch command first to create it.')
    return
  }
  
  try {
    const files = await readdir(componentsDir)
    const jsonFiles = files.filter(f => f.endsWith('.json'))
    
    if (jsonFiles.length === 0) {
      console.log('📄 No MCP data files found')
      return
    }
    
    console.log(`📊 Found ${jsonFiles.length} MCP data file(s):\n`)
    
    for (const file of jsonFiles) {
      const filePath = path.join(componentsDir, file)
      try {
        const content = await readFile(filePath, 'utf-8')
        const data = JSON.parse(content)
        
        const nodeId = file.replace('.json', '').replace('-', ':')
        const published = data.published ? '✅ Published' : '❌ Not Published'
        const age = formatAge(data.timestamp)
        
        console.log(`  🔹 ${nodeId}`)
        console.log(`     Status: ${published}`)
        console.log(`     Updated: ${age}`)
        console.log(`     File: ${file}`)
        console.log('')
        
      } catch (error) {
        console.log(`  ❌ ${file} - Error reading file`)
      }
    }
    
  } catch (error) {
    console.log('❌ Failed to list MCP data:', error)
  }
}

function formatAge(timestamp: string): string {
  const now = new Date()
  const then = new Date(timestamp)
  const diffMs = now.getTime() - then.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  
  if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m ago`
  } else if (diffMinutes > 0) {
    return `${diffMinutes}m ago`
  } else {
    return 'Just now'
  }
}

function showHelp() {
  console.log('🔧 MCP CLI - Figma MCP Data Management\n')
  console.log('Commands:')
  
  for (const [cmd, desc] of Object.entries(commands)) {
    console.log(`  ${cmd.padEnd(12)} ${desc}`)
  }
  
  console.log('\nExamples:')
  console.log('  tsx scripts/mcp-cli.ts fetch 28:1289')
  console.log('  tsx scripts/mcp-cli.ts fetch-url "https://www.figma.com/design/rgqHmkJX2Uw9PhGoon1OIh/MCP-Code-Connect-DS?node-id=28-1289"')
  console.log('  tsx scripts/mcp-cli.ts list')
  console.log('')
  console.log('Note: fetch and fetch-url commands must run in Cursor context for MCP access.')
}

async function startWatcher() {
  const { default: watcher } = await import('./mcp-watcher.js')
  // The watcher script handles its own execution
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
        console.log('❌ Node ID is required')
        console.log('   Usage: tsx scripts/mcp-cli.ts fetch <nodeId>')
        process.exit(1)
      }
      await fetchByNodeId(args[0])
      break
      
    case 'fetch-url':
      if (!args[0]) {
        console.log('❌ Figma URL is required')
        console.log('   Usage: tsx scripts/mcp-cli.ts fetch-url "<figmaUrl>"')
        process.exit(1)
      }
      await fetchByUrl(args[0])
      break
      
    case 'list':
      await listCachedData()
      break
      
    case 'watch':
      console.log('🔄 Starting MCP request watcher...')
      await startWatcher()
      break
      
    default:
      console.log(`❌ Unknown command: ${command}`)
      console.log('   Run "tsx scripts/mcp-cli.ts help" for available commands')
      process.exit(1)
  }
}

main().catch(error => {
  console.error('💥 CLI error:', error)
  process.exit(1)
})