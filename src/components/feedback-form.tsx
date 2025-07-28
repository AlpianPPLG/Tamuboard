"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

export function FeedbackForm({ guestName, onSuccess }: { guestName: string; onSuccess?: () => void }) {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      toast.error("Silakan isi feedback Anda");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/send-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ guestName, feedback }),
      });

      if (!response.ok) {
        throw new Error("Gagal mengirim feedback");
      }

      toast.success("Terima kasih atas feedback Anda!");
      setFeedback("");
      onSuccess?.();
    } catch (error) {
      console.error("Error sending feedback:", error);
      toast.error("Gagal mengirim feedback. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="feedback" className="block text-sm font-medium mb-2">
          Masukan dan Saran Anda
        </label>
        <Textarea
          id="feedback"
          rows={4}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Bagaimana pengalaman Anda menggunakan layanan kami?"
          className="w-full"
          disabled={isSubmitting}
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Mengirim..." : "Kirim Feedback"}
      </Button>
    </form>
  );
}
