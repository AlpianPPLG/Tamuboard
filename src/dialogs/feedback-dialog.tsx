"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Guest } from "@/types/guest";
import { useLanguage } from "@/contexts/language-context";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";

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
  const [feedback, setFeedback] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  useLanguage();

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast.error("Silakan isi feedback Anda");
      return;
    }

    setIsSubmitting(true);
    try {
      // Send feedback via API
      const response = await fetch("/api/send-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          guestName: guest.name,
          feedback: feedback 
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal mengirim feedback");
      }

      toast.success("Terima kasih atas feedback Anda!", {
        description: "Kami sangat menghargai masukan Anda",
        icon: <CheckCircle className="h-4 w-4" />,
      });
      
      setFeedback("");
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Beri Feedback</DialogTitle>
          <DialogDescription>
            Masukan Anda sangat berharga untuk meningkatkan layanan kami.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="space-y-2">
            <label
              htmlFor="feedback"
              className="text-sm font-medium leading-none"
            >
              Masukan dan Saran
            </label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Bagaimana pengalaman Anda menggunakan layanan kami?"
              className="min-h-[120px]"
              disabled={isSubmitting}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            type="button"
          >
            Batal
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !feedback.trim()}
            type="button"
          >
            {isSubmitting ? "Mengirim..." : "Kirim Feedback"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}