# Integración Frontend-Backend NeumoDiag

## 🎯 Historia de Usuario Implementada

**Como doctor, quiero seleccionar un caso de cualquier paciente para ver su radiografía y resultados del modelo.**

## 🚀 Configuración

### Requisitos Previos
1. **Backend en Go corriendo en `localhost:8080`**
2. **Endpoint GraphQL disponible en `/graphql`**
3. **Frontend Next.js en `localhost:3000`**

### Dependencias Instaladas
```bash
npm install @apollo/client graphql
```

## 📋 Funcionalidades Implementadas

### 1. Cliente GraphQL (Apollo Client)
- **Archivo**: `lib/apollo-client.ts`
- **Configuración**: Conecta a `http://localhost:8080/graphql`
- **Características**: 
  - Cache automático
  - Manejo de errores
  - CORS configurado

### 2. Consultas GraphQL
- **Archivo**: `lib/graphql-queries.ts`
- **Consulta Principal**:
```graphql
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
```

### 3. Servicio de Prediagnósticos
- **Archivo**: `lib/prediagnostic-service.ts`
- **Métodos**:
  - `getPreDiagnostic(id)`: Obtiene un caso específico
  - `getAllPreDiagnostics()`: Lista todos los casos
  - Funciones de utilidad para formatear datos

### 4. Componentes Actualizados

#### Dashboard del Doctor (`app/doctor/dashboard/page.tsx`)
- ✅ Lista casos reales del backend
- ✅ Clasifica por urgencia automáticamente
- ✅ Botón de actualizar/refresh
- ✅ Manejo de estados de carga y error
- ✅ Navegación a detalles del caso

#### Componente de Detalles (`components/prediagnostic-detail.tsx`)
- ✅ Muestra información completa del prediagnóstico
- ✅ Probabilidad de neumonía con indicador visual
- ✅ Etiquetas del modelo con colores
- ✅ Fechas formateadas
- ✅ Clasificación de urgencia automática

## 🎮 Cómo Usar

### 1. Iniciar el Backend
```bash
# En el directorio de tu backend en Go
go run main.go
# Debe estar corriendo en localhost:8080
```

### 2. Iniciar el Frontend
```bash
# En el directorio neumdiag
npm run dev
# Abre http://localhost:3000
```

### 3. Flujo de Usuario
1. **Login como Doctor** → Ve al dashboard
2. **Ver Lista de Casos** → Se cargan automáticamente del backend
3. **Seleccionar un Caso** → Click en cualquier tarjeta de prediagnóstico
4. **Ver Detalles Completos** → Información del modelo, probabilidades, etc.
5. **Volver al Dashboard** → Botón "Volver al Dashboard"

## 🔧 Configuración del Backend

### Estructura de Datos Esperada
```json
{
  "prediagnostic_id": "da939374-aab5-40ab-9b78-0ec37b86d616",
  "pacienteId": "P001",
  "fechaSubida": "2024-01-15T10:30:00Z",
  "resultadosModelo": {
    "probNeumonia": 0.85,
    "etiqueta": "Neumonía",
    "fechaProcesamiento": "2024-01-15T10:35:00Z"
  }
}
```

### Configuración de CORS en Go
Asegúrate de que tu backend permita requests desde `localhost:3000`:

```go
// Ejemplo de configuración CORS en Go
func enableCors(w *http.ResponseWriter) {
    (*w).Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
    (*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
    (*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}
```

## 🐛 Solución de Problemas

### Error de Conexión
```
NetworkError: Failed to fetch
```
**Solución**: Verifica que el backend esté corriendo en `localhost:8080`

### Error de CORS
```
Access-Control-Allow-Origin
```
**Solución**: Configura CORS en el backend para permitir `localhost:3000`

### Error de GraphQL
```
GraphQL error: Cannot query field...
```
**Solución**: Verifica que el esquema GraphQL del backend coincida con las consultas

## 🚦 Estados de la Aplicación

### ✅ Funcionando Correctamente
- Lista de casos se carga automáticamente
- Los casos se clasifican por urgencia
- Los detalles se muestran correctamente
- Navegación fluida entre vistas

### ⚠️ Estados de Error Manejados
- Backend no disponible
- Errores de red
- Datos malformados
- Casos no encontrados

## 🔮 Próximos Pasos

1. **Agregar imagen de radiografía**: Extender el backend para incluir URLs de imágenes
2. **Validación de casos**: Implementar funcionalidad para que el doctor valide diagnósticos
3. **Autenticación real**: Reemplazar el sistema mock por autenticación real
4. **Tiempo real**: Agregar suscripciones GraphQL para actualizaciones en vivo

## 📝 Notas Técnicas

- **Apollo Client** maneja automáticamente el cache y las actualizaciones
- **TypeScript** proporciona tipado fuerte para todas las operaciones GraphQL
- **Next.js** optimiza automáticamente las consultas del lado del servidor
- **Tailwind CSS** mantiene el diseño consistente y responsivo