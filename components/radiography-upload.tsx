"use client"

import { useState, useCallback, useRef } from "react"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Upload, 
  FileImage, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Eye, 
  RefreshCw,
  FileText
} from "lucide-react"
import { RadiographyService, RadiographyFile, RadiographyUploadProgress } from "@/lib/radiography-service"

interface RadiographyUploadProps {
  patientId: string;
  onUploadSuccess?: (result: any) => void;
  onUploadError?: (error: string) => void;
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  file: RadiographyFile | null;
  preview: string | null;
  uploadId: string | null;
  result: any | null;
}

export function RadiographyUpload({ patientId, onUploadSuccess, onUploadError }: RadiographyUploadProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    file: null,
    preview: null,
    uploadId: null,
    result: null
  })

  /**
   * Maneja la selección de archivos (drag & drop o click)
   */
  const handleFileSelect = useCallback(async (selectedFile: File) => {
    try {
      // Validar archivo
      const validatedFile = RadiographyService.validateRadiographyFile(selectedFile)
      
      if (!validatedFile.isValid) {
        toast({
          title: "Archivo no válido",
          description: validatedFile.errors.join(", "),
          variant: "destructive"
        })
        return
      }

      // Crear preview si es posible
      const preview = await RadiographyService.createPreview(selectedFile)
      
      setUploadState(prev => ({
        ...prev,
        file: validatedFile,
        preview,
        result: null
      }))

      toast({
        title: "Archivo seleccionado",
        description: `${selectedFile.name} (${RadiographyService.formatFileSize(selectedFile.size)})`,
      })

    } catch (error) {
      console.error("Error processing file:", error)
      toast({
        title: "Error",
        description: "Error procesando el archivo seleccionado",
        variant: "destructive"
      })
    }
  }, [toast])

  /**
   * Maneja el drag & drop
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  /**
   * Maneja el click en el área de upload
   */
  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  /**
   * Maneja la selección desde input file
   */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  /**
   * Ejecuta el upload del archivo
   */
  const handleUpload = useCallback(async () => {
    if (!uploadState.file || !uploadState.file.isValid) {
      toast({
        title: "Error",
        description: "No hay archivo válido para subir",
        variant: "destructive"
      })
      return
    }

    const uploadId = RadiographyService.generateUploadId()
    
    setUploadState(prev => ({
      ...prev,
      isUploading: true,
      progress: 0,
      uploadId,
      result: null
    }))

    try {
      const result = await RadiographyService.uploadRadiography(
        uploadState.file.file,
        patientId,
        (progress: RadiographyUploadProgress) => {
          setUploadState(prev => ({
            ...prev,
            progress: progress.percentage
          }))
        }
      )

      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        result
      }))

      if (result.success) {
        toast({
          title: "✅ Upload exitoso",
          description: result.message,
        })
        onUploadSuccess?.(result)
      } else {
        toast({
          title: "❌ Error en upload",
          description: result.message,
          variant: "destructive"
        })
        onUploadError?.(result.message)
      }

    } catch (error) {
      console.error("Upload error:", error)
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      
      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        result: {
          success: false,
          message: errorMessage
        }
      }))

      toast({
        title: "❌ Error en upload",
        description: errorMessage,
        variant: "destructive"
      })
      onUploadError?.(errorMessage)
    }
  }, [uploadState.file, patientId, toast, onUploadSuccess, onUploadError])

  /**
   * Limpia el estado y permite nuevo upload
   */
  const handleReset = useCallback(() => {
    setUploadState({
      isUploading: false,
      progress: 0,
      file: null,
      preview: null,
      uploadId: null,
      result: null
    })
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileImage className="h-5 w-5" />
          Subir Radiografía
        </CardTitle>
        <CardDescription>
          Sube una imagen de radiografía para análisis. Formatos soportados: JPG, PNG, DICOM (máx. 10MB)
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        
        {/* Área de drag & drop */}
        {!uploadState.file && (
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragging 
                ? "border-primary bg-primary/5" 
                : "border-gray-300 hover:border-primary hover:bg-gray-50"
              }
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Arrastra tu radiografía aquí</h3>
            <p className="text-gray-600 mb-4">o haz click para seleccionar un archivo</p>
            <Badge variant="secondary">JPG, PNG, DICOM - Máx. 10MB</Badge>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/dicom,.dcm"
              onChange={handleInputChange}
              className="hidden"
            />
          </div>
        )}

        {/* Preview del archivo seleccionado */}
        {uploadState.file && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileImage className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium">{uploadState.file.file.name}</p>
                  <p className="text-sm text-gray-600">
                    {RadiographyService.formatFileSize(uploadState.file.file.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {uploadState.preview && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Abrir preview en modal o nueva ventana
                      window.open(uploadState.preview!, "_blank")
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  disabled={uploadState.isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Preview de imagen */}
            {uploadState.preview && (
              <div className="relative">
                <img
                  src={uploadState.preview}
                  alt="Preview de radiografía"
                  className="w-full max-w-md mx-auto rounded-lg border"
                  style={{ maxHeight: "300px", objectFit: "contain" }}
                />
              </div>
            )}
          </div>
        )}

        {/* Progreso de upload */}
        {uploadState.isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Subiendo radiografía...</span>
              <span className="text-sm text-gray-600">{uploadState.progress}%</span>
            </div>
            <Progress value={uploadState.progress} className="w-full" />
          </div>
        )}

        {/* Resultado del upload */}
        {uploadState.result && (
          <Alert className={uploadState.result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            <div className="flex items-center gap-2">
              {uploadState.result.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={uploadState.result.success ? "text-green-800" : "text-red-800"}>
                {uploadState.result.message}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Botones de acción */}
        <div className="flex items-center gap-3">
          {uploadState.file && !uploadState.result && (
            <Button
              onClick={handleUpload}
              disabled={uploadState.isUploading || !uploadState.file.isValid}
              className="flex-1"
            >
              {uploadState.isUploading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Subir Radiografía
                </>
              )}
            </Button>
          )}
          
          {(uploadState.result || uploadState.file) && (
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={uploadState.isUploading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Nuevo Upload
            </Button>
          )}
        </div>

        {/* Información adicional */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Los archivos se suben de forma segura y encriptada</p>
          <p>• Las radiografías serán analizadas automáticamente por IA</p>
          <p>• Recibirás una notificación cuando el análisis esté listo</p>
        </div>
      </CardContent>
    </Card>
  )
}