'use client'

import { useEffect, useState } from 'react'
import { FrameDataResult } from '@/lib/frame-types'
import { generateSimpleLayout } from '@/lib/layout-generator'

// Import the actual components that we know exist
import { Button } from '@/registry/new-york-v4/ui/button'
import { Checkbox } from '@/registry/new-york-v4/ui/checkbox'

export default function DynamicLayout() {
  const [frameData, setFrameData] = useState<FrameDataResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    loadFrameData()
  }, [])

  const loadFrameData = async () => {
    try {
      console.log('🔗 Loading frame data from API...')
      
      const response = await fetch('/api/frame-data')
      const result = await response.json()
      
      if (result.success) {
        setFrameData(result.data)
        console.log(`✅ Frame data loaded: ${result.data.children.length} children`)
      } else {
        setError(result.error)
        console.log('❌ Failed to load frame data:', result.error)
      }
    } catch (err) {
      setError('Failed to load frame data')
      console.error('❌ Error loading frame data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Render component based on its type
  const renderComponent = (child: any) => {
    const { componentName, publishedCode } = child

    switch (componentName.toLowerCase()) {
      case 'button':
        // Extract button props from the published code
        const buttonMatch = publishedCode.match(/<Button\s+([^>]*)>/)
        if (buttonMatch) {
          const buttonProps = buttonMatch[1]
          const variantMatch = buttonProps.match(/variant="([^"]*)"/)
          const variant = variantMatch ? variantMatch[1] : 'default'
          
          // Extract text content
          const textMatch = publishedCode.match(/>([^<]+)</)
          const text = textMatch ? textMatch[1].trim() : 'Button'
          
          return <Button variant={variant as any}>{text}</Button>
        }
        return <Button>Button</Button>

      case 'checkbox':
        // For the checkbox, we need to render the complex component
        // Since it's a function, we'll create a wrapper
        return (
          <div className="flex items-start space-x-2">
            <Checkbox checked id="checkbox-with-text"/>
            <div className="grid gap-1.5 leading-none">
              <label htmlFor="checkbox-with-text" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                adjusted text
              </label>
              <p className="text-sm text-muted-foreground">
                text different from component level placeholder
              </p>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-sm text-gray-500 italic">
            Unknown component: {componentName}
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dynamic layout...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-red-800 font-semibold mb-2">Error Loading Frame Data</h2>
        <p className="text-red-700 mb-4">{error}</p>
      </div>
    )
  }

  if (!frameData) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h2 className="text-yellow-800 font-semibold mb-2">No Frame Data Available</h2>
        <p className="text-yellow-700">No frame data found. Please fetch frame data first.</p>
      </div>
    )
  }

  // Filter only components with valid Code Connect React code
  const validComponents = frameData.children.filter(child => 
    child.publishedCode && child.publishedCode.trim().length > 0
  )

  if (validComponents.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-blue-800 font-semibold mb-2">Frame Layout Test</h2>
        <p className="text-blue-700 mb-2">
          No components with Code Connect React code found in this frame.
        </p>
        <p className="text-sm text-blue-600">
          Frame: {frameData.frameNodeId} | Total children: {frameData.children.length}
        </p>
      </div>
    )
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Dynamic Frame Layout Test</h1>
        <p className="text-gray-600 mb-8">
          Rendering {validComponents.length} of {frameData.children.length} components with Code Connect code
        </p>
        
        <div className="space-y-8">
          {validComponents.map((child, index) => (
            <div key={child.nodeId} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {child.componentName} ({child.nodeId})
                </h3>
                <span className="text-sm text-gray-500">Component {index + 1}</span>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Code Connect Snippet:</h4>
                <pre className="text-sm text-gray-800 overflow-x-auto">
                  <code>{child.snippet}</code>
                </pre>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <h4 className="text-sm font-medium text-blue-700 mb-2">Rendered Component:</h4>
                <div className="component-preview">
                  {renderComponent(child)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
