import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User,
  Edit,
  Trash2
} from 'lucide-react';

// Mock scheduling data
const mockSchedules = [
  {
    id: 1,
    title: 'Daily Collection - Floor 1',
    binName: 'Reception Area',
    date: '2024-01-08',
    time: '09:00',
    type: 'collection',
    assignee: 'John Smith',
    status: 'scheduled',
    recurring: 'daily'
  },
  {
    id: 2,
    title: 'Weekly Maintenance - Kitchen',
    binName: 'Kitchen',
    date: '2024-01-08',
    time: '14:00',
    type: 'maintenance',
    assignee: 'Sarah Johnson',
    status: 'scheduled',
    recurring: 'weekly'
  },
  {
    id: 3,
    title: 'Emergency Collection - Conference Room A',
    binName: 'Conference Room A',
    date: '2024-01-07',
    time: '16:30',
    type: 'emergency',
    assignee: 'Mike Davis',
    status: 'completed',
    recurring: 'none'
  },
  {
    id: 4,
    title: 'Sensor Calibration - Office Floor 2',
    binName: 'Office Floor 2',
    date: '2024-01-09',
    time: '10:00',
    type: 'maintenance',
    assignee: 'Lisa Chen',
    status: 'scheduled',
    recurring: 'monthly'
  }
];

const bins = [
  'Reception Area',
  'Conference Room A',
  'Kitchen',
  'Office Floor 2',
  'Storage Room'
];

const staff = [
  'John Smith',
  'Sarah Johnson',
  'Mike Davis',
  'Lisa Chen',
  'Tom Wilson'
];

export function Scheduling() {
  const [schedules, setSchedules] = useState(mockSchedules);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    title: '',
    binName: '',
    date: '',
    time: '',
    type: 'collection',
    assignee: '',
    recurring: 'none',
    notes: ''
  });

  const getSchedulesForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return schedules.filter(schedule => schedule.date === dateStr);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'collection': return 'bg-blue-500';
      case 'maintenance': return 'bg-green-500';
      case 'emergency': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled': return <Badge>Scheduled</Badge>;
      case 'in-progress': return <Badge variant="secondary">In Progress</Badge>;
      case 'completed': return <Badge variant="outline">Completed</Badge>;
      case 'cancelled': return <Badge variant="destructive">Cancelled</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };

  const handleAddSchedule = () => {
    const newId = Math.max(...schedules.map(s => s.id)) + 1;
    setSchedules([...schedules, {
      id: newId,
      ...newSchedule,
      status: 'scheduled'
    }]);
    setNewSchedule({
      title: '',
      binName: '',
      date: '',
      time: '',
      type: 'collection',
      assignee: '',
      recurring: 'none',
      notes: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleDeleteSchedule = (id: number) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
  };

  const todaySchedules = selectedDate ? getSchedulesForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2>Scheduling</h2>
          <p className="text-muted-foreground">Manage collection and maintenance schedules</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Schedule</DialogTitle>
              <DialogDescription>
                Create a new collection or maintenance schedule
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newSchedule.title}
                  onChange={(e) => setNewSchedule({ ...newSchedule, title: e.target.value })}
                  placeholder="e.g., Daily Collection - Reception"
                />
              </div>
              
              <div>
                <Label htmlFor="binName">Bin</Label>
                <Select value={newSchedule.binName} onValueChange={(value) => setNewSchedule({ ...newSchedule, binName: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a bin" />
                  </SelectTrigger>
                  <SelectContent>
                    {bins.map((bin) => (
                      <SelectItem key={bin} value={bin}>{bin}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newSchedule.date}
                    onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newSchedule.time}
                    onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={newSchedule.type} onValueChange={(value) => setNewSchedule({ ...newSchedule, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="collection">Collection</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="assignee">Assignee</Label>
                <Select value={newSchedule.assignee} onValueChange={(value) => setNewSchedule({ ...newSchedule, assignee: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {staff.map((person) => (
                      <SelectItem key={person} value={person}>{person}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="recurring">Recurring</Label>
                <Select value={newSchedule.recurring} onValueChange={(value) => setNewSchedule({ ...newSchedule, recurring: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">One-time</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={newSchedule.notes}
                  onChange={(e) => setNewSchedule({ ...newSchedule, notes: e.target.value })}
                  placeholder="Additional notes or instructions"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddSchedule}>Add Schedule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Calendar and Schedule View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date to view schedules</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Selected Date Schedules */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5" />
              <span>
                {selectedDate ? selectedDate.toLocaleDateString() : 'Select a date'}
              </span>
            </CardTitle>
            <CardDescription>
              {todaySchedules.length} scheduled {todaySchedules.length === 1 ? 'task' : 'tasks'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todaySchedules.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No schedules for this date
              </div>
            ) : (
              <div className="space-y-4">
                {todaySchedules.map((schedule) => (
                  <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className={`w-3 h-3 rounded-full mt-2 ${getTypeColor(schedule.type)}`}></div>
                      <div className="space-y-1">
                        <div className="font-medium">{schedule.title}</div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{schedule.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{schedule.binName}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{schedule.assignee}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(schedule.status)}
                          <Badge variant="outline" className="text-xs">
                            {schedule.type}
                          </Badge>
                          {schedule.recurring !== 'none' && (
                            <Badge variant="outline" className="text-xs">
                              {schedule.recurring}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteSchedule(schedule.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Schedules */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Schedules</CardTitle>
          <CardDescription>Next 7 days overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {schedules
              .filter(schedule => {
                const scheduleDate = new Date(schedule.date);
                const today = new Date();
                const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                return scheduleDate >= today && scheduleDate <= nextWeek && schedule.status === 'scheduled';
              })
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((schedule) => (
                <div key={schedule.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${getTypeColor(schedule.type)}`}></div>
                    <div>
                      <div className="font-medium">{schedule.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(schedule.date).toLocaleDateString()} at {schedule.time} • {schedule.assignee}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">{schedule.type}</Badge>
                    {schedule.recurring !== 'none' && (
                      <Badge variant="outline" className="text-xs">{schedule.recurring}</Badge>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}