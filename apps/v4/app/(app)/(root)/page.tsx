import { Metadata } from "next"
import { FigmaButton } from "@/components/figma-button"

const title = "My App"
const description = "A blank homepage for your application"

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
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold">Figma Code Connect Example</h1>
        <p className="text-muted-foreground max-w-md">
          This button is connected to Figma through Code Connect. Click to open the design in Figma.
        </p>
        <FigmaButton />
      </div>
    </div>
  )
}
