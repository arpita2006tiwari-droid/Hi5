import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { Button } from '../ui/Button';

const AuthLayout = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background items-center justify-center p-4 overflow-hidden">
      {/* Background decorations for futuristic feel */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[50%] rounded-[100%] bg-primary/10 blur-[80px]" />
        <div className="absolute bottom-0 right-0 w-[80%] h-[50%] rounded-full bg-accent/10 blur-[80px]" />
      </div>

      {/* Theme toggle for auth pages */}
      <div className="absolute top-4 right-4 z-50">
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground backdrop-blur-sm">
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
