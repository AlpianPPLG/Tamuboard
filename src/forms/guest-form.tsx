"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GuestStorage } from "@/lib/guest-stotrage";
import { Guest, GuestFormData } from "@/types/guest";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";

const guestSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  institution: z.string().min(2, "Instansi minimal 2 karakter"),
  purpose: z.string().min(5, "Keperluan minimal 5 karakter"),
  phone: z.string().min(10, "Nomor telepon minimal 10 digit"),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  notes: z.string().optional(),
});

interface GuestFormProps {
  guest?: Guest;
  mode?: "create" | "edit";
  onSuccess?: () => void;
}

export function GuestForm({ guest, mode = "create", onSuccess }: GuestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      name: guest?.name ?? "",
      institution: guest?.institution ?? "",
      purpose: guest?.purpose ?? "",
      phone: guest?.phone ?? "",
      email: guest?.email ?? "",
      notes: guest?.notes ?? "",
    },
  });

  const onSubmit = async (data: GuestFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (mode === "edit" && guest) {
        const updatedGuest = GuestStorage.updateGuest(guest.id, data);
        if (updatedGuest) {
          toast.success(`Data ${updatedGuest.name} berhasil diperbarui!`, {
            description: "Perubahan telah disimpan",
          });
        }
      } else {
        const newGuest = GuestStorage.addGuest(data);
        toast.success(`Selamat datang, ${newGuest.name}!`, {
          description: `Check-in berhasil pada ${newGuest.checkInTime}`,
        });
      }

      form.reset();
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal menyimpan data tamu";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama lengkap" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="institution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instansi/Perusahaan</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama instansi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="purpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keperluan</FormLabel>
              <FormControl>
                <Input placeholder="Tujuan kunjungan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Telepon</FormLabel>
              <FormControl>
                <Input placeholder="08xxxxxxxxxx" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email (Opsional)</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catatan (Opsional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Catatan tambahan..."
                  className="min-h-20"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === "edit" ? "Memperbarui..." : "Menyimpan..."}
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              {mode === "edit" ? "Perbarui Data" : "Check In"}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}