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
import type { Guest, GuestFormData, SpecialRequirement } from "@/types/guest"
import { useLanguage } from "@/contexts/language-context"
import { toast } from "sonner"
import { Loader2, UserPlus, XCircle, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AutoCheckoutSettings } from "@/components/auto-checkout-settings"
import { SpecialRequirementsForm } from "@/components/special-requirements-form"
import { PrivacySettings } from "@/components/privacy-settings"
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
  const [requirements, setRequirements] = useState<SpecialRequirement[]>(guest?.specialRequirements ?? [])
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
        specialRequirements: requirements || [],
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
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>}

          {isSubmitting && (
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {progress < 50 ? "Memvalidasi..." : progress < 80 ? "Menyimpan..." : "Menyelesaikan..."}
                </span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <Tabs defaultValue="guest-info" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
              <TabsTrigger value="guest-info" className="text-xs sm:text-sm px-2 py-2">
                Info
              </TabsTrigger>
              <TabsTrigger value="requirements" className="text-xs sm:text-sm px-2 py-2">
                Kebutuhan
              </TabsTrigger>
              <TabsTrigger value="privacy" className="text-xs sm:text-sm px-2 py-2">
                Privasi
              </TabsTrigger>
              <TabsTrigger value="autoCheckout" className="text-xs sm:text-sm px-2 py-2">
                Checkout
              </TabsTrigger>
            </TabsList>

            <TabsContent value="guest-info" className="space-y-4 sm:space-y-6 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel className="text-sm font-medium">{t.fullName}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isSubmitting}
                          className="h-11 text-base"
                          placeholder="Masukkan nama lengkap"
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
                    <FormItem className="sm:col-span-2">
                      <FormLabel className="text-sm font-medium">{t.institution}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isSubmitting}
                          className="h-11 text-base"
                          placeholder="Nama instansi/perusahaan"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel className="text-sm font-medium">{t.purpose}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isSubmitting}
                          className="h-11 text-base"
                          placeholder="Tujuan kunjungan"
                        />
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
                      <FormLabel className="text-sm font-medium">Nomor Telepon</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isSubmitting}
                          type="tel"
                          className="h-11 text-base"
                          placeholder="08xxxxxxxxxx"
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
                      <FormLabel className="text-sm font-medium">Email (Opsional)</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          {...field}
                          disabled={isSubmitting}
                          className="h-11 text-base"
                          placeholder="email@example.com"
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
                      <FormLabel className="text-sm font-medium">Kategori</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                        <FormControl>
                          <SelectTrigger className="h-11 text-base">
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
                      <FormLabel className="text-sm font-medium">Tanggal Dijadwalkan (Opsional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "h-11 pl-3 text-left font-normal text-base",
                                !field.value && "text-muted-foreground",
                              )}
                              disabled={isSubmitting}
                            >
                              {field.value ? format(field.value, "PPP", { locale: id }) : "Pilih tanggal"}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
                      <FormLabel className="text-sm font-medium">Waktu Dijadwalkan (Opsional)</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} disabled={isSubmitting} className="h-11 text-base" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel className="text-sm font-medium">Catatan (Opsional)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={isSubmitting}
                          className="min-h-[100px] text-base resize-none"
                          placeholder="Tambahkan catatan khusus..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            {/* Sub-form hanya jika guest sudah ada / tidak undefined */}
            {guest && (
              <>
                <TabsContent value="requirements" className="space-y-4 mt-4">
                  <SpecialRequirementsForm
                    guest={{
                      ...form.getValues(),
                      id: guest?.id || "new",
                      visitDate: new Date(),
                      visitTime: getTimeOfDay(new Date()),
                      checkInTime: new Date().toISOString(),
                      status: "checked-in",
                      specialRequirements: requirements,
                      checkOutTime: guest?.checkOutTime,
                      checkedInBy: guest?.checkedInBy || "system",
                      checkedOutBy: guest?.checkedOutBy,
                      updatedAt: new Date().toISOString(),
                      createdAt: guest?.createdAt || new Date().toISOString(),
                    }}
                    onUpdate={(updatedRequirements) => {
                      setRequirements(updatedRequirements)
                    }}
                    className="border rounded-lg p-3 sm:p-4"
                  />
                  <p className="text-xs text-muted-foreground px-1">
                    Tambahkan kebutuhan khusus untuk tamu ini. Kebutuhan ini akan digunakan untuk mempersiapkan
                    fasilitas yang diperlukan.
                  </p>
                </TabsContent>

                <TabsContent value="privacy" className="space-y-4 sm:space-y-6 mt-4">
                  <div className="border rounded-lg p-3 sm:p-4">
                    <PrivacySettings guest={guest || {}} onUpdate={onSuccess} />
                  </div>
                </TabsContent>

                <TabsContent value="autoCheckout" className="space-y-4 sm:space-y-6 mt-4">
                  <div className="border rounded-lg p-3 sm:p-4">
                    <AutoCheckoutSettings guest={guest || {}} onUpdate={onSuccess} />
                  </div>
                </TabsContent>
              </>
            )}
          </Tabs>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto h-11 text-base font-medium">
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
    </div>
  )
}
