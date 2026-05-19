import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, BarChart3, ShieldAlert, Trophy, Settings, LogOut, Sparkles } from 'lucide-react';
import { cn } from '../../utils/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Analytics', href: '/dashboard/coach', roles: ['admin'] },
  { icon: Calendar, label: 'Attendance', href: '/dashboard/attendance', roles: ['admin', 'coach'] },
  { icon: BarChart3, label: 'Insights', href: '/dashboard/insights', roles: ['admin'] },
  { icon: Sparkles, label: 'AI Assistant', href: '/dashboard/ai', roles: ['admin', 'coach'] },
  { icon: ShieldAlert, label: 'Fraud Detection', href: '/dashboard/fraud', roles: ['admin'] },
  { icon: Trophy, label: 'Tournaments', href: '/dashboard/tournaments', roles: ['admin'] },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings', roles: ['admin'] },
];

const Sidebar = () => {
  // MOCK: In a real app, this would come from a Global State or Auth Context
  const userRole = localStorage.getItem('userRole') || 'coach'; 

  return (
    <aside className="hidden w-64 flex-col border-r border-border bg-card md:flex">
      <div className="flex h-16 items-center border-b border-border px-6">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-black tracking-tighter">
            H5
          </div>
          Hi5 Foundation
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <nav className="flex flex-col gap-1">
          {navItems
            .filter(item => item.roles.includes(userRole))
            .map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-2">
          <Button 
            variant="outline" 
            size="sm"
            className="w-full text-[10px] uppercase font-bold tracking-tighter"
            onClick={() => {
              const nextRole = userRole === 'admin' ? 'coach' : 'admin';
              localStorage.setItem('userRole', nextRole);
              window.location.reload();
            }}
          >
            Switch to {userRole === 'admin' ? 'Coach' : 'Admin'}
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive">
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
};

// Moving Button import down to avoid circular deps if they occur, though it should be fine.
import { Button } from '../ui/Button';

export default Sidebar;
