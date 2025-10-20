import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /login, /patient/dashboard)
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const publicPaths = ["/", "/login", "/register"]

  // Check if the path is public
  const isPublicPath = publicPaths.includes(path)

  // Get token from cookies
  const token = request.cookies.get("auth-token")?.value || ""
  const userRole = request.cookies.get("user-role")?.value

  // If user is on a public path and has a token, validate it first
  if (isPublicPath && token) {
    try {
      // Validate token with API Gateway
      const response = await fetch("http://localhost:3001/api/v1/auth/validation", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ required_role: userRole }),
      })

      if (response.ok && userRole) {
        // Token is valid, redirect to appropriate dashboard
        if (userRole === "paciente") {
          return NextResponse.redirect(new URL("/patient/dashboard", request.nextUrl))
        } else if (userRole === "doctor") {
          return NextResponse.redirect(new URL("/doctor/dashboard", request.nextUrl))
        }
      }
    } catch (error) {
      // Token validation failed, clear cookies and continue to public path
      const response = NextResponse.next()
      response.cookies.delete("auth-token")
      response.cookies.delete("user-role")
      response.cookies.delete("user-id")
      return response
    }
  }

  // If user is on a protected path, validate token
  if (!isPublicPath) {
    if (!token) {
      // No token, redirect to login
      return NextResponse.redirect(new URL("/login", request.nextUrl))
    }

    try {
      // Validate token with API Gateway
      const response = await fetch("http://localhost:3001/api/v1/auth/validation", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ required_role: userRole }),
      })

      if (!response.ok) {
        // Token is invalid, clear cookies and redirect to login
        const redirectResponse = NextResponse.redirect(new URL("/login", request.nextUrl))
        redirectResponse.cookies.delete("auth-token")
        redirectResponse.cookies.delete("user-role")
        redirectResponse.cookies.delete("user-id")
        return redirectResponse
      }
    } catch (error) {
      // Token validation failed, redirect to login
      const redirectResponse = NextResponse.redirect(new URL("/login", request.nextUrl))
      redirectResponse.cookies.delete("auth-token")
      redirectResponse.cookies.delete("user-role")
      redirectResponse.cookies.delete("user-id")
      return redirectResponse
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
