import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Shield, Users, FileText } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">NeumoDiag</h1>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">
            Professional Radiography Management System
          </h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Streamline your medical imaging workflow with our secure, AI-powered platform designed for healthcare
            professionals and patients.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="bg-card border-border">
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-card-foreground">Secure & Compliant</CardTitle>
              <CardDescription>HIPAA-compliant platform ensuring patient data privacy and security</CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-card-foreground">Multi-Role Access</CardTitle>
              <CardDescription>
                Separate dashboards for patients and doctors with role-based permissions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <FileText className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-card-foreground">AI-Powered Analysis</CardTitle>
              <CardDescription>Advanced AI diagnostics with doctor validation for accurate results</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-card border-border max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-card-foreground">Ready to get started?</CardTitle>
              <CardDescription className="text-lg">
                Join healthcare professionals who trust NeumoDiag for their radiography management needs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link href="/register">Create Your Account</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
