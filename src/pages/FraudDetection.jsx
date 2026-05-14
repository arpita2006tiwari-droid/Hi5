import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { AlertTriangle, MapPin, Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

const fraudData = [
  { name: 'Fake GPS App', value: 12, color: '#ef4444' }, // destructive
  { name: 'Duplicate Device', value: 8, color: '#f97316' }, // orange
  { name: 'Rapid Location Jump', value: 5, color: '#eab308' }, // warning
  { name: 'Safe', value: 85, color: '#22c55e' }, // success
];

const alerts = [
  { id: 1, coach: 'Alex Mercer', location: 'Center A', issue: 'Detected Mock Location App (Fake GPS)', time: '10 mins ago', severity: 'high' },
  { id: 2, coach: 'Sarah Jenkins', location: 'Center B', issue: 'Attendance marked 15km outside radius', time: '1 hour ago', severity: 'high' },
  { id: 3, coach: 'David Smith', location: 'Center A', issue: 'Device MAC address matches 3 other coaches', time: '2 hours ago', severity: 'medium' },
];

const FraudDetection = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-destructive flex items-center gap-2">
          <ShieldAlert className="h-8 w-8" /> AI Fraud Detection
        </h1>
        <p className="text-muted-foreground">Monitor suspicious activities and protect platform integrity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass border-destructive/20 bg-destructive/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <AlertTriangle className="h-24 w-24 text-destructive" />
          </div>
          <CardHeader>
            <CardTitle className="text-destructive text-lg">System Health Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-destructive">82/100</div>
            <p className="text-sm font-medium mt-2 text-destructive/80">3 critical anomalies detected today</p>
          </CardContent>
        </Card>

        <Card className="glass md:col-span-2 border-border/50">
          <CardHeader>
            <CardTitle>Anomaly Distribution</CardTitle>
            <CardDescription>AI-detected fraud patterns across all centers</CardDescription>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fraudData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {fraudData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '8px' }} />
                <Legend verticalAlign="middle" align="right" layout="vertical" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Active Security Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl border border-border/50 bg-background/50">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-semibold text-sm">{alert.issue}</h4>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><UserIcon className="h-3 w-3" /> {alert.coach}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {alert.location}</span>
                    <span className="flex items-center gap-1"><Activity className="h-3 w-3" /> {alert.time}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <button className="px-3 py-1.5 bg-background border border-border rounded-md text-xs font-medium hover:bg-muted transition-colors">
                    Investigate
                  </button>
                  <button className="px-3 py-1.5 bg-destructive text-white rounded-md text-xs font-medium hover:bg-destructive/90 transition-colors shadow">
                    Block User
                  </button>
                </div>
              </div>
            ))}
            
            <div className="flex items-center justify-center p-6 text-sm text-muted-foreground border-t border-border/50 mt-4">
              <CheckCircle2 className="h-4 w-4 text-success mr-2" /> All other systems operating normally.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Temp UserIcon for the missing import
const UserIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

export default FraudDetection;
