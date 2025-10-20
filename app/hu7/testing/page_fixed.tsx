"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, FileText, User, Calendar, Stethoscope } from "lucide-react"
// import { RadiographDetailTesting } from "@/components/radiograph-detail-testing"

// Mock test data to validate HU7 functionality without real backend
const mockCases = [
  { id: "TST001", status: "procesado" },
  { id: "TST002", status: "validado" },
  { id: "TST003", status: "pendiente" },
  { id: "e9630d59-7103-4340-93d6-0faa51bc31e1", status: "procesado" },
  { id: "7c759ae7-5427-4d91-b080-d568e690a284", status: "procesado" },
  { id: "real-case-1", status: "validado" },
  { id: "real-case-2", status: "procesado" },
]

export default function HU7TestingPage() {
  const [selectedCaseId, setSelectedCaseId] = useState("TST001")
  const [useRealBackend, setUseRealBackend] = useState(false)
  const [customCaseId, setCustomCaseId] = useState("")

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🧪 HU7 Testing Environment</h1>
        <p className="text-gray-600">
          Test radiograph detail functionality with both mock and real backend data
        </p>
      </div>

      <Tabs defaultValue="controls" className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="controls">🎛️ Test Controls</TabsTrigger>
          <TabsTrigger value="backend">🔧 Backend Info</TabsTrigger>
        </TabsList>

        <TabsContent value="controls">
          <Card>
            <CardHeader>
              <CardTitle>Test Configuration</CardTitle>
              <CardDescription>
                Choose test mode and select cases to validate HU7 functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Backend Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold">Backend Mode</h3>
                  <p className="text-sm text-gray-600">Switch between mock data and real GraphQL backend</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={!useRealBackend ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setUseRealBackend(false)}
                  >
                    🎭 Mock Data
                  </Button>
                  <Button
                    variant={useRealBackend ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setUseRealBackend(true)}
                  >
                    🔗 Real Backend
                  </Button>
                  <Badge variant={useRealBackend ? "default" : "secondary"}>
                    {useRealBackend ? "GraphQL localhost:8080" : "Testing Mode"}
                  </Badge>
                </div>
              </div>

              {/* Case Selection */}
              <div className="space-y-3">
                <h3 className="font-semibold">Quick Test Cases</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {mockCases.map(testCase => (
                    <Button
                      key={testCase.id}
                      variant={selectedCaseId === testCase.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCaseId(testCase.id)}
                      className="text-xs flex flex-col items-center p-2 h-auto"
                    >
                      <span className="font-mono">{testCase.id.substring(0, 8)}...</span>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {testCase.status}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Case ID */}
              <div className="space-y-3">
                <h3 className="font-semibold">Custom Case Testing</h3>
                <div className="flex items-center space-x-2">
                  <Input
                    value={customCaseId}
                    onChange={(e) => setCustomCaseId(e.target.value)}
                    placeholder="Enter full case ID (e.g., e9630d59-7103-4340-93d6-0faa51bc31e1)..."
                    className="flex-1 font-mono text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      if (customCaseId.trim()) {
                        setSelectedCaseId(customCaseId.trim())
                      }
                    }}
                    disabled={!customCaseId.trim()}
                  >
                    Test Custom ID
                  </Button>
                </div>
              </div>

              {/* Current Selection Info */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Current Test Configuration
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      Testing Case ID: <code className="bg-blue-100 px-1 rounded text-xs">{selectedCaseId}</code>
                      {' '}using {' '}
                      <span className={useRealBackend ? "font-semibold text-green-700" : "font-semibold text-gray-700"}>
                        {useRealBackend ? "Real Backend (GraphQL)" : "Mock Data"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backend">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Mock Mode Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">🎭 Mock Mode</CardTitle>
                <CardDescription>Testing with hardcoded data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <Badge variant="secondary">Always Available</Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>• Uses predefined test data</p>
                    <p>• Perfect for UI/UX testing</p>
                    <p>• No backend dependencies</p>
                    <p>• Reliable for development</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Real Backend Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">🔗 Real Backend Mode</CardTitle>
                <CardDescription>Connect to actual GraphQL API</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">GraphQL Endpoint</span>
                    <Badge variant={useRealBackend ? "default" : "secondary"}>
                      {useRealBackend ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">http://localhost:8080/query</code>
                    <span className="text-sm text-gray-600">GraphQL backend endpoint</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Connects to Business Logic service</p>
                  <p>• Requires MongoDB data</p>
                  <p>• JWT authentication needed</p>
                  <p>• Falls back to mock if unavailable</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* HU7 Component */}
      <div className="border rounded-lg overflow-hidden">
        <div className="p-8 text-center text-gray-500">
          <p>RadiographDetailTesting component not available</p>
          <p className="text-sm">Selected Case: {selectedCaseId}</p>
          <p className="text-sm">Mode: {useRealBackend ? "Real Backend" : "Mock Data"}</p>
        </div>
      </div>
    </div>
  )
}