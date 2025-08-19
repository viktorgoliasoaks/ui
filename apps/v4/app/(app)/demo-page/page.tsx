import { Metadata } from "next"
import {
    Alert,
    AlertTitle,
    AlertDescription,
} from "@/registry/new-york-v4/ui/alert"

import { Input } from "@/registry/new-york-v4/ui/input"
import { Checkbox } from "@/registry/new-york-v4/ui/checkbox"
import { Button } from "@/registry/new-york-v4/ui/button"
import { AlertCircle, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
    title: "Demo Page - Figma Code Test",
    description: "Test environment for Figma-generated HTML code",
}

export default function DemoPage() {
    return (
        <div className="min-h-screen bg-background p-8 flex items-center justify-center">
            <div className="max-w-xl mx-auto space-y-6">

                {/* Your Figma HTML code goes here */}
                <div className="bg-card border rounded-lg p-6 space-y-6">

                    <h1 className="text-center text-2xl font-medium">Please sign in to Nasdaq Private Market</h1>
                    {/* REPLACE THIS COMMENT WITH YOUR FIGMA HTML CODE */}
                    <Alert variant="default">
                        {true &&
                            ("default" === "destructive" ? (
                                <AlertCircle className="h-4 w-4" />
                            ) : (
                                <CheckCircle className="h-4 w-4" />
                            ))}
                        <AlertTitle>Broker, Law Firm, or Private Company?</AlertTitle>
                        <AlertDescription>
                            Are you here on behalf of a broker, law firm or representing a
                            private company issuing shares? Contact us.{" "}
                        </AlertDescription>
                    </Alert>

                    <div className="grid w-full items-center gap-1.5">
                        {true && (
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Your email
                            </label>
                        )}
                        <Input
                            type={"text" === "file" ? "file" : "text"}
                            disabled={"default" === "disabled"}
                            className={
                                "default" === "error" || "default" === "error-focus"
                                    ? "border-destructive w-full"
                                    : "w-full"
                            }
                        />
                        {undefined && (
                            <p className="text-sm text-muted-foreground">
                                This is an input description.
                            </p>
                        )}
                    </div>

                    <div className="grid w-full items-center gap-1.5">
                        {true && (
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Password
                            </label>
                        )}
                        <Input
                            type={"text" === "file" ? "file" : "text"}
                            disabled={"default" === "disabled"}
                            className={
                                "default" === "error" || "default" === "error-focus"
                                    ? "border-destructive w-full"
                                    : "w-full"
                            }
                        />
                        {undefined && (
                            <p className="text-sm text-muted-foreground">
                                This is an input description.
                            </p>
                        )}
                    </div>

                    <div className="flex items-start space-x-2">
                        <Checkbox checked id="checkbox-with-text" />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="checkbox-with-text"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Keep me logged in
                            </label>
                            {undefined && (
                                <p className="text-sm text-muted-foreground">
                                    text different from component level placeholder
                                </p>
                            )}
                        </div>
                    </div>

                    <Button className="w-full" variant="default">
                        Log in
                    </Button>
                </div>
            </div>
        </div>
    )
}
