import { Metadata } from "next"
import TestClient from "./test-client"

const title = "MCP Data Preview"
const description = "Demonstrating Figma Code Connect integration with published code panel and component testing"

export const dynamic = "force-static"
export const revalidate = false

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
}

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content - Test Client */}
              <div className="max-w-8xl mx-auto p-8">
        <TestClient />
      </div>
    </div>
  )
}
