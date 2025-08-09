"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GuestStorage } from "@/lib/guest-stotrage";
import { GuestStats } from "@/types/guest";
import { useLanguage } from "@/contexts/language-context";
import {
  Users,
  Calendar,
  TrendingUp,
  Clock,
  UserCheck,
  Crown,
  CalendarCheck,
} from "lucide-react";

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
    vipGuests: 0,
    scheduledToday: 0,
    deletedCount: 0,
  });
  const { t } = useLanguage();

  useEffect(() => {
    if (open) {
      const loadStats = async () => {
        try {
          const raw = await GuestStorage.getStats();
          setStats({
            totalToday: raw.totalToday,
            totalThisMonth: raw.totalThisMonth,
            totalThisYear: raw.totalThisYear,
            currentlyCheckedIn: raw.currentlyCheckedIn,
            vipGuests: raw.vipGuests ?? 0,
            scheduledToday: raw.scheduledToday ?? 0,
            deletedCount: raw.deletedCount ?? 0,
          });
        } catch (error) {
          console.error('Error loading stats:', error);
        }
      };
      
      loadStats();
    }
  }, [open]);
  
  const statCards = [
    {
      title: t.todayGuests,
      value: stats.totalToday,
      icon: Calendar,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: t.currentlyCheckedIn,
      value: stats.currentlyCheckedIn,
      icon: UserCheck,
      color: "text-green-600 dark:text-green-400",
    },
    {
      title: t.vipGuests,
      value: stats.vipGuests,
      icon: Crown,
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      title: t.scheduledToday,
      value: stats.scheduledToday,
      icon: CalendarCheck,
      color: "text-indigo-600 dark:text-indigo-400",
    },
    {
      title: t.thisMonth,
      value: stats.totalThisMonth,
      icon: TrendingUp,
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      title: t.thisYear,
      value: stats.totalThisYear,
      icon: Users,
      color: "text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[calc(100vw-1rem)] sm:w-[90vw] max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-4 pt-4 pb-2 sm:px-6 sm:pt-6 sm:pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <span>Statistik Kunjungan</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-4">
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="h-full hover:shadow-md transition-all duration-200 border border-transparent hover:border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-4">
                  <CardTitle className="text-[13px] xs:text-sm font-medium line-clamp-2 leading-tight">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-1.5 sm:p-2 rounded-full bg-opacity-10 ${stat.color.replace('text-', 'bg-')}`}>
                    <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
                  <div className="text-xl sm:text-2xl font-bold mb-1.5">
                    {stat.value}
                  </div>
                  <p className="text-[11px] xs:text-xs text-muted-foreground line-clamp-1">
                    {stat.title.includes("Hari Ini")
                      ? "Kunjungan hari ini"
                      : stat.title.includes("Bulan")
                      ? "Kunjungan bulan ini"
                      : stat.title.includes("Tahun")
                      ? "Kunjungan tahun ini"
                      : stat.title.includes("Sedang Berkunjung")
                      ? "Tamu sedang berkunjung"
                      : stat.title.includes("VIP")
                      ? "Total tamu VIP"
                      : "Jadwal kunjungan hari ini"}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        </div>
        
        <div className="p-3 sm:p-4 border-t bg-muted/30">
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5 flex-shrink-0" />
            <span>Data diperbarui secara real-time</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}