"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { FileImage, Clock, CheckCircle, AlertTriangle, RefreshCw, User, Calendar, TestTube } from "lucide-react"
import { DoctorHeader } from "@/components/doctor-header"
import { PreDiagnostic } from "@/lib/graphql-queries"

// Datos mock para que puedas desarrollar tu HU independientemente
const mockPrediagnostics: PreDiagnostic[] = [
  {
    prediagnostic_id: "b150e640-3aec-4c3c-80ef-caedcd150c18", // ID REAL que funciona!
    pacienteId: "test_patient_001",
    estado: "procesado",
    urlrad: "https://example.com/xrays/test_123.jpg",
    fechaSubida: "2025-09-26T15:47:02.558000",
    resultadosModelo: {
      probNeumonia: 0.87,
      etiqueta: "Viral Pneumonia"
    }
  },
  {
    prediagnostic_id: "da939374-aab5-40ab-9b78-0ec37b86d616",
    pacienteId: "P001",
    estado: "procesado",
    urlrad: "https://via.placeholder.com/400x300/1f2937/ffffff?text=Mock+P001",
    fechaSubida: "2024-01-15T10:30:00Z",
    resultadosModelo: {
      probNeumonia: 0.85,
      etiqueta: "Neumonía"
    }
  },
  {
    prediagnostic_id: "12345678-1234-5678-9012-123456789012",
    pacienteId: "P002",
    estado: "procesado", 
    urlrad: "https://via.placeholder.com/400x300/065f46/ffffff?text=Mock+P002",
    fechaSubida: "2024-01-14T14:20:00Z",
    resultadosModelo: {
      probNeumonia: 0.25,
      etiqueta: "Normal"
    }
  },
  {
    prediagnostic_id: "98765432-9876-5432-1098-987654321098",
    pacienteId: "P003",
    estado: "procesado",
    urlrad: "https://via.placeholder.com/400x300/991b1b/ffffff?text=Mock+P003",
    fechaSubida: "2024-01-13T09:15:00Z",
    resultadosModelo: {
      probNeumonia: 0.72,
      etiqueta: "Neumonía"
    }
  }
];

export default function DoctorDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Para tu HU, usamos datos mock. El otro desarrollador se encargará de la integración real
  const prediagnostics = mockPrediagnostics;

  // Verificar si hay un ID de prueba en la URL - redirigir a página de detalle
  useEffect(() => {
    const testId = searchParams.get('testId')
    if (testId) {
      console.log(`🧪 Redirigiendo a detalle del caso: ${testId}`)
      router.push(`/doctor/cases/${testId}`)
    }
  }, [searchParams, router])
  
  // Clasificar casos por urgencia
  const urgentCases = prediagnostics.filter(p => p.resultadosModelo.probNeumonia > 0.7)
  const routineCases = prediagnostics.filter(p => p.resultadosModelo.probNeumonia <= 0.7)

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  }

  const getBadgeColor = (etiqueta: string): string => {
    switch (etiqueta.toLowerCase()) {
      case 'neumonía':
      case 'neumonia':
        return 'bg-red-100 text-red-800';
      case 'normal':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  }

  const PreDiagnosticCard = ({ prediagnostic }: { prediagnostic: PreDiagnostic }) => {
    const isUrgent = prediagnostic.resultadosModelo.probNeumonia > 0.7;
    const badgeColor = getBadgeColor(prediagnostic.resultadosModelo.etiqueta);
    
    return (
      <div
        className="flex items-center justify-between p-4 bg-background rounded-lg border border-border cursor-pointer hover:bg-accent transition-colors"
        onClick={() => router.push(`/doctor/cases/${prediagnostic.prediagnostic_id}`)}
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            isUrgent ? 'bg-red-100' : 'bg-blue-100'
          }`}>
            <FileImage className={`h-6 w-6 ${
              isUrgent ? 'text-red-600' : 'text-blue-600'
            }`} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-foreground">
                Paciente: {prediagnostic.pacienteId}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Subido: {formatDate(prediagnostic.fechaSubida)}</span>
            </div>
          </div>
        </div>
        <div className="text-right space-y-2">
          <div className="flex gap-2">
            <Badge className={badgeColor}>
              {prediagnostic.resultadosModelo.etiqueta}
            </Badge>
            <Badge variant={isUrgent ? "destructive" : "secondary"}>
              {isUrgent ? "Urgente" : "Rutina"}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Probabilidad: {(prediagnostic.resultadosModelo.probNeumonia * 100).toFixed(1)}%
          </div>
        </div>
      </div>
    )
  }

  const PreDiagnosticsList = ({ cases }: { cases: PreDiagnostic[] }) => {
    if (cases.length === 0) {
      return (
        <div className="text-center py-8">
          <FileImage className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No hay casos disponibles</p>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {cases.map((prediagnostic) => (
          <PreDiagnosticCard key={prediagnostic.prediagnostic_id} prediagnostic={prediagnostic} />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DoctorHeader />

      <main className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard del Doctor</h1>
            <p className="text-muted-foreground">Revisa y valida los casos analizados por IA (Datos Mock para desarrollo)</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/connection-test'}
              className="flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Test Conexión
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/test-ids'}
              className="flex items-center gap-2"
            >
              <TestTube className="w-4 h-4" />
              Probar con IDs
            </Button>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              🧪 Modo Desarrollo - Datos Mock
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="urgent">Casos Urgentes</TabsTrigger>
            <TabsTrigger value="routine">Casos de Rutina</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Casos Totales</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">{prediagnostics.length}</div>
                  <p className="text-xs text-muted-foreground">Disponibles para revisión</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Urgentes</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{urgentCases.length}</div>
                  <p className="text-xs text-muted-foreground">Requieren atención inmediata</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Rutina</CardTitle>
                  <FileImage className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">{routineCases.length}</div>
                  <p className="text-xs text-muted-foreground">Revisión estándar</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Estado</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">✓</div>
                  <p className="text-xs text-muted-foreground">Datos Mock</p>
                </CardContent>
              </Card>
            </div>

            {/* Alerta de casos urgentes */}
            {urgentCases.length > 0 && (
              <Card className="bg-destructive/5 border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-destructive flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Casos Urgentes Requieren Atención
                  </CardTitle>
                  <CardDescription>
                    {urgentCases.length} caso{urgentCases.length > 1 ? "s" : ""} marcado{urgentCases.length > 1 ? "s" : ""} como urgente{urgentCases.length > 1 ? "s" : ""} por el análisis de IA
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PreDiagnosticsList cases={urgentCases.slice(0, 3)} />
                </CardContent>
              </Card>
            )}

            {/* Casos recientes */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Casos Disponibles</CardTitle>
                <CardDescription>Haz click en cualquier caso para ver los detalles (Tu Historia de Usuario)</CardDescription>
              </CardHeader>
              <CardContent>
                <PreDiagnosticsList cases={prediagnostics} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="urgent">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Casos Urgentes
                </CardTitle>
                <CardDescription>Casos que requieren atención médica inmediata</CardDescription>
              </CardHeader>
              <CardContent>
                <PreDiagnosticsList cases={urgentCases} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="routine">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Casos de Rutina</CardTitle>
                <CardDescription>Casos de radiografía estándar para revisión</CardDescription>
              </CardHeader>
              <CardContent>
                <PreDiagnosticsList cases={routineCases} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
