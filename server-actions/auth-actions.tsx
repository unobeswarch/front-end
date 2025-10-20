"use server"

interface User {
  id: string
  name: string
  email: string
  role: "paciente" | "doctor"
  avatar?: string
}

import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export async function register(userData: any) {
    try {
      const responseRegister = await fetch("http://localhost:3001/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        cache: "no-store"
      })

    if (!responseRegister.ok) {
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

    return true

  } catch (error) {
    console.error("Error en registro:", error)
    return false
  }
}

export async function login(formData: FormData): Promise<void> {
  const correo = formData.get("email") as string
  const contrasena = formData.get("password") as string

  console.log(correo)
  console.log(contrasena)

  const response = await fetch("http://localhost:3001/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, contrasena }),
    cache: "no-store"
  })

  if (!response.ok) {
    throw new Error("Credenciales incorrectas")
  }

  const data = await response.json()

  console.log(data)

  console.log(data.token)
  console.log(data.rol)
  console.log(data.user_id)

  cookies().set("auth-token", data.token, { path: "/" })
  cookies().set("user-role", data.rol, { path: "/" })
  cookies().set("user-id", data.user_id, { path: "/" })

  if (data.rol === "paciente") redirect("/patient/dashboard")
  if (data.rol === "doctor") redirect("/doctor/dashboard")
}

export async function logout(): Promise<void> {
  const cookieStore = cookies()
  cookieStore.delete("auth-token")
  cookieStore.delete("user-role")
  cookieStore.delete("user-id")

  redirect("/login")
}


export async function getUserFromToken() {
  const cookieStore = cookies()
  const token = cookieStore.get("auth-token")?.value
  const user_id = cookieStore.get("user-id")?.value

  if (!token || !user_id) return null;

  const res = await fetch("http://localhost:3001/api/v1/auth/userInfo", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) return null;

  const data = await res.json();

  const avatarUrl =
    data.rol === "paciente"
      ? `http://localhost:3001/api/v1/auth/userImage?id=${user_id}`
      : "/doctor-avatar.png";

  return {
    id: user_id,
    name: data.nombre,
    email: data.email,
    role: data.rol,
    avatar: avatarUrl,
  };
}
