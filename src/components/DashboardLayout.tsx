import React, { useState } from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from './ui/sidebar';
import { Button } from './ui/button';
import { 
  LayoutDashboard, 
  Trash2, 
  Calendar, 
  Bell, 
  BarChart3, 
  LogOut, 
  Moon, 
  Sun,
  Settings
} from 'lucide-react';
import { Dashboard } from './Dashboard';
// import { BinManagement } from './BinManagement';
import { Scheduling } from './Scheduling';
import { Alerts } from './Alerts';
import { History } from './History';

interface DashboardLayoutProps {
  onLogout: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function DashboardLayout({ onLogout, theme, onToggleTheme }: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    // { id: 'bins', label: 'Bin Management', icon: Trash2 },
    { id: 'scheduling', label: 'Scheduling', icon: Calendar },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'history', label: 'History', icon: BarChart3 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      // case 'bins':
      //   return <BinManagement />;
      case 'scheduling':
        return <Scheduling />;
      case 'alerts':
        return <Alerts />;
      case 'history':
        return <History />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex items-center gap-2 px-4 py-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Trash2 className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-sidebar-foreground">SmartBin Admin</span>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveTab(item.id)}
                    isActive={activeTab === item.id}
                    className="w-full"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter className="border-t border-sidebar-border">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onToggleTheme}>
                  {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onLogout}>
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center gap-4 px-6">
              <SidebarTrigger />
              <h1 className="font-semibold">
                {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h1>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}