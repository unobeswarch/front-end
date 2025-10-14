"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "paciente" | "doctor"
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<User | null>
  register: (userData: any) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) return

    const hasToken = document.cookie.includes("auth-token")
    const userRole = document.cookie.includes("user-role=paciente")

      ? "paciente"
      : document.cookie.includes("user-role=doctor")
        ? "doctor"
        : null
    if (hasToken && userRole) {
      const token = document.cookie.split("; ").find(row => row.startsWith("auth-token="))?.split("=")[1]

       fetch("http://localhost:8081/validation", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ required_role: userRole }),
      })
        .then(res => {
          if (!res.ok) throw new Error("Token inválido o expirado")
          return res.json()
        })
        .then(async data => {
          let avatarUrl = null
          try {
            const imageResponse = await fetch(`http://localhost:8081/userImage?id=${data.UserID}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            if (imageResponse.ok) {
              const blob = await imageResponse.blob()
              avatarUrl = URL.createObjectURL(blob)
            }
          } catch (error) {
            console.warn("No se pudo cargar la imagen del usuario, usando avatar por defecto")
          }

          setUser({
            id: data.UserID,
            name: data.Name,
            email: data.Email,
            role: data.Role,
            avatar: avatarUrl || (data.Role === "paciente" ? "/patient-avatar.png" : "/doctor-avatar.png"),
        })
      })
      .catch(err => {
        console.error(err)
      })    
    }
  }, [])

  const login = async (correo: string, contrasena: string): Promise<User | null> => {
    setIsLoading(true)

    try {
    const response = await fetch("http://localhost:8081/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, contrasena }),
    })

    if (!response.ok) {
      setIsLoading(false)
      return null
    }

    const data = await response.json()
    console.log("🔍 Auth response data:", data)
    document.cookie = `auth-token=${data.token}; path=/`
    document.cookie = `user-role=${data.rol}; path=/`

    const imageResponse = await fetch(`http://localhost:8081/userImage?id=${data.user_id}`, {
      headers: { "Authorization": `Bearer ${data.token}` },
    })

    let avatarUrl = null
    if (imageResponse.ok) {
      const blob = await imageResponse.blob()
      avatarUrl = URL.createObjectURL(blob)
    }

    const userData = {
      id: data.user_id,
      email: correo,
      name: data.nombre.toString(),
      role: data.rol,
      avatar: avatarUrl || (data.rol === "paciente" ? "/patient-avatar.png" : "/doctor-avatar.png"),
    }

    setUser(userData)
    setIsLoading(false)
    return userData

    } catch (error) {
      console.error("Error en login:", error)
      setIsLoading(false)
      return null
    }
  }

  const register = async (userData: any): Promise<boolean> => {
    setIsLoading(true)

    try {
      const responseRegister = await fetch("http://localhost:8081/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

    if (!responseRegister.ok) {
      setIsLoading(false)
      return false
    }

    const registerData = await responseRegister.json()

    const newUser = {
      id: registerData.id,
      name: registerData.nombre_completo,
      email: registerData.correo,
      role: registerData.rol,
      avatar: registerData.rol === "paciente" ? "/patient-avatar.png" : "/doctor-avatar.png",
    }

    setUser(newUser)

    setIsLoading(false)
    return true

  } catch (error) {
    console.error("Error en registro:", error)
    setIsLoading(false)
    return false
  }
}

  const logout = () => {
    setUser(null)
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
