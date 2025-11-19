import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  Trash2,
  Clock,
  Bell,
  BellOff,
  Search
} from 'lucide-react';
import { differenceInHours, differenceInDays, parseISO } from 'date-fns';
import { useBins } from '../../useBins'; // adjust path if needed
import { Bin } from '../types/bin'; // adjust path if needed

const formatTimestamp = (timestamp: string) => {
  const date = parseISO(timestamp);
  const now = new Date();
  const hoursAgo = differenceInHours(now, date);
  const daysAgo = differenceInDays(now, date);
  if (hoursAgo < 24) return `${hoursAgo} hour${hoursAgo !== 1 ? 's' : ''} ago`;
  return `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`;
};

interface AlertItem {
  id: string | number;
  type: string;
  title: string;
  message: string;
  binName: string;
  timestamp: string;
  status: 'active' | 'resolved';
  acknowledged: boolean;
}

export function Alerts() {
  const { bins } = useBins();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const newAlerts: AlertItem[] = [];

    bins.forEach(bin => {
      if (bin.fill_level > 80) {
        newAlerts.push({
          id: `fill-${bin.binId}`,
          type: 'critical',
          title: 'Bin Overflow Alert',
          message: `${bin.binId} has exceeded ${bin.fill_level.toFixed(0)}% capacity`,
          binName: bin.binId,
          timestamp: bin.timestamp,
          status: 'active',
          acknowledged: false
        });
      }

      if (bin.battery < 30) {
        newAlerts.push({
          id: `battery-${bin.binId}`,
          type: 'warning',
          title: 'Low Battery Warning',
          message: `${bin.binId} battery level is at ${bin.battery}%`,
          binName: bin.binId,
          timestamp: bin.timestamp,
          status: 'active',
          acknowledged: false
        });
      }

      if (bin.alerts) {
        let binAlerts: any[] = [];
        try {
          binAlerts = typeof bin.alerts === 'string' ? JSON.parse(bin.alerts) : bin.alerts;
        } catch (err) {
          console.error('Failed to parse bin.alerts:', err);
        }

        binAlerts.forEach((alert: any, index: number) => {
          newAlerts.push({
            id: `mc-${bin.binId}-${index}`,
            type: alert.type || 'info',
            title: alert.title || 'Microcontroller Alert',
            message: alert.message,
            binName: bin.binId,
            timestamp: alert.timestamp || bin.timestamp,
            status: alert.status || 'active',
            acknowledged: alert.acknowledged || false
          });
        });
      }
    });

    newAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setAlerts(newAlerts);
  }, [bins]);

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

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alert.binName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || alert.type === filterType;
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8"
              />
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
              filteredAlerts.map(alert => (
                <div 
                  key={alert.id} 
                  className={`p-4 border rounded-lg ${
                    !alert.acknowledged && alert.status === 'active' ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' : ''
                  }`}
                >
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
                          {formatTimestamp(alert.timestamp)}
                        </span>
                      </div>
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
