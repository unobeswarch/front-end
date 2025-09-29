"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FileImage, Search, Calendar, Eye } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface RadiographyRecord {
  id: string
  uploadDate: string
  processedDate: string | null
  validatedDate: string | null
  status: "uploaded" | "processed" | "validated"
  patientId: string
  imageUrl: string
  doctorReport: string | null
  doctorName: string | null
  aiDiagnosis: string | null
}

interface RadiographyHistoryProps {
  records: RadiographyRecord[]
  onSelectRecord: (record: RadiographyRecord) => void
}

export function RadiographyHistory({ records, onSelectRecord }: RadiographyHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const filteredRecords = records.filter(
    (record) =>
      record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "validated":
        return "default"
      case "processed":
        return "secondary"
      case "uploaded":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "validated":
        return "✓"
      case "processed":
        return "⏳"
      case "uploaded":
        return "📤"
      default:
        return "?"
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Radiography History</CardTitle>
        <CardDescription>View all your radiography records and their current status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background border-border text-foreground"
          />
        </div>

        {/* Records List */}
        <div className="space-y-4">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-8">
              <FileImage className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No records found</p>
            </div>
          ) : (
            filteredRecords.map((record) => (
              <div
                key={record.id}
                className="border border-border rounded-lg p-4 hover:bg-accent cursor-pointer transition-colors"
                onClick={() => onSelectRecord(record)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <FileImage className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-card-foreground">Record #{record.id}</p>
                        <Badge variant={getStatusColor(record.status)}>
                          {getStatusIcon(record.status)} {record.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Uploaded: {new Date(record.uploadDate).toLocaleDateString()}
                        </div>
                        {record.processedDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Processed: {new Date(record.processedDate).toLocaleDateString()}
                          </div>
                        )}
                        {record.validatedDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Validated: {new Date(record.validatedDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => router.push(`/patient/radiograph/${record.id}`)}
                      title="Ver detalles completos (HU7)"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
