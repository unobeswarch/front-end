"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/components/auth-context'
import { GraphQLClient } from '@/lib/apollo-client'

// GraphQL Query específica para HU7
const GET_CASE_DETAIL = `
  query GetCaseDetail($id: ID!) {
    caseDetail(id: $id) {
      id
      radiografiaId
      urlImagen
      estado
      fechaSubida
      preDiagnostic {
        prediagnostic_id
        pacienteId
        urlrad
        estado
        resultadosModelo {
          probNeumonia
          etiqueta
          fechaProcesamiento
        }
        fechaSubida
      }
      diagnostic {
        id
        prediagnosticoId
        aprobacion
        comentarios
        fechaRevision
        doctorNombre
      }
    }
  }
`

// TypeScript interfaces for HU7 data
interface ResultadosModelo {
  probNeumonia: number
  etiqueta: string
  fechaProcesamiento: string
}

interface PreDiagnostic {
  prediagnostic_id: string
  pacienteId: string
  urlrad: string
  estado: string
  resultadosModelo: ResultadosModelo
  fechaSubida: string
}

interface Diagnostic {
  id: string
  prediagnosticoId: string
  aprobacion: string
  comentarios: string
  fechaRevision: string
  doctorNombre?: string
}

interface CaseDetail {
  id: string
  radiografiaId: string
  urlImagen: string
  estado: string
  fechaSubida: string
  preDiagnostic: PreDiagnostic
  diagnostic?: Diagnostic
}

interface GetCaseDetailResponse {
  caseDetail: CaseDetail
}

interface RadiographDetailHU7Props {
  caseId: string
}

export function RadiographDetailHU7({ caseId }: RadiographDetailHU7Props) {
  const { user } = useAuth()
  const [data, setData] = useState<GetCaseDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCaseDetail() {
      // Solo ejecutar si hay usuario autenticado y es paciente
      if (!user || user.role !== 'patient') {
        setLoading(false)
        setError('Usuario no autorizado')
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        const result = await GraphQLClient.query<GetCaseDetailResponse>(
          GET_CASE_DETAIL,
          { id: caseId }
        )
        
        setData(result)
      } catch (err) {
        console.error('Error fetching case detail:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchCaseDetail()
  }, [caseId, user])

  if (loading) return <div>Cargando detalles de la radiografía...</div>
  if (error) return <div>Error: {error}</div>
  if (!data?.caseDetail) return <div>Radiografía no encontrada</div>

  const { caseDetail } = data

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header con información básica */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Radiografía</CardTitle>
          <div className="flex items-center gap-4">
            <Badge>
              {caseDetail.estado}
            </Badge>
            <span className="text-sm text-gray-500">
              Subida el {formatDate(caseDetail.fechaSubida)}
            </span>
          </div>
        </CardHeader>
      </Card>

      {/* Imagen de la radiografía */}
      <Card>
        <CardHeader>
          <CardTitle>Imagen Radiográfica</CardTitle>
        </CardHeader>
        <CardContent>
          {caseDetail.urlImagen ? (
            <img 
              src={caseDetail.urlImagen} 
              alt="Radiografía pulmonar"
              className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
            />
          ) : (
            <div className="text-center text-gray-500">
              Imagen no disponible
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resultados del modelo de IA */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Inteligencia Artificial</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Probabilidad de Neumonía:</label>
              <div className="text-2xl font-bold text-blue-600">
                {(caseDetail.preDiagnostic.resultadosModelo.probNeumonia * 100).toFixed(1)}%
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Clasificación:</label>
              <div className="text-lg">
                <Badge>
                  {caseDetail.preDiagnostic.resultadosModelo.etiqueta}
                </Badge>
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Procesado el: {formatDate(caseDetail.preDiagnostic.resultadosModelo.fechaProcesamiento)}
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Diagnóstico médico (solo si existe) */}
      {caseDetail.diagnostic && (
        <Card>
          <CardHeader>
            <CardTitle>Diagnóstico Médico</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Validación del resultado de IA:</label>
              <Badge>
                {caseDetail.diagnostic.aprobacion === 'Sí' ? 'Aprobado' : 'Rechazado'}
              </Badge>
            </div>
            
            <Separator />
            
            <div>
              <label className="text-sm font-medium">Comentarios del médico:</label>
              <p className="mt-2 p-4 bg-gray-50 rounded-lg">
                {caseDetail.diagnostic.comentarios}
              </p>
            </div>
            
            <div className="flex justify-between text-sm text-gray-500">
              <span>Revisado por: {caseDetail.diagnostic.doctorNombre}</span>
              <span>Fecha: {formatDate(caseDetail.diagnostic.fechaRevision)}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Funciones helper (simplificadas para evitar problemas de tipos)  
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  })
}