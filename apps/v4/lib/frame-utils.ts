/**
 * Utility functions for frame data processing
 */

import { ChildComponent, FrameDataResult } from './frame-types'

// Reuse existing extractPublishedSnippet pattern from mcp-fetch.ts
function extractPublishedSnippet(fullCode: string | null): string {
  if (!fullCode) return ''
  
  // Remove CodeConnectSnippet wrappers but keep inner content
  return fullCode
    .replace(/<CodeConnectSnippet[^>]*>/g, '')
    .replace(/<\/CodeConnectSnippet>/g, '')
    .trim()
}

export function extractChildrenFromMapping(mapping: any): ChildComponent[] {
  if (!mapping || typeof mapping !== 'object') return []
  
  return Object.entries(mapping).map(([nodeId, data]: [string, any]) => ({
    nodeId,
    componentName: data.componentName || 'Unknown',
    snippet: data.snippet || '',
    imports: data.snippetImports || [],
    publishedCode: extractPublishedSnippet(data.snippet)
  })).filter(child => 
    // Only include children with valid Code Connect code
    hasValidCodeConnectCode(child.publishedCode)
  )
}

export function extractImportsFromCode(code: string | null): string[] {
  if (!code) return []
  
  // Extract imports using regex pattern
  const importRegex = /import\s+.*?from\s+['"][^'"]+['"]/g
  const imports = code.match(importRegex) || []
  return [...new Set(imports)] // Deduplicate
}

// Validation function: Only include if valid Code Connect React code exists
export function hasValidCodeConnectCode(code: string): boolean {
  if (!code || code.trim().length === 0) {
    return false
  }
  
  // Remove CodeConnectSnippet wrappers
  const cleanCode = removeCodeConnectWrappers(code)
  
  if (!cleanCode || cleanCode.trim().length === 0) {
    return false
  }
  
  // Check if it contains actual React code (not just comments or empty content)
  const hasReactContent = cleanCode.includes('<') || 
                         cleanCode.includes('return') || 
                         cleanCode.includes('JSX') ||
                         cleanCode.includes('React')
  
  return hasReactContent
}

function removeCodeConnectWrappers(code: string): string {
  if (!code) return ''
  
  return code
    .replace(/<CodeConnectSnippet[^>]*>/g, '')
    .replace(/<\/CodeConnectSnippet>/g, '')
    .trim()
}

export function processFrameData(frameData: any, frameNodeId: string): FrameDataResult {
  // Extract children from mapping
  const children = extractChildrenFromMapping(frameData.mapping)
  
  // Extract imports from frame code
  const imports = extractImportsFromCode(frameData.code)
  
  return {
    frameNodeId,
    frameCode: frameData.code,
    children,
    imports,
    timestamp: frameData.timestamp,
    source: 'figma-mcp',
    published: frameData.published,
    error: frameData.error
  }
}
