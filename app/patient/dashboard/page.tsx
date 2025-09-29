"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileImage, Eye, Clock, CheckCircle } from "lucide-react"
import { PatientHeader } from "@/components/patient-header"
import { UploadRadiography } from "@/components/upload-radiography"
import { RadiographyHistory } from "@/components/radiography-history"
import { RadiographyDetail } from "@/components/radiography-detail"

// Type definition for radiography records
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

// Mock data for radiography records
const mockRecords: RadiographyRecord[] = [
  {
    id: "1",
    uploadDate: "2024-01-15",
    processedDate: "2024-01-16",
    validatedDate: "2024-01-17",
    status: "validated",
    patientId: "P001",
    imageUrl: "/chest-x-ray-radiography.jpg",
    doctorReport:
      "Normal chest X-ray. No signs of pneumonia or other abnormalities. Heart size and lung fields appear normal.",
    doctorName: "Dr. Sarah Johnson",
    aiDiagnosis: "No abnormalities detected",
  },
  {
    id: "2",
    uploadDate: "2024-01-10",
    processedDate: "2024-01-11",
    validatedDate: null,
    status: "processed",
    patientId: "P001",
    imageUrl: "/knee-x-ray-radiography.jpg",
    doctorReport: null,
    doctorName: null,
    aiDiagnosis: "Possible minor joint space narrowing",
  },
  {
    id: "3",
    uploadDate: "2024-01-08",
    processedDate: null,
    validatedDate: null,
    status: "uploaded",
    patientId: "P001",
    imageUrl: "/spine-x-ray-radiography.jpg",
    doctorReport: null,
    doctorName: null,
    aiDiagnosis: null,
  },
]

export default function PatientDashboard() {
  const [selectedRecord, setSelectedRecord] = useState<RadiographyRecord | null>(null)
  const [records, setRecords] = useState<RadiographyRecord[]>(mockRecords)

  const handleUploadSuccess = (newRecord: any) => {
    setRecords([newRecord, ...records])
  }

  if (selectedRecord) {
    return <RadiographyDetail record={selectedRecord} onBack={() => setSelectedRecord(null)} />
  }

  return (
    <div className="min-h-screen bg-background">
      <PatientHeader />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Patient Dashboard</h1>
          <p className="text-muted-foreground">Manage your radiography records and view results</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Total Records</CardTitle>
                  <FileImage className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">{records.length}</div>
                  <p className="text-xs text-muted-foreground">Radiography records</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Validated</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">
                    {records.filter((r) => r.status === "validated").length}
                  </div>
                  <p className="text-xs text-muted-foreground">Doctor approved</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">
                    {records.filter((r) => r.status !== "validated").length}
                  </div>
                  <p className="text-xs text-muted-foreground">Awaiting review</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Records */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Recent Records</CardTitle>
                <CardDescription>Your latest radiography submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {records.slice(0, 3).map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => setSelectedRecord(record)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <FileImage className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground">Record #{record.id}</p>
                          <p className="text-sm text-muted-foreground">
                            Uploaded {new Date(record.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            record.status === "validated"
                              ? "default"
                              : record.status === "processed"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {record.status}
                        </Badge>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload">
            <UploadRadiography onUploadSuccess={handleUploadSuccess} />
          </TabsContent>

          <TabsContent value="history">
            <RadiographyHistory records={records} onSelectRecord={setSelectedRecord} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
