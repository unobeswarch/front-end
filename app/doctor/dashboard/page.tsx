"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileImage, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { DoctorHeader } from "@/components/doctor-header"
import { CasesList } from "@/components/cases-list"
import { CaseValidation } from "@/components/case-validation"

// Mock data for pending cases
const mockCases = [
  {
    id: "1",
    patientId: "P001",
    patientName: "John Doe",
    uploadDate: "2024-01-15",
    processedDate: "2024-01-16",
    status: "processed" as const,
    imageUrl: "/chest-x-ray-radiography.jpg",
    aiDiagnosis: "No abnormalities detected. Normal chest X-ray with clear lung fields and normal heart size.",
    aiConfidence: 0.92,
    bodyPart: "Chest",
    urgency: "routine" as const,
    patientAge: 45,
    patientGender: "Male",
  },
  {
    id: "2",
    patientId: "P002",
    patientName: "Jane Smith",
    uploadDate: "2024-01-14",
    processedDate: "2024-01-15",
    status: "processed" as const,
    imageUrl: "/knee-x-ray-radiography.jpg",
    aiDiagnosis: "Possible minor joint space narrowing in the medial compartment. Recommend clinical correlation.",
    aiConfidence: 0.78,
    bodyPart: "Knee",
    urgency: "routine" as const,
    patientAge: 62,
    patientGender: "Female",
  },
  {
    id: "3",
    patientId: "P003",
    patientName: "Robert Johnson",
    uploadDate: "2024-01-13",
    processedDate: "2024-01-14",
    status: "processed" as const,
    imageUrl: "/spine-x-ray-radiography.jpg",
    aiDiagnosis: "Mild degenerative changes in L4-L5. No acute fractures or dislocations identified.",
    aiConfidence: 0.85,
    bodyPart: "Spine",
    urgency: "routine" as const,
    patientAge: 58,
    patientGender: "Male",
  },
  {
    id: "4",
    patientId: "P004",
    patientName: "Maria Garcia",
    uploadDate: "2024-01-12",
    processedDate: "2024-01-13",
    status: "processed" as const,
    imageUrl: "/chest-x-ray-radiography.jpg",
    aiDiagnosis:
      "Suspicious opacity in right lower lobe. Recommend immediate clinical evaluation and possible CT scan.",
    aiConfidence: 0.89,
    bodyPart: "Chest",
    urgency: "urgent" as const,
    patientAge: 67,
    patientGender: "Female",
  },
]

export default function DoctorDashboard() {
  const [selectedCase, setSelectedCase] = useState<(typeof mockCases)[0] | null>(null)
  const [cases, setCases] = useState(mockCases)

  const handleCaseValidation = (caseId: string, validation: any) => {
    setCases(cases.filter((c) => c.id !== caseId))
    setSelectedCase(null)
  }

  if (selectedCase) {
    return <CaseValidation case={selectedCase} onBack={() => setSelectedCase(null)} onValidate={handleCaseValidation} />
  }

  const urgentCases = cases.filter((c) => c.urgency === "urgent")
  const routineCases = cases.filter((c) => c.urgency === "routine")

  return (
    <div className="min-h-screen bg-background">
      <DoctorHeader />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Doctor Dashboard</h1>
          <p className="text-muted-foreground">Review and validate AI-analyzed radiography cases</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="urgent">Urgent Cases</TabsTrigger>
            <TabsTrigger value="routine">Routine Cases</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Pending Cases</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">{cases.length}</div>
                  <p className="text-xs text-muted-foreground">Awaiting validation</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Urgent</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{urgentCases.length}</div>
                  <p className="text-xs text-muted-foreground">Require immediate attention</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Routine</CardTitle>
                  <FileImage className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">{routineCases.length}</div>
                  <p className="text-xs text-muted-foreground">Standard review</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Validated Today</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">12</div>
                  <p className="text-xs text-muted-foreground">Cases completed</p>
                </CardContent>
              </Card>
            </div>

            {/* Urgent Cases Alert */}
            {urgentCases.length > 0 && (
              <Card className="bg-destructive/5 border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-destructive flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Urgent Cases Require Attention
                  </CardTitle>
                  <CardDescription>
                    {urgentCases.length} case{urgentCases.length > 1 ? "s" : ""} marked as urgent by AI analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {urgentCases.slice(0, 2).map((case_) => (
                      <div
                        key={case_.id}
                        className="flex items-center justify-between p-3 bg-background rounded-lg border border-destructive/20 cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => setSelectedCase(case_)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                            <FileImage className="h-5 w-5 text-destructive" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {case_.patientName} - {case_.bodyPart}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Patient ID: {case_.patientId} • {new Date(case_.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant="destructive">Urgent</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Cases */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Recent Cases</CardTitle>
                <CardDescription>Latest radiography cases awaiting your review</CardDescription>
              </CardHeader>
              <CardContent>
                <CasesList cases={cases.slice(0, 5)} onSelectCase={setSelectedCase} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="urgent">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Urgent Cases
                </CardTitle>
                <CardDescription>Cases requiring immediate medical attention</CardDescription>
              </CardHeader>
              <CardContent>
                <CasesList cases={urgentCases} onSelectCase={setSelectedCase} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="routine">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Routine Cases</CardTitle>
                <CardDescription>Standard radiography cases for review</CardDescription>
              </CardHeader>
              <CardContent>
                <CasesList cases={routineCases} onSelectCase={setSelectedCase} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
