/**
 * Frame data management utilities
 */

import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { FrameDataResult, FrameUrlParsed } from './frame-types'
import { MCPDataManager } from './mcp-utils'

export class FrameDataManager {
  private mcpDataManager: MCPDataManager
  private framesDir: string

  constructor(baseDir: string = process.cwd()) {
    this.mcpDataManager = new MCPDataManager(baseDir)
    this.framesDir = path.join(baseDir, 'mcp-data', 'frames')
  }

  async ensureDirectories() {
    await mkdir(this.framesDir, { recursive: true })
  }

  /**
   * Parse Figma URL to extract fileKey and frameNodeId
   * Reuses existing parseFigmaUrl logic
   */
  parseFigmaUrl(url: string): FrameUrlParsed | null {
    const parsed = this.mcpDataManager.parseFigmaUrl(url)
    if (!parsed) return null
    
    return {
      fileKey: parsed.fileKey,
      frameNodeId: parsed.nodeId,
      originalUrl: parsed.originalUrl
    }
  }

  /**
   * Get file path for frame data
   */
  getFrameDataPath(): string {
    return path.join(this.framesDir, 'current-frame.json')
  }

  /**
   * Check if frame data exists
   */
  frameDataExists(): boolean {
    return existsSync(this.getFrameDataPath())
  }

  /**
   * Read frame data from file
   */
  async readFrameData(): Promise<FrameDataResult | null> {
    try {
      const filePath = this.getFrameDataPath()
      if (!existsSync(filePath)) {
        return null
      }
      
      const content = await readFile(filePath, 'utf-8')
      return JSON.parse(content) as FrameDataResult
    } catch (error) {
      console.error('Failed to read frame data:', error)
      return null
    }
  }

  /**
   * Save frame data to file
   */
  async saveFrameData(data: FrameDataResult): Promise<void> {
    await this.ensureDirectories()
    const filePath = this.getFrameDataPath()
    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
    console.log(`💾 Frame data saved to: ${filePath}`)
  }

  /**
   * Get current frame data (always from current-frame.json)
   */
  async getCurrentFrame(): Promise<FrameDataResult | null> {
    return this.readFrameData()
  }
}
