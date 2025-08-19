"use client"

import { useState } from "react"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york-v4/ui/tabs"
import { Alert, AlertDescription } from "@/registry/new-york-v4/ui/alert"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Separator } from "@/registry/new-york-v4/ui/separator"

export function DemoCodeEditor() {
  const [code, setCode] = useState("")
  const [renderedCode, setRenderedCode] = useState("")
  const [error, setError] = useState("")

  const sampleCode = `<div class="flex flex-col gap-4 p-6 bg-background border rounded-lg">
  <div class="flex items-center justify-between">
    <h3 class="text-lg font-semibold">Sample Component</h3>
    <Badge variant="secondary">New</Badge>
  </div>
  <p class="text-sm text-muted-foreground">
    This is a sample component that demonstrates how Figma-generated HTML will render.
  </p>
  <div class="flex gap-2">
    <button class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
      Primary Action
    </button>
    <button class="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80">
      Secondary
    </button>
  </div>
</div>`

  const handleRender = () => {
    try {
      setError("")
      // Basic HTML sanitization and rendering
      const sanitizedCode = sanitizeHTML(code)
      setRenderedCode(sanitizedCode)
    } catch (err) {
      setError("Failed to render code. Please check your HTML syntax.")
      console.error("Render error:", err)
    }
  }

  const sanitizeHTML = (html: string) => {
    // Basic sanitization - in production, use a proper HTML sanitizer
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/on\w+="[^"]*"/gi, "")
      .replace(/javascript:/gi, "")
  }

  const clearCode = () => {
    setCode("")
    setRenderedCode("")
    setError("")
  }

  const loadSampleCode = () => {
    setCode(sampleCode)
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Figma Code Test Environment</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Paste your Figma-generated HTML code below to see it rendered with shadcn/ui components.
          This environment supports HTML, CSS classes, and basic component rendering.
        </p>
      </div>

      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="editor">Code Editor</TabsTrigger>
          <TabsTrigger value="preview">Live Preview</TabsTrigger>
          <TabsTrigger value="info">Instructions</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Code Input
                <Badge variant="secondary">HTML/CSS</Badge>
              </CardTitle>
              <CardDescription>
                Paste your Figma-generated HTML code here. The code will be sanitized for security.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-96 p-4 border border-input rounded-md font-mono text-sm bg-muted resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder={`<!-- Paste your Figma HTML code here -->
<div class="flex items-center gap-2 p-4 bg-background border rounded-lg">
  <button class="px-4 py-2 bg-primary text-primary-foreground rounded-md">
    Click me
  </button>
  <span class="text-sm text-muted-foreground">Sample component</span>
</div>`}
              />
              <div className="flex gap-2">
                <Button onClick={handleRender} disabled={!code.trim()}>
                  Render Code
                </Button>
                <Button variant="outline" onClick={clearCode}>
                  Clear
                </Button>
                <Button variant="secondary" onClick={loadSampleCode}>
                  Load Sample
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Live Preview
                <Badge variant="outline">Real-time</Badge>
              </CardTitle>
              <CardDescription>
                See your rendered code with shadcn/ui styling applied.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="min-h-96 p-4 border border-input rounded-md bg-background overflow-auto">
                {renderedCode ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: renderedCode }}
                    className="demo-preview"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 mx-auto border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center">
                        <span className="text-2xl">→</span>
                      </div>
                      <p>Rendered output will appear here</p>
                      <p className="text-sm">Click "Render Code" to see your components</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
              <CardDescription>
                Follow these steps to test your Figma-generated code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">1</Badge>
                  <div>
                    <h4 className="font-medium">Extract Code from Figma</h4>
                    <p className="text-sm text-muted-foreground">
                      Use Figma's Code Connect interface to copy the HTML code for your components.
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">2</Badge>
                  <div>
                    <h4 className="font-medium">Paste in Code Editor</h4>
                    <p className="text-sm text-muted-foreground">
                      Paste the copied HTML code into the Code Input area. The editor supports HTML, CSS classes, and basic styling.
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">3</Badge>
                  <div>
                    <h4 className="font-medium">Render and Preview</h4>
                    <p className="text-sm text-muted-foreground">
                      Click "Render Code" to see your components rendered with shadcn/ui styling applied.
                    </p>
                  </div>
                </div>
              </div>

              <Alert>
                <AlertDescription>
                  <strong>Note:</strong> This environment sanitizes HTML for security. Script tags and event handlers are automatically removed.
                  For complex React components, you may need to adapt the code to work with this HTML-only environment.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
