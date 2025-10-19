import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Trash2, MoreVertical, Activity, AlertTriangle, TrendingUp, TrendingDown, Send, Battery, Wifi, WifiOff } from 'lucide-react';
import { useBins } from '../../useBins';
import { Bin } from '../types/bin';
import { differenceInHours, differenceInDays, parseISO } from 'date-fns';

export function Dashboard() {
  const bins = useBins(); // live bins from backend
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null);
  const [isCommandDialogOpen, setIsCommandDialogOpen] = useState(false);

  // Calculate stats
  const totalBins = bins.length;
  const activeBins = bins.filter(b => b.battery > 0).length;
  const fullBins = bins.filter(b => b.fill_level > 80).length;
  const lowBattery = bins.filter(b => b.battery > 0 && b.battery < 30).length;
  const alerts = bins.filter(b => b.alerts !== null && b.alerts !== '').length;

  const handleEmptyCommand = async (bin: Bin) => {
    try {
      await fetch('http://localhost:3000/api/send-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ binId: bin.binId, command: 'empty_now' }),
      });
      console.log(`Empty command sent to ${bin.binId}`);
    } catch (err) {
      console.error('Error sending command:', err);
    }
  };

  const getLastEmptyText = (timestamp: string) => {
    const date = parseISO(timestamp);
    const now = new Date();
    const hoursAgo = differenceInHours(now, date);
    const daysAgo = differenceInDays(now, date);
    if (hoursAgo < 24) return `${hoursAgo} hour${hoursAgo !== 1 ? 's' : ''} ago`;
    return `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`;
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Bins</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBins}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{activeBins} active</span> • 
              <span className="text-red-600 ml-1">{totalBins - activeBins} offline</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Battery Status</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowBattery}</div>
            <p className="text-xs text-muted-foreground">Low battery alerts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Full Bins</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fullBins}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts}</div>
            <p className="text-xs text-muted-foreground">Unresolved issues</p>
          </CardContent>
        </Card>
      </div>

      {/* Bin Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Bin Status Overview</CardTitle>
            <CardDescription>Current status of all smart bins</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {bins.map((bin) => (
              <div key={bin.binId} className="flex items-center justify-between p-3 border rounded-lg">
                {/* Bin Info */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {bin.battery > 0 ? (
                      <Wifi className="h-4 w-4 text-green-500" />
                    ) : (
                      <WifiOff className="h-4 w-4 text-red-500" />
                    )}
                    <span className="font-medium">{bin.binId}</span>
                  </div>
                </div>

                {/* Bin Stats */}
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">{bin.fill_level.toFixed(1)}% full</div>
                    <Progress value={bin.fill_level} className="w-20 h-2" />
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-medium flex items-center">
                      <Battery className="h-3 w-3 mr-1" />
                      {bin.battery}%
                    </div>
                    <div className="text-xs text-muted-foreground">{getLastEmptyText(bin.timestamp)}</div>
                  </div>

                  <Badge variant={bin.fill_level > 80 ? 'destructive' : bin.battery < 30 ? 'secondary' : 'default'}>
                    {bin.fill_level > 80 ? 'Full' : bin.battery < 30 ? 'Low Battery' : 'Normal'}
                  </Badge>

                  {/* Dropdown Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleEmptyCommand(bin)}>
                        <Send className="h-4 w-4 mr-2" /> Empty Now
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
