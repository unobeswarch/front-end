'use client'

// Debug script para probar la conexión directa
export default function DebugPage() {
  const testConnection = async () => {
    console.log("🚀 INICIANDO PRUEBA DIRECTA...")
    
    try {
      // Prueba 1: Ping simple
      console.log("1️⃣ Probando ping simple...")
      const pingResponse = await fetch('http://localhost:8080/health', { 
        method: 'GET',
        mode: 'no-cors' 
      })
      console.log("✅ Ping response:", pingResponse)
    } catch (error) {
      console.log("❌ Ping failed:", error)
    }

    try {
      // Prueba 2: GraphQL directo
      console.log("2️⃣ Probando GraphQL directo...")
      
      const graphqlBody = {
        query: `
          query GetPreDiagnostic($id: ID!) {
            getPreDiagnostic(id: $id) {
              prediagnostic_id
              pacienteId
              estado
              urlrad
              resultadosModelo {
                probNeumonia
                etiqueta
              }
              fechaSubida
            }
          }
        `,
        variables: {
          id: "b150e640-3aec-4c3c-80ef-caedcd150c18"
        }
      }
      
      console.log("📝 Request body:", graphqlBody)
      console.log("🔗 URL:", 'http://localhost:8080/query')
      
      const response = await fetch('http://localhost:8080/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(graphqlBody),
        mode: 'cors',
      })

      console.log("📥 Response status:", response.status)
      console.log("📥 Response headers:", Object.fromEntries(response.headers.entries()))
      
      if (response.ok) {
        const data = await response.json()
        console.log("✅ Success! Data:", data)
      } else {
        const errorText = await response.text()
        console.log("❌ Error response:", errorText)
      }
      
    } catch (error) {
      console.log("❌ GraphQL request failed:", error)
      console.log("❌ Error type:", typeof error)
      if (error instanceof Error) {
        console.log("❌ Error message:", error.message)
        console.log("❌ Error stack:", error.stack)
      }
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">🔧 Debug Connection</h1>
      <button 
        onClick={testConnection}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Probar Conexión
      </button>
      <p className="mt-4 text-sm text-gray-600">
        Revisa la consola del navegador para ver los logs detallados
      </p>
    </div>
  )
}