"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "patient" | "doctor"
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: "patient" | "doctor") => Promise<boolean>
  register: (userData: any) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const token = document.cookie.includes("auth-token")
    const userRole = document.cookie.includes("user-role=patient")
      ? "patient"
      : document.cookie.includes("user-role=doctor")
        ? "doctor"
        : null

    if (token && userRole) {
      // In a real app, you'd validate the token with your backend
      setUser({
        id: "1",
        name: userRole === "patient" ? "John Doe" : "Dr. Sarah Johnson",
        email: userRole === "patient" ? "john@example.com" : "sarah@hospital.com",
        role: userRole,
        avatar: userRole === "patient" ? "/patient-avatar.png" : "/doctor-avatar.png",
      })
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, role: "patient" | "doctor"): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you'd validate credentials with your backend
    if (password === "password") {
      const userData = {
        id: "1",
        name: role === "patient" ? "John Doe" : "Dr. Sarah Johnson",
        email,
        role,
        avatar: role === "patient" ? "/patient-avatar.png" : "/doctor-avatar.png",
      }

      setUser(userData)

      // Set cookies (in a real app, these would be secure HTTP-only cookies)
      document.cookie = "auth-token=mock-token; path=/"
      document.cookie = `user-role=${role}; path=/`

      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const register = async (userData: any): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newUser = {
      id: "1",
      name: userData.name,
      email: userData.email,
      role: userData.role,
      avatar: userData.role === "patient" ? "/patient-avatar.png" : "/doctor-avatar.png",
    }

    setUser(newUser)

    // Set cookies
    document.cookie = "auth-token=mock-token; path=/"
    document.cookie = `user-role=${userData.role}; path=/`

    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    // Clear cookies
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    window.location.href = "/login"
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
