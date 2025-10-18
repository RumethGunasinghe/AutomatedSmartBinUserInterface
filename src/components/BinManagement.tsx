import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  Plus, 
  Edit, 
  Trash2, 
  MoreVertical, 
  Send, 
  Battery, 
  Wifi, 
  WifiOff,
  MapPin,
  Calendar
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

// Mock data for bins
const mockBins = [
  {
    id: 1,
    name: 'Reception Area',
    location: 'Floor 1, Reception',
    fullness: 85,
    battery: 45,
    status: 'active',
    lastEmpty: '2024-01-07 14:30',
    nextScheduled: '2024-01-08 09:00',
    model: 'SmartBin Pro 2.0',
    installed: '2023-12-15'
  },
  {
    id: 2,
    name: 'Conference Room A',
    location: 'Floor 2, Meeting Rooms',
    fullness: 45,
    battery: 78,
    status: 'active',
    lastEmpty: '2024-01-06 16:00',
    nextScheduled: '2024-01-09 10:00',
    model: 'SmartBin Pro 2.0',
    installed: '2023-12-20'
  },
  {
    id: 3,
    name: 'Kitchen',
    location: 'Floor 1, Kitchen Area',
    fullness: 95,
    battery: 23,
    status: 'active',
    lastEmpty: '2024-01-07 11:00',
    nextScheduled: '2024-01-08 08:00',
    model: 'SmartBin Max 3.0',
    installed: '2023-11-10'
  },
  {
    id: 4,
    name: 'Office Floor 2',
    location: 'Floor 2, Open Office',
    fullness: 67,
    battery: 89,
    status: 'active',
    lastEmpty: '2024-01-07 10:00',
    nextScheduled: '2024-01-08 14:00',
    model: 'SmartBin Pro 2.0',
    installed: '2023-12-01'
  },
  {
    id: 5,
    name: 'Storage Room',
    location: 'Basement, Storage',
    fullness: 12,
    battery: 0,
    status: 'offline',
    lastEmpty: '2024-01-05 15:30',
    nextScheduled: '2024-01-10 11:00',
    model: 'SmartBin Lite 1.5',
    installed: '2023-10-15'
  }
];

export function BinManagement() {
  const [bins, setBins] = useState(mockBins);
  const [selectedBin, setSelectedBin] = useState<typeof mockBins[0] | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCommandDialogOpen, setIsCommandDialogOpen] = useState(false);
  const [newBin, setNewBin] = useState({
    name: '',
    location: '',
    model: 'SmartBin Pro 2.0'
  });

  const getStatusBadge = (status: string, battery: number, fullness: number) => {
    if (status === 'offline') return <Badge variant="destructive">Offline</Badge>;
    if (battery < 30) return <Badge variant="secondary">Low Battery</Badge>;
    if (fullness > 80) return <Badge variant="destructive">Full</Badge>;
    return <Badge variant="default">Active</Badge>;
  };

  const handleAddBin = () => {
    const newId = Math.max(...bins.map(b => b.id)) + 1;
    setBins([...bins, {
      id: newId,
      ...newBin,
      fullness: 0,
      battery: 100,
      status: 'active',
      lastEmpty: new Date().toISOString().slice(0, 16).replace('T', ' '),
      nextScheduled: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16).replace('T', ' '),
      installed: new Date().toISOString().slice(0, 10)
    }]);
    setNewBin({ name: '', location: '', model: 'SmartBin Pro 2.0' });
    setIsAddDialogOpen(false);
  };

  const handleDeleteBin = (id: number) => {
    setBins(bins.filter(bin => bin.id !== id));
  };

  const handleSendCommand = (command: string) => {
    if (selectedBin) {
      console.log(`Sending command "${command}" to bin ${selectedBin.name}`);
      // In real app, this would send command to the bin
      setIsCommandDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2>Bin Management</h2>
          <p className="text-muted-foreground">Manage and monitor all smart bins</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Bin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Bin</DialogTitle>
              <DialogDescription>
                Register a new smart bin in the system
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Bin Name</Label>
                <Input
                  id="name"
                  value={newBin.name}
                  onChange={(e) => setNewBin({ ...newBin, name: e.target.value })}
                  placeholder="e.g., Reception Area"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newBin.location}
                  onChange={(e) => setNewBin({ ...newBin, location: e.target.value })}
                  placeholder="e.g., Floor 1, Reception"
                />
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Select value={newBin.model} onValueChange={(value: any) => setNewBin({ ...newBin, model: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SmartBin Lite 1.5">SmartBin Lite 1.5</SelectItem>
                    <SelectItem value="SmartBin Pro 2.0">SmartBin Pro 2.0</SelectItem>
                    <SelectItem value="SmartBin Max 3.0">SmartBin Max 3.0</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddBin}>Add Bin</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Bins</CardTitle>
          <CardDescription>Complete list of smart bins and their current status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Fullness</TableHead>
                <TableHead>Battery</TableHead>
                <TableHead>Last Emptied</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bins.map((bin) => (
                <TableRow key={bin.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      {bin.status === 'active' ? (
                        <Wifi className="h-4 w-4 text-green-500" />
                      ) : (
                        <WifiOff className="h-4 w-4 text-red-500" />
                      )}
                      <span>{bin.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{bin.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(bin.status, bin.battery, bin.fullness)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={bin.fullness} className="w-16 h-2" />
                      <span className="text-sm">{bin.fullness}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Battery className="h-3 w-3" />
                      <span className="text-sm">{bin.battery}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{bin.lastEmpty}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => {
                          setSelectedBin(bin);
                          setIsCommandDialogOpen(true);
                        }}>
                          <Send className="h-4 w-4 mr-2" />
                          Send Command
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedBin(bin);
                          setIsEditDialogOpen(true);
                        }}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteBin(bin.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Command Dialog */}
      <Dialog open={isCommandDialogOpen} onOpenChange={setIsCommandDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Command</DialogTitle>
            <DialogDescription>
              Send a command to {selectedBin?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={() => handleSendCommand('empty_now')} variant="outline">
                Empty Now
              </Button>
              <Button onClick={() => handleSendCommand('test_connection')} variant="outline">
                Test Connection
              </Button>
              <Button onClick={() => handleSendCommand('calibrate_sensors')} variant="outline">
                Calibrate Sensors
              </Button>
              <Button onClick={() => handleSendCommand('restart_system')} variant="outline">
                Restart System
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCommandDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}