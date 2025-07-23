"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { useLanguage } from "@/contexts/language-context";
import { toast } from "sonner";
import { Loader2, UserPlus, CheckCircle, XCircle, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const guestSchema = z.object({
  name: z.string()
    .min(2, "Nama minimal 2 karakter")
    .max(50, "Nama maksimal 50 karakter")
    .regex(/^[a-zA-Z\s]+$/, "Nama hanya boleh berisi huruf dan spasi"),
  institution: z.string()
    .min(2, "Instansi minimal 2 karakter")
    .max(100, "Instansi maksimal 100 karakter"),
  purpose: z.string()
    .min(5, "Keperluan minimal 5 karakter")
    .max(200, "Keperluan maksimal 200 karakter"),
  phone: z.string()
    .min(10, "Nomor telepon minimal 10 digit")
    .max(15, "Nomor telepon maksimal 15 digit")
    .regex(/^[0-9+\-\s()]+$/, "Format nomor telepon tidak valid"),
  email: z.string()
    .email("Format email tidak valid")
    .optional()
    .or(z.literal("")),
  category: z.enum(['VIP', 'regular', 'supplier', 'intern']),
  scheduledDate: z.date().optional(),
  scheduledTime: z.string().optional(),
  notes: z.string().optional(),
});

interface GuestFormProps {
  guest?: Guest;
  mode?: "create" | "edit";
  onSuccess?: () => void;
}

export function GuestForm({ guest, mode = "create", onSuccess }: GuestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { t } = useLanguage();

  const form = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      name: guest?.name ?? "",
      institution: guest?.institution ?? "",
      purpose: guest?.purpose ?? "",
      phone: guest?.phone ?? "",
      email: guest?.email ?? "",
      category: guest?.category ?? "regular",
      scheduledDate: guest?.scheduledDate,
      scheduledTime: guest?.scheduledTime ?? "",
      notes: guest?.notes ?? "",
    },
  });

  const onSubmit = async (data: GuestFormData) => {
    setIsSubmitting(true);
    setProgress(0);
    setError(null);
    setSuccess(false);

    try {
      // Simulate progress steps
      setProgress(20);
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      setProgress(50);
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      setProgress(80);
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (mode === "edit" && guest) {
        const updatedGuest = GuestStorage.updateGuest(guest.id, data);
        if (updatedGuest) {
          setProgress(100);
          setSuccess(true);
          toast.success(`${updatedGuest.name} ${t.successUpdate}`, {
            description: "Perubahan telah disimpan",
            icon: <CheckCircle className="h-4 w-4" />,
          });
        }
      } else {
        const newGuest = GuestStorage.addGuest(data);
        setProgress(100);
        setSuccess(true);
        toast.success(`${newGuest.name} ${t.successCheckIn}`, {
          description: `Check-in berhasil pada ${newGuest.checkInTime}`,
          icon: <CheckCircle className="h-4 w-4" />,
        });
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      form.reset();
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal menyimpan data tamu";
      setError(message);
      toast.error("Gagal menyimpan data!", {
        description: message,
        icon: <XCircle className="h-4 w-4" />,
      });
    } finally {
      setIsSubmitting(false);
      setProgress(0);
      setSuccess(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}
        
        {isSubmitting && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {progress < 50 ? "Memvalidasi data..." : 
                 progress < 80 ? "Menyimpan data..." : 
                 "Menyelesaikan..."}
              </span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.fullName}</FormLabel>
              <FormControl>
                <Input 
                  placeholder={`Masukkan ${t.fullName.toLowerCase()}`}
                  {...field}
                  disabled={isSubmitting}
                />
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
              <FormLabel>{t.institution}</FormLabel>
              <FormControl>
                <Input 
                  placeholder={`Masukkan ${t.institution.toLowerCase()}`}
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.category}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={`Pilih ${t.category.toLowerCase()}`} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="regular">{t.regular}</SelectItem>
                  <SelectItem value="VIP">{t.vip}</SelectItem>
                  <SelectItem value="supplier">{t.supplier}</SelectItem>
                  <SelectItem value="intern">{t.intern}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="purpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.purpose}</FormLabel>
              <FormControl>
                <Input 
                  placeholder={`Masukkan ${t.purpose.toLowerCase()}`}
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="scheduledDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.scheduledDate}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        disabled={isSubmitting}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? format(field.value, 'dd MMM yyyy', { locale: id })
                          : 'Pilih tanggal'}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="scheduledTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.scheduledTime}</FormLabel>
                <FormControl>
                  <Input 
                    type="time"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.phone}</FormLabel>
              <FormControl>
                <Input 
                  placeholder="08xxxxxxxxxx" 
                  {...field}
                  disabled={isSubmitting}
                />
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
              <FormLabel>{t.email}</FormLabel>
              <FormControl>
                <Input 
                  placeholder="email@example.com" 
                  type="email"
                  {...field}
                  disabled={isSubmitting}
                />
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
              <FormLabel>{t.notes}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={`${t.notes.toLowerCase()}...`}
                  className="min-h-20"
                  disabled={isSubmitting}
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
          ) : success ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              {mode === "edit" ? "Berhasil Diperbarui!" : "Berhasil Disimpan!"}
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              {mode === "edit" ? t.updateData : t.checkIn}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}