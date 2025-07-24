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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AutoCheckoutSettings } from "@/components/auto-checkout-settings";
import { SpecialRequirementsForm } from "@/components/special-requirements-form";
import { PrivacySettings } from "@/components/privacy-settings";
import { cn } from "@/lib/utils";

// --- Schema ---
const guestSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(50, "Nama maksimal 50 karakter"),
  institution: z.string().min(2, "Instansi minimal 2 karakter").max(100, "Instansi maksimal 100 karakter"),
  purpose: z.string().min(5, "Keperluan minimal 5 karakter").max(200, "Keperluan maksimal 200 karakter"),
  phone: z.string().min(10, "Nomor telepon minimal 10 digit"),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  category: z.enum(["VIP", "regular", "supplier", "intern"]),
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

    try {
      setProgress(20);
      await new Promise((r) => setTimeout(r, 300));
      setProgress(50);
      await new Promise((r) => setTimeout(r, 300));
      setProgress(80);
      await new Promise((r) => setTimeout(r, 300));

      if (mode === "edit" && guest) {
        const updated = GuestStorage.updateGuest(guest.id, data);
        if (updated) {
          toast.success(`${updated.name} ${t.successUpdate}`, {
            description: "Perubahan telah disimpan",
            icon: <CheckCircle className="h-4 w-4" />,
          });
        }
      } else {
        const created = GuestStorage.addGuest(data);
        toast.success(`${created.name} ${t.successCheckIn}`, {
          description: `Check-in berhasil pada ${created.checkInTime}`,
          icon: <CheckCircle className="h-4 w-4" />,
        });
      }

      form.reset();
      onSuccess?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan data tamu";
      setError(msg);
      toast.error("Gagal menyimpan!", { description: msg, icon: <XCircle className="h-4 w-4" /> });
    } finally {
      setIsSubmitting(false);
      setProgress(0);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && <p className="text-sm text-red-600">{error}</p>}
        {isSubmitting && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {progress < 50 ? "Memvalidasi..." : progress < 80 ? "Menyimpan..." : "Menyelesaikan..."}
              </span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <Tabs defaultValue="guest-info" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="guest-info">Info</TabsTrigger>
            <TabsTrigger value="special-requirements">Kebutuhan</TabsTrigger>
            <TabsTrigger value="auto-checkout">Check-out</TabsTrigger>
            <TabsTrigger value="privacy">Privasi</TabsTrigger>
          </TabsList>

          <TabsContent value="guest-info" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.fullName}</FormLabel>
                    <FormControl>
                      <Input placeholder={`Masukkan ${t.fullName.toLowerCase()}`} {...field} disabled={isSubmitting} />
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
                      <Input placeholder={`Masukkan ${t.institution.toLowerCase()}`} {...field} disabled={isSubmitting} />
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
                    <FormLabel>{t.purpose}</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Meeting, Interview" {...field} disabled={isSubmitting} />
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
                      <Input placeholder="081234567890" {...field} disabled={isSubmitting} />
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
                      <Input type="email" placeholder="email@contoh.com" {...field} disabled={isSubmitting} />
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
                    <FormLabel>Kategori</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="VIP">VIP</SelectItem>
                        <SelectItem value="regular">Reguler</SelectItem>
                        <SelectItem value="supplier">Supplier</SelectItem>
                        <SelectItem value="intern">Siswa/Magang</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="scheduledDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tanggal Dijadwalkan (Opsional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                            disabled={isSubmitting}
                          >
                            {field.value ? format(field.value, "PPP", { locale: id }) : "Pilih tanggal"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
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
                    <FormLabel>Waktu Dijadwalkan (Opsional)</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Catatan (Opsional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Catatan tambahan..." {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="special-requirements" className="space-y-6">
            {guest ? (
              <SpecialRequirementsForm guest={guest} onUpdate={onSuccess} />
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Simpan data tamu terlebih dahulu untuk mengelola persyaratan khusus.
              </div>
            )}
          </TabsContent>

          <TabsContent value="auto-checkout" className="space-y-6">
            {guest ? (
              <AutoCheckoutSettings guest={guest} onUpdate={onSuccess} />
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Simpan data tamu terlebih dahulu untuk mengatur pengaturan auto-checkout.
              </div>
            )}
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            {guest ? (
              <PrivacySettings guest={guest} onUpdate={onSuccess} />
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Simpan data tamu terlebih dahulu untuk mengatur pengaturan privasi.
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : mode === "edit" ? (
              "Perbarui Data"
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Simpan Tamu
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}