import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, ShieldAlert } from 'lucide-react';
import { cn } from '../../utils/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Home', href: '/dashboard/coach' },
  { icon: Calendar, label: 'Attendance', href: '/dashboard/attendance' },
  { icon: ShieldAlert, label: 'Alerts', href: '/dashboard/fraud' },
];

const BottomNav = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-background/90 backdrop-blur-md pb-safe-area shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.1)]">
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center w-full py-3 gap-1 transition-colors',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )
          }
        >
          <item.icon className="h-6 w-6" />
          <span className="text-[10px] font-medium">{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default BottomNav;
