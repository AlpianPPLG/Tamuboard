"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GuestStorage } from '@/lib/guest-stotrage';
import { GuestStats } from '@/types/guest';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Clock,
  UserCheck,
  UserX
} from 'lucide-react';

interface StatsDialogProps {
  children: React.ReactNode;
}

export function StatsDialog({ children }: StatsDialogProps) {
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState<GuestStats>({
    totalToday: 0,
    totalThisMonth: 0,
    totalThisYear: 0,
    currentlyCheckedIn: 0,
  });

  useEffect(() => {
    if (open) {
      setStats(GuestStorage.getStats());
    }
  }, [open]);

  const statCards = [
    {
      title: 'Tamu Hari Ini',
      value: stats.totalToday,
      icon: Calendar,
      description: 'Total kunjungan hari ini',
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Sedang Check In',
      value: stats.currentlyCheckedIn,
      icon: UserCheck,
      description: 'Tamu yang masih berada di lokasi',
      color: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Bulan Ini',
      value: stats.totalThisMonth,
      icon: TrendingUp,
      description: 'Total kunjungan bulan ini',
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Tahun Ini',
      value: stats.totalThisYear,
      icon: Users,
      description: 'Total kunjungan tahun ini',
      color: 'text-orange-600 dark:text-orange-400',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Statistik Kunjungan
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {statCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <IconComponent className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Data diperbarui secara real-time</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}