"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GuestStorage } from "@/lib/guest-stotrage";
import { Guest } from "@/types/guest";
import { useLanguage } from "@/contexts/language-context";
import { toast } from "sonner";
import { Star, CheckCircle, XCircle } from "lucide-react";

interface FeedbackDialogProps {
  guest: Guest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
}

export function FeedbackDialog({
  guest,
  open,
  onOpenChange,
  onUpdate,
}: FeedbackDialogProps) {
  const [rating, setRating] = useState<number>(guest.rating ?? 0);
  const [feedback, setFeedback] = useState<string>(guest.feedback ?? "");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { t } = useLanguage();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Silakan berikan rating terlebih dahulu");
      return;
    }

    setIsSubmitting(true);
    try {
      await GuestStorage.addFeedback(guest.id, rating, feedback);
      toast.success("Feedback berhasil disimpan!", {
        description: "Terima kasih atas feedback Anda",
        icon: <CheckCircle className="h-4 w-4" />,
      });
      onUpdate?.();
      onOpenChange(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Gagal menyimpan feedback", {
        icon: <XCircle className="h-4 w-4" />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Feedback Kunjungan</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Rating */}
          <div>
            <label className="text-sm font-medium mb-2 block">{t.rating}</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                  disabled={isSubmitting}
                  aria-label={`Rate ${star} out of 5`}
                  aria-pressed={star <= rating}
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div>
            <label className="text-sm font-medium mb-2 block">{t.feedback}</label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Bagikan pengalaman kunjungan Anda..."
              className="min-h-20"
              disabled={isSubmitting}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={isSubmitting || rating === 0}
            >
              {isSubmitting ? "Menyimpan..." : t.submitFeedback}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}