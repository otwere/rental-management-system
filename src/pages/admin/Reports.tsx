import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Download,
  Printer,
  Filter,
  Calendar,
  FileText,
  BarChart4,
  PieChart,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatFinancialAmount, calculateProfitMargin } from "@/utils/financialUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample data
const revenueData = [
  { name: 'Jan', value: 12400 },
  { name: 'Feb', value: 14800 },
  { name: 'Mar', value: 13200 },
  { name: 'Apr', value: 15600 },
  { name: 'May', value: 14900 },
  { name: 'Jun', value: 16800 },
];

const occupancyData = [
  { name: 'Jan', rate: 82 },
  { name: 'Feb', rate: 85 },
  { name: 'Mar', rate: 86 },
  { name: 'Apr', rate: 89 },
  { name: 'May', rate: 87 },
  { name: 'Jun', rate: 90 },
];

const maintenanceData = [
  { name: 'Plumbing', value: 4500 },
  { name: 'Electrical', value: 3200 },
  { name: 'HVAC', value: 7800 },
  { name: 'Structural', value: 2100 },
  { name: 'Appliances', value: 3400 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const expenseData = [
  { name: 'Maintenance', value: 21000 },
  { name: 'Utilities', value: 15000 },
  { name: 'Salaries', value: 35000 },
  { name: 'Marketing', value: 8000 },
  { name: 'Insurance', value: 12000 },
];

export default function AdminReports() {
  const [timeFrame, setTimeFrame] = useState("6mo");
  const [reportType, setReportType] = useState("financial");

  const handleExportData = () => {
    // In a real implementation, this would generate a CSV/PDF
    alert("Exporting data...");
  };

  const handlePrintReport = () => {
    window.print();
  };

  // Calculate financial metrics
  const netRevenue = revenueData.reduce((sum, item) => sum + item.value, 0);
  const totalExpenses = expenseData.reduce((sum, item) => sum + item.value, 0);
  const profitMargin = calculateProfitMargin(netRevenue, totalExpenses);

  return (
    <DashboardLayout requiredPermission="view:analytics">
      <div className="space-y-6 print:m-6">
        <div className="flex items-center justify-between flex-wrap gap-4 print:hidden">
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <div className="flex gap-2">
            <Select value={timeFrame} onValueChange={setTimeFrame}>
              <SelectTrigger className="w-[140px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Time Frame" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1mo">Last Month</SelectItem>
                <SelectItem value="3mo">Last 3 Months</SelectItem>
                <SelectItem value="6mo">Last 6 Months</SelectItem>
                <SelectItem value="1yr">Last Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            
            <Button onClick={handlePrintReport} variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            
            <Button onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Report Type Selector */}
        <Tabs defaultValue="financial" onValueChange={setReportType} className="print:hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="financial">
              <BarChart4 className="h-4 w-4 mr-2" />
              Financial Reports
            </TabsTrigger>
            <TabsTrigger value="occupancy">
              <PieChart className="h-4 w-4 mr-2" />
              Occupancy Analysis
            </TabsTrigger>
            <TabsTrigger value="maintenance">
              <FileText className="h-4 w-4 mr-2" />
              Maintenance Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="financial" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>Real-time financial metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Net Revenue</p>
                    <p className="text-2xl font-bold">{formatFinancialAmount(netRevenue)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                    <p className="text-2xl font-bold">{formatFinancialAmount(totalExpenses)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Profit Margin</p>
                    <p className="text-2xl font-bold">{profitMargin.toFixed(2)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Monthly revenue analysis for the last 6 months</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis 
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip 
                      formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      name="Revenue"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Expense Breakdown</CardTitle>
                  <CardDescription>Distribution of expenses by category</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={expenseData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {expenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Summary</CardTitle>
                  <CardDescription>Key financial metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2 text-muted-foreground">Total Revenue</h3>
                      <p className="text-2xl font-bold">{formatFinancialAmount(87700)}</p>
                      <p className="text-sm text-green-600">+12% from previous period</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2 text-muted-foreground">Total Expenses</h3>
                      <p className="text-2xl font-bold">{formatFinancialAmount(91000)}</p>
                      <p className="text-sm text-red-600">+5% from previous period</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2 text-muted-foreground">Net Profit</h3>
                      <p className="text-2xl font-bold">{formatFinancialAmount(87700 - 91000)}</p>
                      <p className="text-sm text-muted-foreground">~3.6% loss ratio</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Occupancy Reports Content */}
          <TabsContent value="occupancy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Occupancy Rate Trends</CardTitle>
                <CardDescription>Monthly occupancy percentage analysis</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={occupancyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Occupancy Rate']} />
                    <Legend />
                    <Bar dataKey="rate" fill="#8884d8" name="Occupancy Rate" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Property Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Downtown Apartments</span>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full" style={{ width: '92%' }}></div>
                        </div>
                        <span className="ml-2 text-sm font-medium">92%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Westside Complex</span>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full" style={{ width: '87%' }}></div>
                        </div>
                        <span className="ml-2 text-sm font-medium">87%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Eastside Residences</span>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full" style={{ width: '78%' }}></div>
                        </div>
                        <span className="ml-2 text-sm font-medium">78%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Parkview Heights</span>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-red-500 h-full" style={{ width: '65%' }}></div>
                        </div>
                        <span className="ml-2 text-sm font-medium">65%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vacancy Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2 text-muted-foreground">Average Vacancy Period</h3>
                      <p className="text-2xl font-bold">18 days</p>
                      <p className="text-sm text-green-600">-3 days from last year</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2 text-muted-foreground">Tenant Turnover Rate</h3>
                      <p className="text-2xl font-bold">14%</p>
                      <p className="text-sm text-red-600">+2% from last year</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2 text-muted-foreground">New Lease Signings</h3>
                      <p className="text-2xl font-bold">28</p>
                      <p className="text-sm text-green-600">+5 from last quarter</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Maintenance Reports Content */}
          <TabsContent value="maintenance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Cost Breakdown</CardTitle>
                <CardDescription>Distribution of maintenance expenses by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={maintenanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Cost']} />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance Request Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Completed Requests</span>
                      <span className="font-medium">42</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Pending Requests</span>
                      <span className="font-medium">15</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Overdue Requests</span>
                      <span className="font-medium text-red-500">7</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Response Time</span>
                      <span className="font-medium">1.5 days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Resolution Time</span>
                      <span className="font-medium">3.2 days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Critical Maintenance Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-red-50 p-3 rounded-md border border-red-200">
                      <div className="flex justify-between">
                        <span className="font-medium text-red-700">Plumbing Leak - Unit 205</span>
                        <span className="text-sm text-red-700">High</span>
                      </div>
                      <p className="text-sm text-red-600 mt-1">Reported 2 days ago</p>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                      <div className="flex justify-between">
                        <span className="font-medium text-amber-700">HVAC Repair - Unit 118</span>
                        <span className="text-sm text-amber-700">Medium</span>
                      </div>
                      <p className="text-sm text-amber-600 mt-1">Reported 3 days ago</p>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                      <div className="flex justify-between">
                        <span className="font-medium text-amber-700">Electrical Issue - Unit 312</span>
                        <span className="text-sm text-amber-700">Medium</span>
                      </div>
                      <p className="text-sm text-amber-600 mt-1">Reported 1 day ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Report Preview for Print */}
        <div className="hidden print:block space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Rental Portal {reportType === "financial" ? "Financial" : reportType === "occupancy" ? "Occupancy" : "Maintenance"} Report</h1>
            <p className="text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
          </div>
          
          {reportType === "financial" && (
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `$${value}`} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid gap-6 grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Expense Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={expenseData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {expenseData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Financial Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium mb-2 text-muted-foreground">Total Revenue</h3>
                        <p className="text-2xl font-bold">{formatFinancialAmount(87700)}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2 text-muted-foreground">Total Expenses</h3>
                        <p className="text-2xl font-bold">{formatFinancialAmount(91000)}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2 text-muted-foreground">Net Profit</h3>
                        <p className="text-2xl font-bold">{formatFinancialAmount(87700 - 91000)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
