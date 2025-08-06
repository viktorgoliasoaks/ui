// Figma MCP Integration Service
export interface FigmaComponentData {
  nodeId: string
  fileKey: string
  componentCode: string
  reactCode: string
  htmlCode: string
  figmaCode: string
}

export class FigmaMCPService {
  private static instance: FigmaMCPService

  static getInstance(): FigmaMCPService {
    if (!FigmaMCPService.instance) {
      FigmaMCPService.instance = new FigmaMCPService()
    }
    return FigmaMCPService.instance
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

  // Fetch component data using Figma MCP
  async fetchComponentData(fileKey: string, nodeId: string): Promise<FigmaComponentData> {
    try {
      // In a real implementation, this would call the Figma MCP server
      // For now, we'll use mock data based on known node IDs
      const mockData = this.getMockComponentData(fileKey, nodeId)
      
      if (!mockData) {
        throw new Error(`Component not found for node ID: ${nodeId}`)
      }

      return mockData
    } catch (error) {
      console.error("Error fetching component data:", error)
      throw error
    }
  }

  // Get code from Figma Code Connect
  async getFigmaCode(fileKey: string, nodeId: string): Promise<string> {
    try {
      // This would call the Figma MCP get_code function
      // For now, return mock code
      return this.getMockFigmaCode(nodeId)
    } catch (error) {
      console.error("Error getting Figma code:", error)
      throw error
    }
  }

  // Get variable definitions from Figma
  async getVariableDefs(fileKey: string, nodeId: string): Promise<Record<string, any>> {
    try {
      // This would call the Figma MCP get_variable_defs function
      return this.getMockVariableDefs(nodeId)
    } catch (error) {
      console.error("Error getting variable definitions:", error)
      throw error
    }
  }

  // Mock data for testing
  private getMockComponentData(fileKey: string, nodeId: string): FigmaComponentData | null {
    const mockData: Record<string, FigmaComponentData> = {
      "28-1289": {
        nodeId,
        fileKey,
        componentCode: `import { Button } from "@/components/ui/button"

export function FigmaButton() {
  return (
    <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2">
      Button
    </Button>
  )
}`,
        reactCode: `import React from 'react';
import { Button } from "@/components/ui/button";

interface FigmaButtonProps {
  children?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  onClick?: () => void;
}

export const FigmaButton: React.FC<FigmaButtonProps> = ({
  children = "Button",
  variant = "default",
  size = "default",
  disabled = false,
  onClick
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2"
    >
      {children}
    </Button>
  );
};`,
        htmlCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Figma Button Component</title>
    <style>
        .figma-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            white-space: nowrap;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            font-weight: 500;
            transition: all 0.2s;
            background-color: #3b82f6;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            height: 2.25rem;
            cursor: pointer;
        }
        
        .figma-button:hover {
            background-color: #2563eb;
        }
        
        .figma-button:disabled {
            pointer-events: none;
            opacity: 0.5;
        }
    </style>
</head>
<body>
    <button class="figma-button">
        Button
    </button>
</body>
</html>`,
        figmaCode: `import { figma, jsx } from "@figma/code-connect/react"
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
)`
      },
      "12-272": {
        nodeId,
        fileKey,
        componentCode: `import { Input } from "@/components/ui/input"

export function FigmaInput() {
  return (
    <Input 
      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      placeholder="Enter text..."
    />
  )
}`,
        reactCode: `import React from 'react';

interface FigmaInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  type?: string;
}

export const FigmaInput: React.FC<FigmaInputProps> = ({
  placeholder = "Enter text...",
  value,
  onChange,
  disabled = false,
  type = "text"
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
    />
  );
};`,
        htmlCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Figma Input Component</title>
    <style>
        .figma-input {
            display: flex;
            height: 2.25rem;
            width: 100%;
            border-radius: 0.375rem;
            border: 1px solid #d1d5db;
            background-color: transparent;
            padding: 0.25rem 0.75rem;
            font-size: 0.875rem;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            transition: all 0.2s;
        }
        
        .figma-input:focus {
            outline: none;
            ring: 1px solid #3b82f6;
        }
        
        .figma-input:disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }
        
        .figma-input::placeholder {
            color: #6b7280;
        }
    </style>
</head>
<body>
    <input 
        type="text" 
        class="figma-input" 
        placeholder="Enter text..."
    />
</body>
</html>`,
        figmaCode: `import { figma, html } from "@figma/code-connect/html"

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
    }

    return mockData[nodeId] || null
  }

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