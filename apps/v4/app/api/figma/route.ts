import { Client } from "figma-js"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const accessToken = process.env.FIGMA_ACCESS_TOKEN // Server-side only, no NEXT_PUBLIC_ prefix needed
  
  if (!accessToken) {
    return NextResponse.json({ 
      error: "Figma token not configured",
      suggestion: "Set FIGMA_ACCESS_TOKEN in your .env.local file"
    }, { status: 500 })
  }

  try {
    const client = Client({ personalAccessToken: accessToken })
    
    // Open the new design system file
    const fileKey = "rgqHmkJX2Uw9PhGoon1OIh" // New design system file key
    
    const response = await client.file(fileKey)
    
    return NextResponse.json({ 
      success: true,
      data: {
        name: response.data.name,
        lastModified: response.data.lastModified,
        version: response.data.version
      }
    })
    
  } catch (error) {
    console.error("Figma API error:", error)
    return NextResponse.json({ 
      error: "Failed to fetch Figma data",
      suggestion: "Check your token permissions and file access"
    }, { status: 500 })
  }
}
