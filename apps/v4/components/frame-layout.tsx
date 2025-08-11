'use client'

import { useEffect, useState } from 'react'
import { FrameDataResult } from '@/lib/frame-types'
import { generateSimpleLayout } from '@/lib/layout-generator'

export default function FrameLayout() {
  const [frameData, setFrameData] = useState<FrameDataResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [generatedComponent, setGeneratedComponent] = useState<string>('')

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
        
        // Generate the React component from published code
        const generatedCode = generateSimpleLayout(result.data)
        setGeneratedComponent(generatedCode)
        console.log('✅ Generated React component from published code')
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading frame layout...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-red-800 font-semibold mb-2">Error Loading Frame Data</h2>
        <p className="text-red-700 mb-4">{error}</p>
        <div className="bg-red-100 p-4 rounded text-sm text-red-800">
          <p className="font-medium mb-2">To fix this:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Run frame fetch command in Cursor: <code className="bg-red-200 px-1 rounded">npm run frame:fetch 22:1167</code></li>
            <li>Refresh this page</li>
          </ol>
        </div>
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

  // Render the generated component using dynamic imports
  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Frame Layout Test</h1>
        <p className="text-gray-600 mb-4">
          Rendering {validComponents.length} of {frameData.children.length} components with Code Connect code
        </p>
        <div className="text-sm text-gray-500">
          <p>Frame: {frameData.frameNodeId}</p>
          <p>Timestamp: {new Date(frameData.timestamp).toLocaleString()}</p>
        </div>
      </div>

      {/* Show the generated code */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated React Component:</h3>
        <pre className="text-sm text-gray-800 overflow-x-auto bg-white p-4 rounded border">
          <code>{generatedComponent}</code>
        </pre>
      </div>

      {/* Render the actual components */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendered Components:</h3>
        <div className="space-y-6">
          {validComponents.map((child, index) => (
            <div key={child.nodeId} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  {child.componentName} ({child.nodeId})
                </h4>
                <span className="text-sm text-gray-500">Component {index + 1}</span>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Code Connect Snippet:</h5>
                <pre className="text-sm text-gray-800 overflow-x-auto">
                  <code>{child.snippet}</code>
                </pre>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <h5 className="text-sm font-medium text-blue-700 mb-2">Rendered Component:</h5>
                <div className="component-preview">
                  {/* This is where we would render the actual component */}
                  {/* For now, we'll show the code as a placeholder */}
                  <div className="text-sm text-blue-600 italic">
                    Component would render here: {child.publishedCode.substring(0, 50)}...
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
