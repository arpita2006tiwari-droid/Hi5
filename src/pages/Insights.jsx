import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Sparkles, TrendingUp, AlertCircle, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianAxis } from 'recharts';

const performanceData = [
  { name: 'Week 1', score: 85 },
  { name: 'Week 2', score: 88 },
  { name: 'Week 3', score: 82 },
  { name: 'Week 4', score: 95 },
];

const Insights = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-accent" /> AI Insights
        </h1>
        <p className="text-muted-foreground">Automated analytics and recommendations based on platform data.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass border-border/50 bg-gradient-to-br from-accent/5 to-transparent">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-accent">
              <TrendingUp className="h-5 w-5" /> Positive Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-background/50 border border-border/50">
              <h4 className="font-semibold mb-1">Elite Squad Improvement</h4>
              <p className="text-sm text-muted-foreground">Attendance for the Elite Squad has increased by 14% over the last 30 days. Maintain current coaching strategies.</p>
            </div>
            <div className="p-4 rounded-xl bg-background/50 border border-border/50">
              <h4 className="font-semibold mb-1">Peak Performance Time</h4>
              <p className="text-sm text-muted-foreground">Students perform 20% better in skill drills during the 16:00 - 17:30 slot compared to evening slots.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50 bg-gradient-to-br from-warning/5 to-transparent">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-warning">
              <AlertCircle className="h-5 w-5" /> Areas of Concern
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-background/50 border border-border/50">
              <h4 className="font-semibold mb-1">Drop-off Warning</h4>
              <p className="text-sm text-muted-foreground">3 students in the U-14 Advanced batch have missed 4 consecutive sessions. Intervention recommended.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" /> Center Performance Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <RechartsTooltip cursor={{ fill: 'var(--color-muted)', opacity: 0.2 }} contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '8px' }} />
              <Bar dataKey="score" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Insights;
