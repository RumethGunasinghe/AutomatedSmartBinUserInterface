import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { DashboardLayout } from './components/DashboardLayout';
import { BinProvider } from './components/BinContext'; // adjust path if needed


export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check if user was previously logged in
    const savedAuth = localStorage.getItem('adminAuth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }

    // Check saved theme
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.className = savedTheme === 'dark' ? 'dark' : '';
    }
  }, []);

  const handleLogin = (email: string, password: string) => {
    // Mock authentication - in real app, this would validate against backend
    if (email && password) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.className = newTheme === 'dark' ? 'dark' : '';
  };

  if (!isAuthenticated) {
  return <Login onLogin={handleLogin} />;
}

// Wrap your dashboard with BinProvider
return (
  <BinProvider>
    <DashboardLayout 
      onLogout={handleLogout}
      theme={theme}
      onToggleTheme={toggleTheme}
    />
  </BinProvider>
);

}