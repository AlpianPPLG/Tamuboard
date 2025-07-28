"use client";

import { Button } from "@/components/ui/button";
import { Guest } from "@/types/guest";
import { Trash2, Clock, Undo2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { format } from "date-fns";
import { id } from "date-fns/locale";

type TestTrashProps = {
  guest: Guest;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
};

export function TestTrashItem({ guest, onRestore, onDelete }: TestTrashProps) {
  const { t } = useLanguage();
  
  const getDaysRemaining = (deletedAt: Date): number => {
    const now = new Date();
    const thirtyDaysLater = new Date(deletedAt);
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
    
    const diffTime = thirtyDaysLater.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const getDaysRemainingText = (days: number): string => {
    if (days === 0) return t.trash.expiresToday;
    if (days === 1) return t.trash.expiresInOneDay;
    return t.trash.expiresInDays.replace('{days}', days.toString());
  };

  if (!guest.deletedAt) return null;

  const daysRemaining = getDaysRemaining(guest.deletedAt);
  const isExpired = daysRemaining === 0;

  return (
    <div className="border rounded-lg p-4 mb-4 bg-card">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{guest.name}</h3>
          <p className="text-sm text-muted-foreground">
            {guest.institution} • {guest.purpose}
          </p>
          <div className="flex items-center mt-2 text-sm text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>
              {getDaysRemainingText(daysRemaining)}
              {isExpired && " (Expired)"}
            </span>
            <span className="mx-2">•</span>
            <span>
              {t.trash.deletedOn} {format(guest.deletedAt, "PPpp", { locale: id })}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRestore(guest.id)}
            className="text-xs"
          >
            <Undo2 className="h-3 w-3 mr-1" />
            {t.trash.restore}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(guest.id)}
            className="text-xs"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            {t.trash.deletePermanent}
          </Button>
        </div>
      </div>
    </div>
  );
}
