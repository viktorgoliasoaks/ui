import React from 'react'
import { Alert, AlertTitle, AlertDescription } from '@/registry/new-york-v4/ui/alert'
import { CheckCircle, AlertCircle } from 'lucide-react'

export default function TestAlert() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Alert Component Test</h1>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Default Alert with Icon</h2>
        <Alert variant="default">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Default Alert Title</AlertTitle>
          <AlertDescription>This is a default alert with title and description.</AlertDescription>
        </Alert>
        
        <h2 className="text-lg font-semibold">Destructive Alert with Icon</h2>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Destructive Alert Title</AlertTitle>
          <AlertDescription>This is a destructive alert with title and description.</AlertDescription>
        </Alert>
        
        <h2 className="text-lg font-semibold">Alert without Icon</h2>
        <Alert variant="default">
          <AlertTitle>Alert Title (No Icon)</AlertTitle>
          <AlertDescription>This alert has no icon to show the optional nature.</AlertDescription>
        </Alert>
        
        <h2 className="text-lg font-semibold">Alert with Long Content</h2>
        <Alert variant="default">
          <AlertTitle>This is a very long alert title that demonstrates how the component handles extended text content</AlertTitle>
          <AlertDescription>This is a very long alert description that demonstrates how the component handles extended text content and potentially wraps across multiple lines.</AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
