import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  X, 
  Search,
  Filter,
  Bell,
  BellOff,
  Trash2,
  Battery,
  Wifi,
  Clock
} from 'lucide-react';

// Mock alerts data
const mockAlerts = [
  {
    id: 1,
    type: 'critical',
    title: 'Bin Overflow Alert',
    message: 'Kitchen bin has exceeded 95% capacity',
    binName: 'Kitchen',
    timestamp: '2024-01-07 15:30:00',
    status: 'active',
    acknowledged: false
  },
  {
    id: 2,
    type: 'warning',
    title: 'Low Battery Warning',
    message: 'Kitchen bin battery level is at 23%',
    binName: 'Kitchen',
    timestamp: '2024-01-07 14:15:00',
    status: 'active',
    acknowledged: false
  },
  {
    id: 3,
    type: 'info',
    title: 'Scheduled Collection Complete',
    message: 'Reception Area bin has been successfully emptied',
    binName: 'Reception Area',
    timestamp: '2024-01-07 14:30:00',
    status: 'resolved',
    acknowledged: true
  },
  {
    id: 4,
    type: 'error',
    title: 'Connection Lost',
    message: 'Storage Room bin is not responding to commands',
    binName: 'Storage Room',
    timestamp: '2024-01-07 13:45:00',
    status: 'active',
    acknowledged: false
  },
  {
    id: 5,
    type: 'warning',
    title: 'Maintenance Due',
    message: 'Conference Room A bin requires weekly maintenance',
    binName: 'Conference Room A',
    timestamp: '2024-01-07 12:00:00',
    status: 'active',
    acknowledged: true
  },
  {
    id: 6,
    type: 'info',
    title: 'System Update',
    message: 'Firmware update completed successfully for Office Floor 2',
    binName: 'Office Floor 2',
    timestamp: '2024-01-07 10:15:00',
    status: 'resolved',
    acknowledged: true
  },
  {
    id: 7,
    type: 'critical',
    title: 'Sensor Malfunction',
    message: 'Fullness sensor reporting inconsistent readings',
    binName: 'Conference Room A',
    timestamp: '2024-01-07 09:30:00',
    status: 'active',
    acknowledged: false
  },
  {
    id: 8,
    type: 'warning',
    title: 'High Usage Detected',
    message: 'Reception Area bin filling faster than normal',
    binName: 'Reception Area',
    timestamp: '2024-01-07 08:45:00',
    status: 'resolved',
    acknowledged: true
  }
];

export function Alerts() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      default: return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getAlertBadge = (type: string) => {
    switch (type) {
      case 'critical': return <Badge variant="destructive">Critical</Badge>;
      case 'error': return <Badge variant="destructive">Error</Badge>;
      case 'warning': return <Badge variant="secondary">Warning</Badge>;
      case 'info': return <Badge variant="outline">Info</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="destructive">Active</Badge>;
      case 'resolved': return <Badge variant="outline">Resolved</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };

  const handleAcknowledge = (id: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, acknowledged: true } : alert
    ));
  };

  const handleResolve = (id: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, status: 'resolved' } : alert
    ));
  };

  const handleDismiss = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.binName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || alert.type === filterType;
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  const criticalAlerts = activeAlerts.filter(alert => alert.type === 'critical' || alert.type === 'error');
  const unacknowledgedAlerts = activeAlerts.filter(alert => !alert.acknowledged);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2>Alerts & Notifications</h2>
          <p className="text-muted-foreground">Monitor system alerts and notifications</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Bell className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              Requiring attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              High priority issues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unacknowledged</CardTitle>
            <BellOff className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unacknowledgedAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              Need acknowledgment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Today</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
            <p className="text-xs text-muted-foreground">
              All alerts today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Feed</CardTitle>
          <CardDescription>
            Showing {filteredAlerts.length} of {alerts.length} alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No alerts match your current filters
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-4 border rounded-lg ${
                    !alert.acknowledged && alert.status === 'active' ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getAlertIcon(alert.type)}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{alert.title}</h4>
                          {getAlertBadge(alert.type)}
                          {getStatusBadge(alert.status)}
                          {!alert.acknowledged && alert.status === 'active' && (
                            <Badge variant="outline" className="text-xs">Unread</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Trash2 className="w-3 h-3 mr-1" />
                            {alert.binName}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(alert.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {!alert.acknowledged && alert.status === 'active' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAcknowledge(alert.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Acknowledge
                        </Button>
                      )}
                      
                      {alert.status === 'active' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResolve(alert.id)}
                        >
                          Resolve
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDismiss(alert.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}