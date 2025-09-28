import { TestConnection } from '@/components/test-connection';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          🧪 Página de Pruebas - Integración Backend
        </h1>
        <TestConnection />
        
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            Esta página te permite probar la conexión con tu backend GraphQL antes de usar el dashboard real.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Accede a esta página en: <code>http://localhost:3000/test</code>
          </p>
        </div>
      </div>
    </div>
  );
}
