"use client"

import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Activity, LogOut, Settings, User, Stethoscope, LayoutDashboard, FileText } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function DoctorHeader() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
  }

  const navigationItems = [
    {
      href: "/doctor/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/doctor/casos-pendientes",
      label: "Casos Pendientes",
      icon: FileText,
    },
  ]

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-card-foreground">NeumoDiag</h1>
              <span className="text-sm text-muted-foreground ml-2 flex items-center gap-1">
                <Stethoscope className="h-4 w-4" />
                Doctor Portal
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Button key={item.href} variant={isActive ? "secondary" : "ghost"} size="sm" asChild>
                    <Link href={item.href} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </Button>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || "/doctor-avatar.png"} alt="Doctor" />
                    <AvatarFallback>
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "SJ"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name || "Dr. Sarah Johnson"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || "sarah.johnson@hospital.com"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <div className="md:hidden">
                  {navigationItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link href={item.href} className="flex items-center">
                          <Icon className="mr-2 h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    )
                  })}
                  <DropdownMenuSeparator />
                </div>

                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
