"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileImage, X } from "lucide-react"

interface UploadRadiographyProps {
  onUploadSuccess: (record: any) => void
}

export function UploadRadiography({ onUploadSuccess }: UploadRadiographyProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [notes, setNotes] = useState("")

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("image/")) {
        setSelectedFile(file)
      }
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)

    // Simulate upload process
    setTimeout(() => {
      const newRecord = {
        id: Date.now().toString(),
        uploadDate: new Date().toISOString().split("T")[0],
        processedDate: null,
        validatedDate: null,
        status: "uploaded" as const,
        patientId: "P001",
        imageUrl: "/medical-radiography.jpg",
        doctorReport: null,
        doctorName: null,
        aiDiagnosis: null,
        notes,
      }

      onUploadSuccess(newRecord)
      setSelectedFile(null)
      setNotes("")
      setIsUploading(false)
    }, 2000)
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Upload Radiography</CardTitle>
        <CardDescription>Upload your radiography images for AI analysis and doctor review</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? "border-primary bg-primary/5"
              : selectedFile
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {selectedFile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <FileImage className="h-12 w-12 text-primary" />
              </div>
              <div>
                <p className="font-medium text-card-foreground">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedFile(null)} className="gap-2">
                <X className="h-4 w-4" />
                Remove
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <Upload className="h-12 w-12 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-medium text-card-foreground">Drop your radiography here</p>
                <p className="text-sm text-muted-foreground">or click to browse files</p>
              </div>
              <div>
                <Input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="file-upload" />
                <Label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer bg-transparent" asChild>
                    <span>Browse Files</span>
                  </Button>
                </Label>
              </div>
            </div>
          )}
        </div>

        {/* Notes Section */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-card-foreground">
            Additional Notes (Optional)
          </Label>
          <Textarea
            id="notes"
            placeholder="Add any relevant information about symptoms, pain location, etc."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="bg-background border-border text-foreground"
            rows={3}
          />
        </div>

        {/* Upload Button */}
        <Button onClick={handleUpload} disabled={!selectedFile || isUploading} className="w-full" size="lg">
          {isUploading ? "Uploading..." : "Upload Radiography"}
        </Button>

        {/* Info */}
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• Supported formats: JPEG, PNG, DICOM</p>
          <p>• Maximum file size: 50MB</p>
          <p>• Your images will be processed by AI and reviewed by qualified doctors</p>
        </div>
      </CardContent>
    </Card>
  )
}
