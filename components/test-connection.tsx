"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PreDiagnosticService } from '@/lib/prediagnostic-service';
import { PreDiagnostic } from '@/lib/graphql-queries';

export function TestConnection() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [testId, setTestId] = useState('b150e640-3aec-4c3c-80ef-caedcd150c18'); // ID real que funciona

  // ❌ ELIMINADO: Backend no soporta getAllPreDiagnostics
  /*
  const testGetAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await PreDiagnosticService.getAllPreDiagnostics();
      setResult({
        type: 'getAllPreDiagnostics',
        data,
        count: data.length
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };
  */

  const testGetOne = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await PreDiagnosticService.getPreDiagnostic(testId);
      setResult({
        type: 'getPreDiagnostic',
        data,
        id: testId
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>🔌 Test de Conexión Backend GraphQL</CardTitle>
        <CardDescription>
          Prueba la conexión con el backend en localhost:8080/query (solo getPreDiagnostic disponible)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controles de prueba */}
        <div className="flex flex-wrap gap-4">
          {/* ❌ ELIMINADO: Backend no soporta getAllPreDiagnostics
          <Button 
            onClick={testGetAll} 
            disabled={loading}
            variant="outline"
          >
            {loading ? 'Probando...' : 'Obtener Todos los Casos'}
          </Button>
          */}
          
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={testId}
              onChange={(e) => setTestId(e.target.value)}
              placeholder="ID del prediagnóstico"
              className="px-3 py-2 border rounded-md text-sm"
              disabled={loading}
            />
            <Button 
              onClick={testGetOne} 
              disabled={loading}
              variant="outline"
            >
              {loading ? 'Probando...' : 'Obtener Caso Específico'}
            </Button>
          </div>
        </div>

        {/* Estado de carga */}
        {loading && (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
            <span>Conectando con el backend...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Badge variant="destructive">❌ Error</Badge>
                <span className="text-red-700">{error}</span>
              </div>
              <div className="mt-2 text-sm text-red-600">
                <p><strong>Posibles soluciones:</strong></p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Verificar que el backend esté corriendo en localhost:8080</li>
                  <li>Revisar que el endpoint /graphql esté disponible</li>
                  <li>Verificar configuración de CORS en el backend</li>
                  <li>Comprobar que el ID del prediagnóstico sea válido</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resultado exitoso */}
        {result && !error && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">✅ Éxito</Badge>
                Conexión exitosa - {result.type}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.type === 'getAllPreDiagnostics' && (
                <div>
                  <p className="mb-3">
                    <strong>Casos encontrados:</strong> {result.count}
                  </p>
                  {result.data.length > 0 && (
                    <div className="space-y-2">
                      {result.data.slice(0, 3).map((item: PreDiagnostic, index: number) => (
                        <div key={item.prediagnostic_id} className="p-3 bg-white rounded border">
                          <div className="flex justify-between items-start">
                            <div>
                              <p><strong>ID:</strong> {item.prediagnostic_id}</p>
                              <p><strong>Paciente:</strong> {item.pacienteId}</p>
                              <p><strong>Fecha:</strong> {new Date(item.fechaSubida).toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant={item.resultadosModelo.probNeumonia >= 0.8 ? "destructive" : item.resultadosModelo.probNeumonia >= 0.5 ? "outline" : "secondary"}>
                                {item.resultadosModelo.etiqueta}
                              </Badge>
                              <p className="text-sm mt-1">
                                {(item.resultadosModelo.probNeumonia * 100).toFixed(1)}%
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {result.count > 3 && (
                        <p className="text-sm text-gray-600">
                          ... y {result.count - 3} casos más
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {result.type === 'getPreDiagnostic' && (
                <div>
                  <p className="mb-3">
                    <strong>Prediagnóstico encontrado:</strong> {result.id}
                  </p>
                  <div className="p-3 bg-white rounded border">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p><strong>ID:</strong> {result.data.prediagnostic_id}</p>
                        <p><strong>Paciente:</strong> {result.data.pacienteId}</p>
                        <p><strong>Fecha Subida:</strong> {new Date(result.data.fechaSubida).toLocaleString()}</p>
                      </div>
                      <div>
                        <Badge variant={result.data.resultadosModelo.probNeumonia >= 0.8 ? "destructive" : result.data.resultadosModelo.probNeumonia >= 0.5 ? "outline" : "secondary"}>
                          {result.data.resultadosModelo.etiqueta}
                        </Badge>
                        <p><strong>Prob. Neumonía:</strong> {(result.data.resultadosModelo.probNeumonia * 100).toFixed(1)}%</p>
                        <p><strong>Estado:</strong> {result.data.estado}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium">
                  Ver datos JSON completos
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            </CardContent>
          </Card>
        )}

        {/* Información adicional */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <h4 className="font-medium text-blue-900 mb-2">📋 Información de Configuración</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Backend URL:</strong> http://localhost:8080/query</p>
              <p><strong>Frontend URL:</strong> http://localhost:3000</p>
              <p><strong>Método:</strong> GraphQL Query (solo getPreDiagnostic disponible)</p>
              <p><strong>ID de prueba:</strong> b150e640-3aec-4c3c-80ef-caedcd150c18</p>
              <p><strong>Estado del servidor:</strong> {loading ? '🟡 Conectando...' : error ? '🔴 Error' : result ? '🟢 Conectado' : '⚪ No probado'}</p>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}