"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { GuestStorage } from "@/lib/guest-stotrage"
import type { Guest, GuestFormData } from "@/types/guest"
import { useLanguage } from "@/contexts/language-context"
import { toast } from "sonner"
import { Loader2, UserPlus, XCircle, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { cn } from "@/lib/utils"

// --- Schema --- //
const guestSchema = z.object({
  name: z.string().min(2).max(50),
  institution: z.string().min(2).max(100),
  purpose: z.string().min(5).max(200),
  phone: z.string().min(10),
  email: z.string().email().optional().or(z.literal("")),
  category: z.enum(["VIP", "regular", "supplier", "intern"]),
  scheduledDate: z.date().optional(),
  scheduledTime: z.string().optional(),
  notes: z.string().optional(),
})

interface GuestFormProps {
  guest?: Guest
  mode?: "create" | "edit"
  onSuccess?: () => void
}

function getTimeOfDay(date: Date): "morning" | "afternoon" | "evening" {
  const hour = date.getHours()
  if (hour < 12) return "morning"
  if (hour < 18) return "afternoon"
  return "evening"
}

export function GuestForm({ guest, mode = "create", onSuccess }: GuestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const { t } = useLanguage()

  const form = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      name: guest?.name ?? "",
      institution: guest?.institution ?? "",
      purpose: guest?.purpose ?? "",
      phone: guest?.phone ?? "",
      email: guest?.email ?? "",
      category: guest?.category ?? "regular",
      scheduledDate: guest?.scheduledDate ? new Date(guest.scheduledDate) : undefined,
      scheduledTime: guest?.scheduledTime ?? "",
      notes: guest?.notes ?? "",
    },
  })

  if (mode === "edit" && !guest) {
    return (
      <div className="p-4 text-center space-y-4">
        <XCircle className="h-12 w-12 text-red-500 mx-auto" />
        <h3 className="text-lg font-medium">Data Tamu Tidak Ditemukan</h3>
        <Button onClick={() => onSuccess?.()}>Tutup</Button>
      </div>
    )
  }

  const onSubmit = async (data: GuestFormData) => {
    setIsSubmitting(true)
    setError(null)
    try {
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 50))
        setProgress(i)
      }

      const guestData: Guest = {
        ...data,
        id: guest?.id || Date.now().toString(),
        visitDate: new Date(),
        visitTime: getTimeOfDay(new Date()),
        checkInTime: new Date().toISOString(),
        status: "checked-in",
        specialRequirements: guest?.specialRequirements || [],
        checkOutTime: guest?.checkOutTime,
        checkedInBy: guest?.checkedInBy || "system",
        checkedOutBy: guest?.checkedOutBy,
        updatedAt: new Date().toISOString(),
        createdAt: guest?.createdAt || new Date().toISOString(),
      }

      if (mode === "create") {
        GuestStorage.addGuest(guestData)
        toast.success("Tamu berhasil ditambahkan")
      } else {
        GuestStorage.updateGuest(guestData.id, guestData)
        toast.success("Data tamu berhasil diperbarui")
      }

      onSuccess?.()
    } catch (err) {
      console.error("Error saving guest:", err)
      setError("Terjadi kesalahan saat menyimpan data tamu")
      toast.error("Gagal menyimpan data tamu")
    } finally {
      setIsSubmitting(false)
      setProgress(0)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 p-4 sm:p-6">
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

        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.fullName}</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isSubmitting} />
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
                    <Input {...field} disabled={isSubmitting} />
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
                    <Input {...field} disabled={isSubmitting} />
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
                    <Input {...field} disabled={isSubmitting} />
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
                    <Input type="email" {...field} disabled={isSubmitting} />
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
                          className={cn(
                            "pl-3 text-left font-normal h-10 sm:h-9",
                            !field.value && "text-muted-foreground",
                          )}
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
                <FormItem className="sm:col-span-1 md:col-span-2">
                  <FormLabel>Catatan (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 sm:pt-6 border-t mt-6 sm:mt-8">
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
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
  )
}
