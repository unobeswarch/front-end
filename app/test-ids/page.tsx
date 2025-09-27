"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Database, TestTube, Copy } from "lucide-react"
import { DoctorHeader } from "@/components/doctor-header"

export default function TestPage() {
  const [testId, setTestId] = useState("")
  
  const mockIds = [
    "da939374-aab5-40ab-9b78-0ec37b86d616",
    "12345678-1234-5678-9012-123456789012",
    "98765432-9876-5432-1098-987654321098",
    "11111111-2222-3333-4444-555555555555"
  ]

  const handleTestWithId = () => {
    if (testId.trim()) {
      window.location.href = `/doctor/dashboard?testId=${testId}`
    }
  }

  const handleTestMock = (id: string) => {
    window.location.href = `/doctor/dashboard?testId=${id}`
  }

  return (
    <div className="min-h-screen bg-background">
      <DoctorHeader />
      
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">🧪 Herramienta de Prueba</h1>
          <p className="text-muted-foreground">Prueba tu Historia de Usuario con IDs reales o mock</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Prueba con ID Real */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-green-600" />
                Probar con Backend Real
              </CardTitle>
              <CardDescription>
                Ingresa un ID real del backend para probar la integración completa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-id">ID del Prediagnóstico</Label>
                <Input
                  id="test-id"
                  value={testId}
                  onChange={(e) => setTestId(e.target.value)}
                  placeholder="ej: da939374-aab5-40ab-9b78-0ec37b86d616"
                  className="font-mono text-sm"
                />
              </div>
              
              <Button 
                onClick={handleTestWithId} 
                disabled={!testId.trim()}
                className="w-full"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Probar con ID Real
              </Button>
              
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm font-medium mb-1">ℹ️ Cómo funciona:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Intenta conectar con localhost:8080/graphql</li>
                  <li>• Si funciona: usa datos reales del backend</li>
                  <li>• Si falla: usa datos mock como fallback</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Prueba con Mock */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="w-5 h-5 text-blue-600" />
                Probar con Datos Mock
              </CardTitle>
              <CardDescription>
                IDs simulados para desarrollo independiente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {mockIds.map((id, index) => {
                  const labels = ["Neumonía Urgente", "Normal", "Neumonía Moderada", "Sospechoso"]
                  const colors = ["destructive", "default", "destructive", "secondary"] as const
                  
                  return (
                    <div key={id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={colors[index]}>
                            {labels[index]}
                          </Badge>
                        </div>
                        <p className="text-xs font-mono text-muted-foreground">{id}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => navigator.clipboard.writeText(id)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleTestMock(id)}
                        >
                          Probar
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instrucciones */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>📋 Instrucciones para Desarrollo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">🔗 Para probar con Backend Real:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>1. Asegúrate de que tu backend esté corriendo</li>
                  <li>2. Verifica que esté en localhost:8080</li>
                  <li>3. Obtén un ID válido de tu base de datos</li>
                  <li>4. Pégalo en el campo de arriba y prueba</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">🧪 Para desarrollo independiente:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>1. Usa cualquier ID mock de la lista</li>
                  <li>2. Desarrolla tu formulario de validación</li>
                  <li>3. Prueba todos los flujos de tu HU</li>
                  <li>4. No dependes de otros desarrolladores</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}