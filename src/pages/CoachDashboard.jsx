import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Users, Clock, CalendarCheck, TrendingUp, AlertTriangle, ChevronDown, Building, LayoutDashboard, BarChart3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { cn } from '../utils/utils';

const attendanceHistory = [
  { name: 'Mon', attendance: 40, overall: 35 },
  { name: 'Tue', attendance: 30, overall: 32 },
  { name: 'Wed', attendance: 45, overall: 40 },
  { name: 'Thu', attendance: 27, overall: 38 },
  { name: 'Fri', attendance: 55, overall: 45 },
  { name: 'Sat', attendance: 43, overall: 42 },
  { name: 'Sun', attendance: 64, overall: 50 },
];

const centrePerformance = [
  { name: 'Motilal', attendance: 88, students: 45, color: 'var(--color-primary)' },
  { name: 'Poonam Nagar', attendance: 82, students: 38, color: '#10b981' },
  { name: 'Andheri', attendance: 75, students: 25, color: '#f59e0b' },
  { name: 'Bandra', attendance: 92, students: 20, color: '#8b5cf6' },
];

const dashboardData = {
  "Overall Academy": {
    students: 128,
    attendance: "84%",
    hours: "325",
    alerts: 2,
    growth: "+12.5%",
    centres: 8,
    activeCoaches: 12
  },
  "Motilal": {
    students: 45,
    attendance: "88%",
    hours: "120",
    alerts: 0,
    growth: "+5.2%",
    centres: 1,
    activeCoaches: 3
  },
  "Poonam Nagar": {
    students: 38,
    attendance: "82%",
    hours: "95",
    alerts: 1,
    growth: "+8.1%",
    centres: 1,
    activeCoaches: 2
  }
};

const CoachDashboard = () => {
  const [selectedCentre, setSelectedCentre] = useState("Overall Academy");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentStats = dashboardData[selectedCentre] || dashboardData["Overall Academy"];

  return (
    <div className="space-y-6 pb-20 md:pb-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-6 w-6 text-primary fill-primary/20" />
            <h1 className="text-3xl font-bold tracking-tight">SPORTIFY Analytics</h1>
            <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-wider">Live</div>
          </div>
          <p className="text-muted-foreground text-sm">Monitoring performance across {selectedCentre === "Overall Academy" ? "all centres" : selectedCentre}.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl text-sm font-medium hover:bg-muted/50 transition-all shadow-sm"
            >
              <Building className="h-4 w-4 text-primary" />
              {selectedCentre}
              <ChevronDown className={cn("h-4 w-4 transition-transform", isDropdownOpen && "rotate-180")} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl z-50 p-1 animate-in zoom-in-95 duration-100">
                {Object.keys(dashboardData).map(centre => (
                  <button
                    key={centre}
                    onClick={() => {
                      setSelectedCentre(centre);
                      setIsDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm rounded-lg transition-colors",
                      selectedCentre === centre ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {centre}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 text-success text-xs font-medium border border-success/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            System Online
          </div>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="glass border-border/50 hover:border-primary/30 transition-all group">
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Students</p>
              <Users className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-bold">{currentStats.students}</div>
            <div className="flex items-center gap-1 text-[10px] text-success font-medium">
              <TrendingUp className="h-3 w-3" /> {currentStats.growth} Growth
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass border-border/50 hover:border-success/30 transition-all group">
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Attendance</p>
              <CalendarCheck className="h-4 w-4 text-success group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-bold">{currentStats.attendance}</div>
            <p className="text-[10px] text-muted-foreground">Today's avg</p>
          </CardContent>
        </Card>

        <Card className="glass border-border/50 hover:border-accent/30 transition-all group">
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Coaching Hours</p>
              <Clock className="h-4 w-4 text-accent group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-bold">{currentStats.hours}h</div>
            <p className="text-[10px] text-muted-foreground">Logged this month</p>
          </CardContent>
        </Card>

        <Card className={cn(
          "glass border-border/50 transition-all group",
          currentStats.alerts > 0 ? "bg-destructive/5 border-destructive/20 hover:border-destructive/40" : "hover:border-primary/30"
        )}>
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className={cn("text-[10px] font-bold uppercase tracking-wider", currentStats.alerts > 0 ? "text-destructive" : "text-muted-foreground")}>
                {selectedCentre === "Overall Academy" ? "Active Centres" : "Fraud Alerts"}
              </p>
              {selectedCentre === "Overall Academy" ? (
                <Building className="h-4 w-4 text-primary" />
              ) : (
                <AlertTriangle className={cn("h-4 w-4", currentStats.alerts > 0 ? "text-destructive" : "text-muted-foreground")} />
              )}
            </div>
            <div className={cn("text-2xl font-bold", currentStats.alerts > 0 && "text-destructive")}>
              {selectedCentre === "Overall Academy" ? currentStats.centres : currentStats.alerts}
            </div>
            <p className="text-[10px] text-muted-foreground">
              {selectedCentre === "Overall Academy" ? "Operational sites" : "Pending review"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4 glass border-border/50 overflow-hidden">
          <CardHeader className="p-6 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" /> Attendance Trends
              </CardTitle>
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider">
                <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary"></span> {selectedCentre}</div>
                <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-muted-foreground/30"></span> Market Avg</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceHistory} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.2} />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} tick={{dy: 10}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ padding: '2px 0' }}
                />
                <Area type="monotone" dataKey="overall" stroke="var(--color-muted-foreground)" strokeWidth={1} strokeDasharray="5 5" fill="transparent" />
                <Area type="monotone" dataKey="attendance" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorAttendance)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 glass border-border/50 flex flex-col">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-accent" /> Top Centres
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-6 flex flex-col">
            <div className="flex-1 min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={centrePerformance} layout="vertical" margin={{ left: -20, right: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '12px' }} />
                  <Bar dataKey="attendance" radius={[0, 4, 4, 0]} barSize={12}>
                    {centrePerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border/50">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Best Performance</p>
                <p className="text-sm font-bold text-primary">Bandra (92%)</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Fastest Growth</p>
                <p className="text-sm font-bold text-success">Poonam Nagar</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Re-using Trophy icon
import { Trophy } from 'lucide-react';

export default CoachDashboard;
