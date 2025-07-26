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
    deletedCount: 0, // <-- tambahkan ini
  });
  const { t } = useLanguage();

  useEffect(() => {
    if (open) {
      const raw = GuestStorage.getStats();
      setStats({
        totalToday: raw.totalToday,
        totalThisMonth: raw.totalThisMonth,
        totalThisYear: raw.totalThisYear,
        currentlyCheckedIn: raw.currentlyCheckedIn,
        vipGuests: raw.vipGuests ?? 0,
        scheduledToday: raw.scheduledToday ?? 0,
        deletedCount: raw.deletedCount ?? 0, // <-- tambahkan ini
      });
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
      <DialogContent className="w-[95vw] max-w-2xl mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
            Statistik Kunjungan
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 py-3">
                  <CardTitle className="text-xs sm:text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-3 w-3 sm:h-4 sm:w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent className="px-4 py-2">
                  <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.title.includes("Hari Ini")
                      ? "Kunjungan hari ini"
                      : stat.title.includes("Bulan")
                      ? "Kunjungan bulan ini"
                      : "Kunjungan tahun ini"}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Data diperbarui secara real-time</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}