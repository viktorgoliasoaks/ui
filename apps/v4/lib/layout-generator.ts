/**
 * Layout Generator - Creates React components from published Code Connect code
 */

import { FrameDataResult } from './frame-types'

export function generateLayoutComponent(frameData: FrameDataResult): string {
  const { children, imports } = frameData
  
  // Filter only components with valid Code Connect React code
  const validChildren = children.filter(child => 
    child.publishedCode && child.publishedCode.trim().length > 0
  )
  
  if (validChildren.length === 0) {
    return `
export default function LayoutTest() {
  return (
    <div className="frame-layout">
      <p>No components with Code Connect React code available in this frame.</p>
    </div>
  )
}
`
  }
  
  // Deduplicate imports
  const uniqueImports = [...new Set(imports)]
  
  // Generate component using ONLY valid Code Connect snippets
  const childComponents = validChildren.map((child, index) => `
    {/* ${child.componentName} - ${child.nodeId} */}
    <div key="${child.nodeId}" className="component-${child.componentName.toLowerCase()} mb-4">
      ${child.publishedCode}
    </div>
  `).join('\n')
  
  return `
${uniqueImports.join('\n')}

export default function LayoutTest() {
  return (
    <div className="frame-layout bg-white p-8 rounded-lg border">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Frame Layout Test</h1>
        <p className="text-gray-600">Rendering {validChildren.length} components with Code Connect code</p>
      </div>
      
      <div className="space-y-6">
        ${childComponents}
      </div>
    </div>
  )
}
`
}

/**
 * Generate a simple component that renders the published code directly
 */
export function generateSimpleLayout(frameData: FrameDataResult): string {
  const { children, imports } = frameData
  
  // Filter only components with valid Code Connect React code
  const validChildren = children.filter(child => 
    child.publishedCode && child.publishedCode.trim().length > 0
  )
  
  if (validChildren.length === 0) {
    return `
export default function LayoutTest() {
  return (
    <div className="p-8">
      <p>No components with Code Connect React code available.</p>
    </div>
  )
}
`
  }
  
  // Deduplicate imports
  const uniqueImports = [...new Set(imports)]
  
  // Generate simple component renders
  const componentRenders = validChildren.map((child, index) => `
        {/* ${child.componentName} */}
        <div key="${child.nodeId}" className="mb-4 p-4 border rounded">
          <h3 className="text-sm font-medium text-gray-700 mb-2">${child.componentName}</h3>
          ${child.publishedCode}
        </div>
  `).join('\n')
  
  return `
${uniqueImports.join('\n')}

export default function LayoutTest() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Frame Layout Test</h1>
        <div className="space-y-4">
          ${componentRenders}
        </div>
      </div>
    </div>
  )
}
`
}
