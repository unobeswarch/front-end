"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react"
import { DoctorHeader } from "@/components/doctor-header"

export default function ConnectionTestPage() {
  const [testResults, setTestResults] = useState<any>(null)
  const [testing, setTesting] = useState(false)

  const testBackendConnection = async () => {
    setTesting(true)
    setTestResults(null)
    
    const results = {
      step1: { name: "Ping Backend", status: "pending", details: "" },
      step2: { name: "GraphQL Endpoint", status: "pending", details: "" },
      step3: { name: "CORS Headers", status: "pending", details: "" },
      step4: { name: "Network Access", status: "pending", details: "" }
    }

    try {
      // PASO 1: Verificar si el backend está corriendo
      console.log("🔍 PASO 1: Verificando si el backend está corriendo...")
      
      try {
        const pingResponse = await fetch('http://localhost:8080/health', { 
          method: 'GET',
          mode: 'cors'
        })
        
        if (pingResponse.ok) {
          results.step1.status = "success"
          results.step1.details = `Backend respondió: ${pingResponse.status}`
        } else {
          results.step1.status = "warning"
          results.step1.details = `Backend respondió pero con error: ${pingResponse.status}`
        }
      } catch (error) {
        // Si /health no funciona, intentar con el endpoint GraphQL directamente
        results.step1.status = "warning"
        results.step1.details = "/health no disponible, probando GraphQL..."
      }

      setTestResults({...results})

      // PASO 2: Verificar el endpoint GraphQL específicamente
      console.log("🔍 PASO 2: Verificando endpoint GraphQL...")
      
      try {
        const graphqlResponse = await fetch('http://localhost:8080/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `{
                getPreDiagnostic(id: "b150e640-3aec-4c3c-80ef-caedcd150c18") {
                prediagnostic_id
                estado
    }
  }`
}),
          mode: 'cors'
        })

        console.log("📥 GraphQL Response Status:", graphqlResponse.status)
        console.log("📥 GraphQL Response Headers:", Object.fromEntries(graphqlResponse.headers.entries()))

        if (graphqlResponse.ok) {
          const data = await graphqlResponse.json()
          results.step2.status = "success"
          results.step2.details = `GraphQL endpoint respondió correctamente: ${JSON.stringify(data)}`
        } else {
          const errorText = await graphqlResponse.text()
          results.step2.status = "error"
          results.step2.details = `Error ${graphqlResponse.status}: ${errorText}`
        }
      } catch (error) {
        results.step2.status = "error"
        results.step2.details = `Error de conexión: ${error}`
      }

      setTestResults({...results})

      // PASO 3: Verificar headers CORS
      console.log("🔍 PASO 3: Verificando CORS...")
      
      try {
        const corsResponse = await fetch('http://localhost:8080/query', {
          method: 'OPTIONS', // Preflight request
          headers: {
            'Origin': 'http://localhost:3000',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type',
          }
        })

        const corsHeaders = Object.fromEntries(corsResponse.headers.entries())
        console.log("🔍 CORS Headers:", corsHeaders)

        if (corsHeaders['access-control-allow-origin']) {
          results.step3.status = "success"
          results.step3.details = `CORS OK: ${corsHeaders['access-control-allow-origin']}`
        } else {
          results.step3.status = "error"
          results.step3.details = "Headers CORS no encontrados"
        }
      } catch (error) {
        results.step3.status = "error"
        results.step3.details = `Error CORS: ${error}`
      }

      setTestResults({...results})

      // PASO 4: Test completo con query real
      console.log("🔍 PASO 4: Test con query real...")
      
      try {
        const realQuery = `
          query GetPreDiagnostic($id: String!) {
            getPreDiagnostic(id: $id) {
              prediagnostic_id
              pacienteId
              fechaSubida
              resultadosModelo {
                probNeumonia
                etiqueta
                fechaProcesamiento
              }
            }
          }
        `
        
        const testResponse = await fetch('http://localhost:8080/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: realQuery,
            variables: { id: "test-id" }
          }),
          mode: 'cors'
        })

        if (testResponse.ok) {
          const data = await testResponse.json()
          
          if (data.errors) {
            results.step4.status = "warning"
            results.step4.details = `Query ejecutada pero con errores: ${data.errors[0].message}`
          } else {
            results.step4.status = "success"
            results.step4.details = "Query ejecutada correctamente"
          }
        } else {
          results.step4.status = "error"
          results.step4.details = `Error en query: ${testResponse.status}`
        }
      } catch (error) {
        results.step4.status = "error"
        results.step4.details = `Error en query real: ${error}`
      }

    } catch (error) {
      console.error("Error en test completo:", error)
    } finally {
      setTesting(false)
      setTestResults({...results})
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      default:
        return <div className="w-5 h-5 bg-gray-300 rounded-full animate-pulse" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "border-green-500 bg-green-50"
      case "error":
        return "border-red-500 bg-red-50"
      case "warning":
        return "border-yellow-500 bg-yellow-50"
      default:
        return "border-gray-300 bg-gray-50"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DoctorHeader />
      
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">🔍 Diagnóstico de Conexión</h1>
          <p className="text-muted-foreground">Verifica por qué las solicitudes no llegan al backend</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test de Conectividad Backend</CardTitle>
            <CardDescription>
              Ejecuta una serie de tests para identificar el problema de conexión
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testBackendConnection} 
              disabled={testing}
              className="w-full mb-4"
            >
              {testing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Ejecutando diagnóstico...
                </>
              ) : (
                "🚀 Ejecutar Diagnóstico Completo"
              )}
            </Button>

            {testResults && (
              <div className="space-y-4">
                {Object.entries(testResults).map(([key, result]: [string, any]) => (
                  <div 
                    key={key}
                    className={`p-4 rounded-lg border-2 ${getStatusColor(result.status)}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(result.status)}
                      <h3 className="font-medium">{result.name}</h3>
                      <Badge variant="outline">
                        {result.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground ml-8">
                      {result.details}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📋 Checklist Manual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>¿Tu backend está corriendo en localhost:8080?</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>¿El endpoint es /graphql (no /api/graphql)?</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>¿CORS está habilitado para localhost:3000?</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>¿Los logs del backend muestran las solicitudes?</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>¿Puedes hacer POST a /graphql con Postman?</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
