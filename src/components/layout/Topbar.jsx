import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Bell, User, LogOut, Settings, CreditCard, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/utils';

const Topbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border/50 bg-background/80 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-black tracking-tighter text-primary md:hidden">Hi5 FOUNDATION</h2>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowNotifications(!showNotifications)}
            className={cn(
              "relative rounded-xl transition-all duration-300",
              showNotifications ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2.5 right-2.5 flex h-2 w-2 rounded-full bg-destructive border-2 border-background animate-pulse"></span>
          </Button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border bg-card p-4 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Notifications</h3>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase font-black tracking-widest">3 New</span>
              </div>
              <div className="space-y-3">
                {[
                  { title: "GPS Verified", desc: "Motilal centre geofence active", time: "2m ago" },
                  { title: "Session Sync", desc: "Morning attendance synced successfully", time: "1h ago" },
                  { title: "Fraud Alert", desc: "Suspicious activity detected in Andheri", time: "3h ago", color: "text-destructive" }
                ].map((n, i) => (
                  <div key={i} className="flex flex-col gap-1 p-2 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className={cn("text-xs font-bold", n.color || "text-foreground")}>{n.title}</span>
                      <span className="text-[10px] text-muted-foreground">{n.time}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-tight">{n.desc}</p>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-[10px] font-bold uppercase tracking-widest h-8">View All Activity</Button>
            </div>
          )}
        </div>
        
        {/* Theme Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme} 
          className="rounded-xl text-muted-foreground hover:text-foreground transition-all duration-300 active:scale-90"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5 animate-in spin-in-90" /> : <Moon className="h-5 w-5 animate-in spin-in-90" />}
        </Button>

        {/* Profile Menu */}
        <div className="relative">
          <div 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-muted/50 transition-all cursor-pointer group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shadow-inner transition-transform group-hover:scale-105">
              <User className="h-4 w-4" />
            </div>
            <ChevronDown className={cn("h-3 w-3 text-muted-foreground transition-transform", showProfile && "rotate-180")} />
          </div>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-card p-1 shadow-2xl animate-in slide-in-from-top-2 duration-200">
              <div className="p-3 border-b border-border mb-1">
                <p className="text-xs font-black uppercase tracking-widest text-primary">Admin Pro</p>
                <p className="text-sm font-bold truncate">arpita@sportify.io</p>
              </div>
              <div className="space-y-0.5">
                {[
                  { icon: User, label: "My Profile" },
                  { icon: Settings, label: "App Settings" },
                  { icon: CreditCard, label: "Billing" }
                ].map((item, i) => (
                  <button key={i} className="flex w-full items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl hover:bg-muted/50 transition-colors">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="p-1 mt-1 border-t border-border">
                <button className="flex w-full items-center gap-3 px-3 py-2 text-xs font-bold text-destructive rounded-xl hover:bg-destructive/10 transition-colors">
                  <LogOut className="h-4 w-4" />
                  Logout Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;

