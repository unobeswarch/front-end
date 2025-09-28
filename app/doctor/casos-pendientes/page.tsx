"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileImage, Clock, AlertTriangle, Loader2, RefreshCw, Eye } from "lucide-react"
import { DoctorHeader } from "@/components/doctor-header"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PendingCase {
  id: string
  patientId: string
  patientName?: string
  uploadDate: string
  processedDate?: string
  status: string
  bodyPart?: string
  urgency?: "routine" | "urgent"
  aiDiagnosis?: string
  aiConfidence?: number
}

export default function CasosPendientesPage() {
  const [cases, setCases] = useState<PendingCase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCases = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/businesslogic/cases", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setCases(data)
    } catch (err) {
      console.error("Error fetching cases:", err)
      setError(err instanceof Error ? err.message : "Error desconocido al cargar los casos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCases()
  }, [])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    } catch {
      return dateString
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "processed":
      case "procesado":
        return <Badge variant="secondary">Procesado</Badge>
      case "pending":
      case "pendiente":
        return <Badge variant="outline">Pendiente</Badge>
      case "urgent":
      case "urgente":
        return <Badge variant="destructive">Urgente</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DoctorHeader />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Casos Pendientes</h1>
              <p className="text-muted-foreground">Lista de casos de pacientes pendientes de revisión</p>
            </div>
            <Button onClick={fetchCases} disabled={loading} variant="outline" size="sm">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Actualizar
            </Button>
          </div>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <FileImage className="h-5 w-5" />
              Casos Pendientes de Revisión
            </CardTitle>
            <CardDescription>
              {loading
                ? "Cargando casos..."
                : `${cases.length} caso${cases.length !== 1 ? "s" : ""} encontrado${cases.length !== 1 ? "s" : ""}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Cargando casos...</span>
              </div>
            ) : cases.length === 0 ? (
              <div className="text-center py-12">
                <FileImage className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hay casos pendientes</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Los casos aparecerán aquí cuando estén disponibles para revisión
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Paciente</TableHead>
                      <TableHead>Nombre Paciente</TableHead>
                      <TableHead>Fecha del Caso</TableHead>
                      <TableHead>Estado Actual</TableHead>
                      <TableHead>Parte del Cuerpo</TableHead>
                      <TableHead>Urgencia</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cases.map((case_) => (
                      <TableRow key={case_.id}>
                        <TableCell className="font-medium">{case_.patientId}</TableCell>
                        <TableCell>{case_.patientName || "N/A"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            {formatDate(case_.uploadDate)}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(case_.status)}</TableCell>
                        <TableCell>{case_.bodyPart || "N/A"}</TableCell>
                        <TableCell>
                          {case_.urgency ? (
                            <Badge variant={case_.urgency === "urgent" ? "destructive" : "secondary"}>
                              {case_.urgency === "urgent" ? "Urgente" : "Rutina"}
                            </Badge>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
