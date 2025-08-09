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
import type { Guest } from "@/types/guest"
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

type GuestFormData = z.infer<typeof guestSchema>

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
      name: guest?.name || "",
      institution: guest?.institution || "",
      purpose: guest?.purpose || "",
      phone: guest?.phone || "",
      email: guest?.email || "",
      category: guest?.category || "regular",
      scheduledDate: guest?.scheduledDate ? new Date(guest.scheduledDate) : undefined,
      scheduledTime: guest?.scheduledTime || "",
      notes: guest?.notes || "",
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

      // Check for duplicate guest (same name and phone number)
      if (mode === "create" && await GuestStorage.checkDuplicateGuest(data.name, data.phone)) {
        setError("Data tamu dengan nama dan nomor telepon yang sama sudah terdaftar")
        toast.error("Gagal menambahkan tamu: Data sudah ada")
        return
      }
      
      // If editing, check for duplicates but exclude the current guest
      if (mode === "edit" && guest?.id && await GuestStorage.checkDuplicateGuest(data.name, data.phone, guest.id)) {
        setError("Data tamu dengan nama dan nomor telepon yang sama sudah terdaftar")
        toast.error("Gagal memperbarui: Data sudah digunakan tamu lain")
        return
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
        await GuestStorage.addGuest(guestData)
        toast.success("Tamu berhasil ditambahkan")
      } else {
        await GuestStorage.updateGuest(guestData.id, guestData)
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
    <div className="h-full flex flex-col">
      <Form {...form}>
        <form 
          id="guest-form"
          onSubmit={form.handleSubmit(onSubmit)} 
          className="flex-1 flex flex-col space-y-2 xs:space-y-3 sm:space-y-4 p-2 xs:p-3 sm:p-4 overflow-y-auto"
          style={{
            maxHeight: 'calc(100vh - 100px)', // Adjust based on your header/footer height
            scrollbarWidth: 'thin',
          }}
        >
          {error && <p className="text-xs sm:text-sm text-red-600 px-1">{error}</p>}

        {isSubmitting && (
          <div className="space-y-2 bg-muted/50 p-2 sm:p-3 rounded-lg">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">
                {progress < 50 ? "Memvalidasi..." : progress < 80 ? "Menyimpan..." : "Menyelesaikan..."}
              </span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5 sm:h-2" />
          </div>
        )}

        <div className="space-y-2 xs:space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="xs:col-span-2">
                  <FormLabel className="text-[11px] xs:text-xs sm:text-sm">{t.fullName} <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      disabled={isSubmitting} 
                      className="text-xs sm:text-sm h-8 xs:h-9 sm:h-10"
                      placeholder="Nama lengkap tamu"
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] xs:text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] xs:text-xs sm:text-sm">{t.institution} <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      disabled={isSubmitting} 
                      className="text-xs sm:text-sm h-8 xs:h-9 sm:h-10"
                      placeholder="Nama instansi/perusahaan"
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] xs:text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] xs:text-xs sm:text-sm">{t.purpose} <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      disabled={isSubmitting} 
                      className="text-xs sm:text-sm h-8 xs:h-9 sm:h-10"
                      placeholder="Tujuan kunjungan"
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] xs:text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] xs:text-xs sm:text-sm">{t.phone} <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      disabled={isSubmitting} 
                      type="tel" 
                      className="text-xs sm:text-sm h-8 xs:h-9 sm:h-10"
                      placeholder="Nomor telepon/WA"
                      inputMode="tel"
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] xs:text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] xs:text-xs sm:text-sm">{t.email} <span className="text-muted-foreground text-[10px] xs:text-xs">(Opsional)</span></FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      disabled={isSubmitting} 
                      type="email" 
                      className="text-xs sm:text-sm h-8 xs:h-9 sm:h-10"
                      placeholder="email@contoh.com"
                      inputMode="email"
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] xs:text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] xs:text-xs sm:text-sm">Kategori Tamu <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-xs sm:text-sm h-8 xs:h-9 sm:h-10">
                        <SelectValue placeholder="Pilih kategori" className="text-[11px] xs:text-xs sm:text-sm" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="text-xs sm:text-sm">
                      <SelectItem value="VIP">VIP</SelectItem>
                      <SelectItem value="regular">Reguler</SelectItem>
                      <SelectItem value="supplier">Supplier</SelectItem>
                      <SelectItem value="intern">Magang</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scheduledDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-[11px] xs:text-xs sm:text-sm">Tanggal Dijadwalkan <span className="text-muted-foreground text-[10px] xs:text-xs">(Opsional)</span></FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal h-8 xs:h-9 sm:h-10 text-[11px] xs:text-xs sm:text-sm",
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
                  <FormLabel className="text-[11px] xs:text-xs sm:text-sm">Waktu Dijadwalkan <span className="text-muted-foreground text-[10px] xs:text-xs">(Opsional)</span></FormLabel>
                  <FormControl>
                    <Input 
                      type="time" 
                      {...field} 
                      disabled={isSubmitting} 
                      className="h-8 xs:h-9 sm:h-10 text-xs sm:text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] xs:text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="xs:col-span-2">
                  <FormLabel className="text-[11px] xs:text-xs sm:text-sm">Catatan Tambahan <span className="text-muted-foreground text-[10px] xs:text-xs">(Opsional)</span></FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={isSubmitting}
                      placeholder="Keterangan tambahan"
                      className="min-h-[60px] xs:min-h-[80px] sm:min-h-[100px] text-xs sm:text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] xs:text-xs" />
                </FormItem>
              )}
            />
          </div>
        </div>

          {/* Form fields remain the same */}
        </form>
      </Form>
      
      <div className="p-2 xs:p-3 sm:p-4 border-t bg-background/80 backdrop-blur-sm">
        <div className="flex justify-end gap-2 xs:gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onSuccess}
            disabled={isSubmitting}
            size="sm"
            className="h-8 xs:h-9 sm:h-10 text-[11px] xs:text-xs sm:text-sm flex-1 xs:flex-none"
          >
            Batal
          </Button>
          <Button 
            type="submit" 
            form="guest-form"
            disabled={isSubmitting}
            size="sm"
            className="h-8 xs:h-9 sm:h-10 text-[11px] xs:text-xs sm:text-sm flex-1 xs:flex-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                <span className="text-xs sm:text-sm">
                  {mode === "create" ? "Menambahkan..." : "Menyimpan..."}
                </span>
              </>
            ) : mode === "create" ? (
              <>
                <UserPlus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">Tambah Tamu</span>
              </>
            ) : (
              <span className="text-xs sm:text-sm">Simpan Perubahan</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
