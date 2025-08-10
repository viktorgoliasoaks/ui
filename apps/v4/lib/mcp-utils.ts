/**
 * Utility functions for MCP data handling
 */

import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { MCPDataResult, ComponentSourceData, FigmaUrlParsed } from './mcp-types'

export class MCPDataManager {
  private mcpDataDir: string
  private componentsDir: string
  private requestsDir: string

  constructor(baseDir: string = process.cwd()) {
    this.mcpDataDir = path.join(baseDir, 'mcp-data')
    this.componentsDir = path.join(this.mcpDataDir, 'components')
    this.requestsDir = path.join(this.mcpDataDir, 'requests')
  }

  async ensureDirectories() {
    await mkdir(this.componentsDir, { recursive: true })
    await mkdir(this.requestsDir, { recursive: true })
  }

  /**
   * Parse Figma URL to extract fileKey and nodeId
   */
  parseFigmaUrl(url: string): FigmaUrlParsed | null {
    const regex = /figma\.com\/design\/([a-zA-Z0-9]+)\/.*node-id=([0-9-:]+)/
    const match = url.match(regex)
    
    if (match) {
      return {
        fileKey: match[1],
        nodeId: match[2].replace(/-/g, ':'),
        originalUrl: url
      }
    }
    return null
  }

  /**
   * Get file path for MCP data
   */
  getMCPDataPath(nodeId: string): string {
    return path.join(this.componentsDir, `${nodeId.replace(':', '-')}.json`)
  }

  /**
   * Check if MCP data exists for a node
   */
  mcpDataExists(nodeId: string): boolean {
    return existsSync(this.getMCPDataPath(nodeId))
  }

  /**
   * Read MCP data from file
   */
  async readMCPData(nodeId: string): Promise<MCPDataResult | null> {
    try {
      const filePath = this.getMCPDataPath(nodeId)
      if (!existsSync(filePath)) {
        return null
      }
      
      const content = await readFile(filePath, 'utf-8')
      return JSON.parse(content) as MCPDataResult
    } catch (error) {
      console.error(`Failed to read MCP data for ${nodeId}:`, error)
      return null
    }
  }

  /**
   * Read React component source code
   */
  async readReactComponent(componentName: string): Promise<{ code: string; path: string } | null> {
    const possiblePaths = [
      `registry/new-york-v4/ui/${componentName}.tsx`,
      `registry/new-york-v4/ui/${componentName}.ts`,
      `components/ui/${componentName}.tsx`,
      `components/ui/${componentName}.ts`
    ]

    for (const relativePath of possiblePaths) {
      const fullPath = path.join(process.cwd(), relativePath)
      if (existsSync(fullPath)) {
        try {
          const code = await readFile(fullPath, 'utf-8')
          return { code, path: relativePath }
        } catch (error) {
          console.error(`Failed to read ${fullPath}:`, error)
        }
      }
    }

    return null
  }

  /**
   * Find Code Connect file for a component
   */
  async findCodeConnectFile(nodeId: string): Promise<{ code: string; path: string } | null> {
    const possibleFiles = [
      'button.figma.tsx',
      'input.figma.ts',
      // Add more as needed
    ]
    
    // Check multiple possible locations
    const possibleBasePaths = [
      process.cwd(), // Current directory (apps/v4)
      path.join(process.cwd(), '../..'), // Root directory
      path.join(process.cwd(), '../../'), // Root directory alternative
    ]

    for (const basePath of possibleBasePaths) {
      for (const fileName of possibleFiles) {
        const filePath = path.join(basePath, fileName)
        if (existsSync(filePath)) {
          try {
            const content = await readFile(filePath, 'utf-8')
            // Check if this file contains the nodeId
            if (content.includes(nodeId) || content.includes(nodeId.replace(':', '-'))) {
              return { code: content, path: path.relative(process.cwd(), filePath) }
            }
          } catch (error) {
            console.error(`Failed to read ${filePath}:`, error)
          }
        }
      }
    }

    return null
  }

  /**
   * Get comprehensive component data combining MCP and local sources
   */
  async getComponentData(nodeId: string): Promise<ComponentSourceData> {
    const mcpData = await this.readMCPData(nodeId)
    
    // Try to infer component name from nodeId or MCP data
    let componentName = 'button' // Default fallback
    if (mcpData?.mapping?.component) {
      componentName = mcpData.mapping.component.toLowerCase()
    }

    const reactComponent = await this.readReactComponent(componentName)
    const codeConnectFile = await this.findCodeConnectFile(nodeId)

    return {
      nodeId,
      figmaData: mcpData,
      reactCode: reactComponent?.code || null,
      reactPath: reactComponent?.path || null,
      codeConnectFile: codeConnectFile?.code || null,
      published: mcpData?.published || false,
      timestamp: mcpData?.timestamp || new Date().toISOString(),
      error: mcpData?.error
    }
  }

  /**
   * Create a request for MCP data fetch
   */
  async createMCPRequest(nodeId: string): Promise<string> {
    await this.ensureDirectories()
    
    const requestId = `req_${Date.now()}_${nodeId.replace(':', '-')}`
    const request = {
      nodeId,
      requestedAt: new Date().toISOString(),
      status: 'pending' as const,
      requestId
    }

    const requestPath = path.join(this.requestsDir, `${requestId}.json`)
    await writeFile(requestPath, JSON.stringify(request, null, 2))

    return requestId
  }

  /**
   * Check data freshness (data older than 1 hour is considered stale)
   */
  isDataFresh(timestamp: string, maxAgeHours: number = 1): boolean {
    const dataTime = new Date(timestamp).getTime()
    const now = new Date().getTime()
    const ageHours = (now - dataTime) / (1000 * 60 * 60)
    
    return ageHours < maxAgeHours
  }

  /**
   * Get current component data (always reads from current-component.json)
   */
  async getCurrentComponent(): Promise<MCPDataResult | null> {
    try {
      const filePath = path.join(this.componentsDir, 'current-component.json')
      if (!existsSync(filePath)) {
        return null
      }
      
      const content = await readFile(filePath, 'utf-8')
      return JSON.parse(content) as MCPDataResult
    } catch (error) {
      console.error('Failed to read current component:', error)
      return null
    }
  }
}

export const mcpDataManager = new MCPDataManager()