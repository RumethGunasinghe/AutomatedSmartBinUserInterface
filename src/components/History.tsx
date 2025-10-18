import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart as PieChartIcon,
  Calendar,
  Download
} from 'lucide-react';
import { Button } from './ui/button';

// Mock historical data
const weeklyCollections = [
  { day: 'Mon', collections: 45, efficiency: 92 },
  { day: 'Tue', collections: 52, efficiency: 88 },
  { day: 'Wed', collections: 48, efficiency: 95 },
  { day: 'Thu', collections: 61, efficiency: 87 },
  { day: 'Fri', collections: 55, efficiency: 91 },
  { day: 'Sat', collections: 23, efficiency: 96 },
  { day: 'Sun', collections: 18, efficiency: 94 }
];

const monthlyUsage = [
  { month: 'Jan', collections: 1450, fullBins: 89, alerts: 23 },
  { month: 'Feb', collections: 1320, fullBins: 76, alerts: 18 },
  { month: 'Mar', collections: 1580, fullBins: 103, alerts: 31 },
  { month: 'Apr', collections: 1490, fullBins: 92, alerts: 25 },
  { month: 'May', collections: 1650, fullBins: 108, alerts: 28 },
  { month: 'Jun', collections: 1720, fullBins: 115, alerts: 33 }
];

const binUsageDistribution = [
  { name: 'Reception Area', collections: 245, percentage: 18.5 },
  { name: 'Kitchen', collections: 312, percentage: 23.5 },
  { name: 'Office Floor 2', collections: 198, percentage: 14.9 },
  { name: 'Conference Room A', collections: 156, percentage: 11.8 },
  { name: 'Conference Room B', collections: 143, percentage: 10.8 },
  { name: 'Storage Room', collections: 89, percentage: 6.7 },
  { name: 'Others', collections: 185, percentage: 13.8 }
];

const energyUsage = [
  { hour: '00:00', usage: 2.1 },
  { hour: '04:00', usage: 1.8 },
  { hour: '08:00', usage: 3.2 },
  { hour: '12:00', usage: 4.1 },
  { hour: '16:00', usage: 3.8 },
  { hour: '20:00', usage: 2.9 }
];

const alertTrends = [
  { week: 'Week 1', critical: 5, warning: 12, info: 23 },
  { week: 'Week 2', critical: 3, warning: 8, info: 19 },
  { week: 'Week 3', critical: 7, warning: 15, info: 31 },
  { week: 'Week 4', critical: 2, warning: 6, info: 17 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export function History() {
  const [timeRange, setTimeRange] = useState('week');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-md">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2>Analytics & History</h2>
          <p className="text-muted-foreground">Historical data and usage trends</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="quarter">Last 3 months</SelectItem>
              <SelectItem value="year">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,847</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Fill Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">73.2%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">-2.1%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91.4%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3.2%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Saved</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.5 kWh</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">-8%</span> consumption vs manual
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="collections" className="space-y-4">
        <TabsList>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="usage">Usage Distribution</TabsTrigger>
          <TabsTrigger value="energy">Energy Usage</TabsTrigger>
          <TabsTrigger value="alerts">Alert Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="collections" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Collections & Efficiency</CardTitle>
                <CardDescription>Daily collection count and efficiency percentage</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyCollections}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="collections" fill="#0088FE" name="Collections" />
                    <Line yAxisId="right" dataKey="efficiency" stroke="#00C49F" name="Efficiency %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>6-month collection and alert history</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyUsage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="collections" stroke="#0088FE" name="Collections" />
                    <Line type="monotone" dataKey="fullBins" stroke="#FF8042" name="Full Bin Events" />
                    <Line type="monotone" dataKey="alerts" stroke="#FFBB28" name="Alerts" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bin Usage Distribution</CardTitle>
                <CardDescription>Collection frequency by location</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={binUsageDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="collections"
                    >
                      {binUsageDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Bins</CardTitle>
                <CardDescription>Bins with highest collection efficiency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {binUsageDistribution
                    .sort((a, b) => b.collections - a.collections)
                    .slice(0, 5)
                    .map((bin, index) => (
                      <div key={bin.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground text-sm font-medium">{index + 1}</span>
                          </div>
                          <div>
                            <div className="font-medium">{bin.name}</div>
                            <div className="text-sm text-muted-foreground">{bin.collections} collections</div>
                          </div>
                        </div>
                        <Badge variant="outline">{bin.percentage}%</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="energy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Energy Usage Pattern</CardTitle>
              <CardDescription>24-hour energy consumption profile</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={energyUsage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="usage" stroke="#00C49F" fill="#00C49F" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Trends</CardTitle>
              <CardDescription>Weekly breakdown of alert types</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={alertTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="critical" stackId="a" fill="#FF8042" name="Critical" />
                  <Bar dataKey="warning" stackId="a" fill="#FFBB28" name="Warning" />
                  <Bar dataKey="info" stackId="a" fill="#00C49F" name="Info" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity Log</CardTitle>
          <CardDescription>Latest system events and actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: '2024-01-07 15:30', action: 'Collection completed', bin: 'Kitchen', user: 'System' },
              { time: '2024-01-07 14:45', action: 'Alert acknowledged', bin: 'Reception Area', user: 'John Smith' },
              { time: '2024-01-07 14:30', action: 'Manual empty triggered', bin: 'Conference Room A', user: 'Sarah Johnson' },
              { time: '2024-01-07 13:15', action: 'Maintenance completed', bin: 'Office Floor 2', user: 'Mike Davis' },
              { time: '2024-01-07 12:00', action: 'Schedule updated', bin: 'Storage Room', user: 'Lisa Chen' }
            ].map((log, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">{log.action}</div>
                    <div className="text-sm text-muted-foreground">{log.bin} • by {log.user}</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">{log.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}