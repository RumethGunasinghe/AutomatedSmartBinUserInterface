import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  Trash2, 
  Battery, 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Wifi,
  WifiOff
} from 'lucide-react';

// Mock data for dashboard
const mockData = {
  totalBins: 24,
  activeBins: 22,
  fullBins: 3,
  lowBattery: 2,
  alerts: 5,
  bins: [
    { id: 1, name: 'Reception Area', fullness: 85, battery: 45, status: 'active', lastEmpty: '2 hours ago' },
    { id: 2, name: 'Conference Room A', fullness: 45, battery: 78, status: 'active', lastEmpty: '1 day ago' },
    { id: 3, name: 'Kitchen', fullness: 95, battery: 23, status: 'active', lastEmpty: '3 hours ago' },
    { id: 4, name: 'Office Floor 2', fullness: 67, battery: 89, status: 'active', lastEmpty: '4 hours ago' },
  ],
  recentActivity: [
    { id: 1, action: 'Bin emptied', bin: 'Reception Area', time: '2 hours ago' },
    { id: 2, action: 'Low battery alert', bin: 'Kitchen', time: '3 hours ago' },
    { id: 3, action: 'Bin full alert', bin: 'Conference Room B', time: '5 hours ago' },
    { id: 4, action: 'Scheduled collection', bin: 'Office Floor 2', time: '6 hours ago' },
  ]
};

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bins</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.totalBins}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{mockData.activeBins} active</span> • 
              <span className="text-red-600 ml-1">{mockData.totalBins - mockData.activeBins} offline</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Battery Status</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.lowBattery}</div>
            <p className="text-xs text-muted-foreground">
              Low battery alerts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Full Bins</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.fullBins}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.alerts}</div>
            <p className="text-xs text-muted-foreground">
              Unresolved issues
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bin Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Bin Status Overview</CardTitle>
            <CardDescription>Current status of all smart bins</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockData.bins.map((bin) => (
              <div key={bin.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {bin.status === 'active' ? (
                      <Wifi className="h-4 w-4 text-green-500" />
                    ) : (
                      <WifiOff className="h-4 w-4 text-red-500" />
                    )}
                    <span className="font-medium">{bin.name}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">{bin.fullness}% full</div>
                    <Progress value={bin.fullness} className="w-20 h-2" />
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium flex items-center">
                      <Battery className="h-3 w-3 mr-1" />
                      {bin.battery}%
                    </div>
                    <div className="text-xs text-muted-foreground">{bin.lastEmpty}</div>
                  </div>
                  
                  <Badge variant={bin.fullness > 80 ? 'destructive' : bin.battery < 30 ? 'secondary' : 'default'}>
                    {bin.fullness > 80 ? 'Full' : bin.battery < 30 ? 'Low Battery' : 'Normal'}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest events and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium">{activity.action}</div>
                    <div className="text-sm text-muted-foreground">{activity.bin}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Collections</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              +12% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Usage</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3 kWh</div>
            <p className="text-xs text-muted-foreground">
              -8% from last month
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}