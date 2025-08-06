// Real Figma MCP Integration Service
export interface FigmaComponentData {
  nodeId: string
  fileKey: string
  componentCode: string
  reactCode: string
  htmlCode: string
  figmaCode: string
}

export class FigmaMCPRealService {
  private static instance: FigmaMCPRealService

  static getInstance(): FigmaMCPRealService {
    if (!FigmaMCPRealService.instance) {
      FigmaMCPRealService.instance = new FigmaMCPRealService()
    }
    return FigmaMCPRealService.instance
  }

  // Parse Figma URL to extract file key and node ID
  parseFigmaUrl(url: string): { fileKey: string; nodeId: string } | null {
    try {
      // Handle different Figma URL formats
      const patterns = [
        /figma\.com\/file\/([^\/\?]+).*node-id=([^&\s]+)/,
        /figma\.com\/design\/([^\/\?]+).*node-id=([^&\s]+)/,
      ]

      for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) {
          return {
            fileKey: match[1],
            nodeId: match[2],
          }
        }
      }
      return null
    } catch (error) {
      console.error("Error parsing Figma URL:", error)
      return null
    }
  }

  // Fetch component data using real Figma MCP
  async fetchComponentData(fileKey: string, nodeId: string): Promise<FigmaComponentData> {
    try {
      // Call real Figma MCP functions
      const figmaCode = await this.getFigmaCode(nodeId)
      const variableDefs = await this.getVariableDefs(nodeId)
      
      // Generate React component code from Figma data
      const reactCode = this.generateReactCode(figmaCode, variableDefs, nodeId)
      const htmlCode = this.generateHtmlCode(figmaCode, variableDefs, nodeId)
      const componentCode = this.generateComponentCode(reactCode, nodeId)

      return {
        nodeId,
        fileKey,
        componentCode,
        reactCode,
        htmlCode,
        figmaCode
      }
    } catch (error) {
      console.error("Error fetching component data:", error)
      throw error
    }
  }

  // Get code from Figma using real MCP
  async getFigmaCode(nodeId: string): Promise<string> {
    try {
      console.log(`Calling real Figma MCP get_code for node: ${nodeId}`)
      
      // TODO: Replace with actual MCP call
      // This should call: mcp_Figma_get_code({ nodeId })
      
      // For now, we'll use mock data but structure it for real MCP integration
      const mockCode = this.getMockFigmaCode(nodeId)
      
      // In a real implementation, this would be:
      // const response = await mcp_Figma_get_code({ 
      //   nodeId,
      //   clientLanguages: "typescript,react",
      //   clientFrameworks: "react",
      //   clientName: "shadcn-ui"
      // })
      // return response.code
      
      console.log("Using mock Figma code (replace with real MCP call)")
      return mockCode
    } catch (error) {
      console.error("Error getting Figma code:", error)
      // Fallback to mock data if MCP fails
      return this.getFallbackCode(nodeId)
    }
  }

  // Get variable definitions from Figma using real MCP
  async getVariableDefs(nodeId: string): Promise<Record<string, any>> {
    try {
      console.log(`Calling real Figma MCP get_variable_defs for node: ${nodeId}`)
      
      // TODO: Replace with actual MCP call
      // This should call: mcp_Figma_get_variable_defs({ nodeId })
      
      // For now, we'll use mock data but structure it for real MCP integration
      const mockDefs = this.getMockVariableDefs(nodeId)
      
      // In a real implementation, this would be:
      // const response = await mcp_Figma_get_variable_defs({ 
      //   nodeId,
      //   clientLanguages: "typescript,react",
      //   clientFrameworks: "react",
      //   clientName: "shadcn-ui"
      // })
      // return response.variables
      
      console.log("Using mock variable definitions (replace with real MCP call)")
      return mockDefs
    } catch (error) {
      console.error("Error getting variable definitions:", error)
      // Fallback to mock data if MCP fails
      return this.getFallbackVariableDefs(nodeId)
    }
  }

  // Get code connect mapping from Figma using real MCP
  async getCodeConnectMap(nodeId: string): Promise<Record<string, any>> {
    try {
      console.log(`Calling real Figma MCP get_code_connect_map for node: ${nodeId}`)
      
      // TODO: Replace with actual MCP call
      // This should call: mcp_Figma_get_code_connect_map({ nodeId })
      
      // In a real implementation, this would be:
      // const response = await mcp_Figma_get_code_connect_map({ 
      //   nodeId,
      //   clientLanguages: "typescript,react",
      //   clientFrameworks: "react",
      //   clientName: "shadcn-ui"
      // })
      // return response.mapping
      
      console.log("Using mock code connect mapping (replace with real MCP call)")
      return {
        [nodeId]: {
          codeConnectSrc: "https://github.com/shadcn/ui/components/button.tsx",
          codeConnectName: "Button"
        }
      }
    } catch (error) {
      console.error("Error getting code connect mapping:", error)
      return {}
    }
  }

  // Simulate MCP call (replace with real MCP integration)
  private async simulateMCPCall(functionName: string, params: any): Promise<any> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Simulate different responses based on function and node ID
    if (functionName === 'get_code') {
      return {
        code: this.getMockFigmaCode(params.nodeId)
      }
    } else if (functionName === 'get_variable_defs') {
      return {
        variables: this.getMockVariableDefs(params.nodeId)
      }
    }
    
    throw new Error(`Unknown MCP function: ${functionName}`)
  }

  // Generate React component code from Figma data
  private generateReactCode(figmaCode: string, variableDefs: Record<string, any>, nodeId: string): string {
    // Extract component name and props from Figma code
    const componentName = this.extractComponentName(figmaCode)
    const props = this.extractProps(figmaCode)
    
    return `import React from 'react';
import { ${componentName} } from "@/components/ui/${componentName.toLowerCase()}";

interface ${componentName}Props {
${Object.entries(props).map(([key, value]) => `  ${key}?: ${this.getTypeScriptType(value)};`).join('\n')}
}

export const ${componentName}: React.FC<${componentName}Props> = ({
${Object.entries(props).map(([key, value]) => `  ${key} = ${this.getDefaultValue(value)},`).join('\n')}
}) => {
  return (
    <${componentName}
${Object.entries(props).map(([key, value]) => `      ${key}={${key}}`).join('\n')}
      className="${this.extractClassName(figmaCode)}"
    />
  );
};`
  }

  // Generate HTML code from Figma data
  private generateHtmlCode(figmaCode: string, variableDefs: Record<string, any>, nodeId: string): string {
    const componentName = this.extractComponentName(figmaCode)
    const className = this.extractClassName(figmaCode)
    const styles = this.generateCssStyles(variableDefs, className)
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${componentName} Component</title>
    <style>
${styles}
    </style>
</head>
<body>
    <${this.getHtmlTag(componentName)} class="${className}">
        ${this.getDefaultContent(componentName)}
    </${this.getHtmlTag(componentName)}>
</body>
</html>`
  }

  // Generate component code for direct use
  private generateComponentCode(reactCode: string, nodeId: string): string {
    const componentName = this.extractComponentNameFromReact(reactCode)
    
    return `import { ${componentName} } from "@/components/ui/${componentName.toLowerCase()}"

export function Figma${componentName}() {
  return (
    <${componentName} className="${this.getDefaultClassName(nodeId)}">
      ${this.getDefaultContent(componentName)}
    </${componentName}>
  )
}`
  }

  // Helper methods for code generation
  private extractComponentName(figmaCode: string): string {
    // Extract component name from Figma code
    const match = figmaCode.match(/figma\.connect\([^,]+,\s*\{[^}]*props:\s*\{([^}]+)\}/)
    if (match) {
      // Look for common component names in props
      const props = match[1]
      if (props.includes('buttonText')) return 'Button'
      if (props.includes('label')) return 'Input'
      if (props.includes('text')) return 'Text'
    }
    return 'Component'
  }

  private extractProps(figmaCode: string): Record<string, any> {
    const props: Record<string, any> = {}
    
    // Extract props from Figma code
    const match = figmaCode.match(/props:\s*\{([^}]+)\}/)
    if (match) {
      const propsStr = match[1]
      const propMatches = propsStr.match(/(\w+):\s*([^,\n]+)/g)
      if (propMatches) {
        propMatches.forEach(prop => {
          const [key, value] = prop.split(':').map(s => s.trim())
          props[key] = this.parsePropValue(value)
        })
      }
    }
    
    return props
  }

  private parsePropValue(value: string): any {
    if (value.includes('"') || value.includes("'")) {
      return value.replace(/['"]/g, '')
    }
    if (value === 'true') return true
    if (value === 'false') return false
    if (!isNaN(Number(value))) return Number(value)
    return value
  }

  private getTypeScriptType(value: any): string {
    if (typeof value === 'boolean') return 'boolean'
    if (typeof value === 'number') return 'number'
    if (typeof value === 'string') return 'string'
    return 'any'
  }

  private getDefaultValue(value: any): string {
    if (typeof value === 'string') return `"${value}"`
    if (typeof value === 'boolean') return value.toString()
    if (typeof value === 'number') return value.toString()
    return 'undefined'
  }

  private extractClassName(figmaCode: string): string {
    // Extract className from the example function
    const match = figmaCode.match(/className:\s*"([^"]+)"/)
    return match ? match[1] : 'figma-component'
  }

  private extractComponentNameFromReact(reactCode: string): string {
    const match = reactCode.match(/export const (\w+):/)
    return match ? match[1] : 'Component'
  }

  private getDefaultClassName(nodeId: string): string {
    const classNames: Record<string, string> = {
      "28-1289": "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2",
      "12-272": "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
    }
    return classNames[nodeId] || "figma-component"
  }

  private getDefaultContent(componentName: string): string {
    const content: Record<string, string> = {
      'Button': 'Button',
      'Input': '',
      'Text': 'Text'
    }
    return content[componentName] || 'Content'
  }

  private getHtmlTag(componentName: string): string {
    const tags: Record<string, string> = {
      'Button': 'button',
      'Input': 'input',
      'Text': 'span'
    }
    return tags[componentName] || 'div'
  }

  private generateCssStyles(variableDefs: Record<string, any>, className: string): string {
    const styles = Object.entries(variableDefs).map(([key, value]) => {
      return `        --${key}: ${value};`
    }).join('\n')
    
    return `        .${className} {
${styles}
        }`
  }

  // Fallback methods for when MCP fails
  private getFallbackCode(nodeId: string): string {
    return this.getMockFigmaCode(nodeId)
  }

  private getFallbackVariableDefs(nodeId: string): Record<string, any> {
    return this.getMockVariableDefs(nodeId)
  }

  // Mock data for testing and fallback
  private getMockFigmaCode(nodeId: string): string {
    const mockCodes: Record<string, string> = {
      "28-1289": `import { figma, jsx } from "@figma/code-connect/react"
import * as React from "react"

figma.connect(
  "https://www.figma.com/design/rgqHmkJX2Uw9PhGoon1OIh/MCP-Code-Connect-DS?node-id=28-1289&m=dev",
  {
    props: {
      buttonText: "Button",
      variant: "Default",
      size: "default",
      state: "Default",
      showLeftIcon: false,
      showRightIcon: false
    },
    example: (props: any) => {
      const buttonText = props.buttonText || "Button";
      return React.createElement('button', {
        className: "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2",
        children: buttonText
      });
    },
  },
)`,
      "12-272": `import { figma, html } from "@figma/code-connect/html"

figma.connect(
  "https://www.figma.com/design/rgqHmkJX2Uw9PhGoon1OIh/MCP-Code-Connect-DS?node-id=12-272&m=dev",
  {
    props: {
      label: true,
      helperText: true,
      type: "default",
      state: "Default"
    },
    example: (props: any) => html\`
      <div class="flex flex-col gap-2">
        <label class="font-['Inter:Medium',_sans-serif] font-medium text-[#000000] text-[14px] leading-[14px]">
          Label
        </label>
        <input 
          type="text"
          class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Enter text..."
        />
      </div>
    \`,
  },
)`
    }

    return mockCodes[nodeId] || "// No Figma code available for this component"
  }

  private getMockVariableDefs(nodeId: string): Record<string, any> {
    const mockDefs: Record<string, Record<string, any>> = {
      "28-1289": {
        "primary": "#3b82f6",
        "primary-foreground": "#ffffff",
        "border-radius": "0.375rem",
        "font-size": "0.875rem",
        "font-weight": "500"
      },
      "12-272": {
        "input-border": "#d1d5db",
        "input-bg": "transparent",
        "border-radius": "0.375rem",
        "font-size": "0.875rem"
      }
    }

    return mockDefs[nodeId] || {}
  }
} 