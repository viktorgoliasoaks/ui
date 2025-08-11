/**
 * Type definitions for frame data and web app integration
 */

export interface FrameDataResult {
  frameNodeId: string
  frameCode: string | null
  children: ChildComponent[]
  imports: string[]
  timestamp: string
  source: 'figma-mcp'
  published: boolean
  error?: string
}

export interface ChildComponent {
  nodeId: string
  componentName: string
  snippet: string
  imports: string[]
  publishedCode: string
}

export interface FrameUrlParsed {
  fileKey: string
  frameNodeId: string
  originalUrl: string
}

export interface FrameWebAppResponse {
  success: boolean
  data?: FrameDataResult
  error?: string
  suggestion?: string
}
