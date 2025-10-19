// import React, { useState } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
// import { Button } from './ui/button';
// import { Badge } from './ui/badge';
// import { Progress } from './ui/progress';
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
// import { Plus, Edit, Trash2, MoreVertical, Send, Battery, Wifi, WifiOff, MapPin, Calendar } from 'lucide-react';
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
// import { useBins } from '../../useBins';
// import { Bin } from '../types/bin';

// export function BinManagement() {
//   const bins = useBins(); // live bins from your backend
//   const [selectedBin, setSelectedBin] = useState<Bin | null>(null);
//   const [isCommandDialogOpen, setIsCommandDialogOpen] = useState(false);

//   const getStatusBadge = (bin: Bin) => {
//     if (bin.battery === 0) return <Badge variant="destructive">Offline</Badge>;
//     if (bin.battery < 30) return <Badge variant="secondary">Low Battery</Badge>;
//     if (bin.fill_level > 80) return <Badge variant="destructive">Full</Badge>;
//     return <Badge variant="default">Active</Badge>;
//   };

//   const handleSendCommand = async (command: string) => {
//     if (!selectedBin) return;
//     try {
//       await fetch('http://localhost:3000/api/send-command', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ binId: selectedBin.binId, command }),
//       });
//       console.log(`Command "${command}" sent to ${selectedBin.binId}`);
//     } catch (err) {
//       console.error('Error sending command:', err);
//     } finally {
//       setIsCommandDialogOpen(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h2>Bin Management</h2>
//           <p className="text-muted-foreground">Manage and monitor all smart bins</p>
//         </div>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>All Bins</CardTitle>
//           <CardDescription>Complete list of smart bins and their current status</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Name</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Fill Level</TableHead>
//                 <TableHead>Battery</TableHead>
//                 <TableHead>Temperature</TableHead>
//                 <TableHead>Humidity</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {bins.map(bin => (
//                 <TableRow key={bin.binId}>
//                   <TableCell>
//                     <div className="flex items-center space-x-2">
//                       {bin.battery > 0 ? (
//                         <Wifi className="h-4 w-4 text-green-500" />
//                       ) : (
//                         <WifiOff className="h-4 w-4 text-red-500" />
//                       )}
//                       <span>{bin.binId}</span>
//                     </div>
//                   </TableCell>
//                   <TableCell>{getStatusBadge(bin)}</TableCell>
//                   <TableCell>
//                     <div className="flex items-center space-x-2">
//                       <Progress value={bin.fill_level} className="w-16 h-2" />
//                       <span className="text-sm">{bin.fill_level.toFixed(1)}%</span>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex items-center space-x-1">
//                       <Battery className="h-3 w-3" />
//                       <span className="text-sm">{bin.battery}%</span>
//                     </div>
//                   </TableCell>
//                   <TableCell>{bin.temperature}°C</TableCell>
//                   <TableCell>{bin.humidity}%</TableCell>
//                   <TableCell>
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" size="sm">
//                           <MoreVertical className="h-4 w-4" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent>
//                         <DropdownMenuItem onClick={() => { setSelectedBin(bin); setIsCommandDialogOpen(true); }}>
//                           <Send className="h-4 w-4 mr-2" /> Send Command
//                         </DropdownMenuItem>
//                         <DropdownMenuItem className="text-destructive">
//                           <Trash2 className="h-4 w-4 mr-2" /> Delete
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       {/* Command Dialog */}
//       <Dialog open={isCommandDialogOpen} onOpenChange={setIsCommandDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Send Command</DialogTitle>
//             <DialogDescription>Send a command to {selectedBin?.binId}</DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4 grid grid-cols-2 gap-4">
//             <Button onClick={() => handleSendCommand('empty_now')} variant="outline">Empty Now</Button>
//             <Button onClick={() => handleSendCommand('test_connection')} variant="outline">Test Connection</Button>
//             <Button onClick={() => handleSendCommand('calibrate_sensors')} variant="outline">Calibrate Sensors</Button>
//             <Button onClick={() => handleSendCommand('restart_system')} variant="outline">Restart System</Button>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsCommandDialogOpen(false)}>Close</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
