/**
 * Type definitions for MCP data and web app integration
 */

export interface MCPDataResult {
  nodeId: string
  mapping: any
  code: string | null
  variants?: any[] // Array of component variants
  publishedCode?: string // Generated component code (alias for code)
  timestamp: string
  source: 'figma-mcp'
  published: boolean
  error?: string
}

export interface ComponentSourceData {
  nodeId: string
  figmaData: MCPDataResult | null
  reactCode: string | null
  reactPath: string | null
  codeConnectFile: string | null
  published: boolean
  timestamp: string
  error?: string
}

export interface MCPRequest {
  nodeId: string
  requestedAt: string
  status: 'pending' | 'completed' | 'failed'
  requestId: string
}

export interface FigmaUrlParsed {
  fileKey: string
  nodeId: string
  originalUrl: string
}

export interface WebAppResponse {
  success: boolean
  data?: ComponentSourceData
  error?: string
  suggestion?: string
}