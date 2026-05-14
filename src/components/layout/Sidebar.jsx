import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, BarChart3, ShieldAlert, Trophy, Settings, LogOut } from 'lucide-react';
import { cn } from '../../utils/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/coach' },
  { icon: Calendar, label: 'Attendance', href: '/dashboard/attendance' },
  { icon: BarChart3, label: 'Insights', href: '/dashboard/insights' },
  { icon: ShieldAlert, label: 'Fraud Detection', href: '/dashboard/fraud' },
  { icon: Trophy, label: 'Tournaments', href: '/dashboard/tournaments' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

const Sidebar = () => {
  return (
    <aside className="hidden w-64 flex-col border-r border-border bg-card md:flex">
      <div className="flex h-16 items-center border-b border-border px-6">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            H5
          </div>
          Hi5 Platform
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
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

        <div className="mt-auto">
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
