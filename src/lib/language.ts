"use client"

import { ReactNode } from "react";

export type Language = 'id' | 'en';

export interface Translations {
  all: ReactNode;
  date: ReactNode;
  name: ReactNode;
  newest: ReactNode;
  oldest: ReactNode;
  status: ReactNode;
  // Header
  appTitle: string;
  appSubtitle: string;
  searchPlaceholder: string;
  addGuest: string;
  
  // Form
  fullName: string;
  institution: string;
  purpose: string;
  phone: string;
  email: string;
  category: string;
  scheduledDate: string;
  scheduledTime: string;
  notes: string;
  checkIn: string;
  updateData: string;
  
  // Categories
  vip: string;
  regular: string;
  supplier: string;
  intern: string;
  
  // Status
  checkedIn: string;
  checkedOut: string;
  
  // Time periods
  morning: string;
  afternoon: string;
  evening: string;
  
  // Actions
  edit: string;
  delete: string;
  viewDetail: string;
  checkOut: string;
  
  // Feedback
  rating: string;
  feedback: string;
  submitFeedback: string;
  
  // Stats
  todayGuests: string;
  currentlyCheckedIn: string;
  thisMonth: string;
  thisYear: string;
  vipGuests: string;
  scheduledToday: string;
  
  // Messages
  successCheckIn: string;
  successCheckOut: string;
  successUpdate: string;
  successDelete: string;
  restoreSuccess: string;
  restoreError: string;
  deleteSuccess: string;
  deleteError: string;
  bulkRestoreSuccess: string;
  bulkRestoreError: string;
  bulkDeleteSuccess: string;
  bulkDeleteError: string;
  
  // Footer
  madeWith: string;
  allRightsReserved: string;
  
  // Trash
  trash: {
    title: string;
    empty: string;
    restore: string;
    deletePermanent: string;
    deleteConfirmation: string;
    restoreConfirmation: string;
    expiresToday: string;
    expiresInOneDay: string;
    expiresInDays: string;
    deletedOn: string;
  };
}

export const translations: Record<Language, Translations> = {
  id: {
    // Header
    appTitle: 'Buku Tamu',
    appSubtitle: 'Sistem Pencatatan Tamu Digital',
    searchPlaceholder: 'Cari tamu...',
    addGuest: 'Tambah Tamu',

    // Form
    fullName: 'Nama Lengkap',
    institution: 'Instansi/Perusahaan',
    purpose: 'Keperluan',
    phone: 'Nomor Telepon',
    email: 'Email (Opsional)',
    category: 'Kategori Tamu',
    scheduledDate: 'Tanggal Kunjungan',
    scheduledTime: 'Waktu Kunjungan',
    notes: 'Catatan (Opsional)',
    checkIn: 'Check In',
    updateData: 'Perbarui Data',

    // Categories
    vip: 'VIP',
    regular: 'Biasa',
    supplier: 'Supplier',
    intern: 'Siswa PKL',

    // Status
    checkedIn: 'Check In',
    checkedOut: 'Check Out',

    // Time periods
    morning: 'Pagi',
    afternoon: 'Siang',
    evening: 'Sore',

    // Actions
    edit: 'Edit Data',
    delete: 'Hapus',
    viewDetail: 'Lihat Detail',
    checkOut: 'Check Out',

    // Feedback
    rating: 'Rating',
    feedback: 'Feedback',
    submitFeedback: 'Kirim Feedback',

    // Stats
    todayGuests: 'Tamu Hari Ini',
    currentlyCheckedIn: 'Sedang Check In',
    thisMonth: 'Bulan Ini',
    thisYear: 'Tahun Ini',
    vipGuests: 'Tamu VIP',
    scheduledToday: 'Jadwal Hari Ini',

    // Messages
    successCheckIn: 'berhasil check in!',
    successCheckOut: 'telah check out',
    successUpdate: 'berhasil diperbarui!',
    successDelete: 'berhasil dihapus',
    restoreSuccess: 'Tamu berhasil dikembalikan',
    restoreError: 'Gagal mengembalikan tamu',
    deleteSuccess: 'Tamu berhasil dihapus permanen',
    deleteError: 'Gagal menghapus tamu',
    bulkRestoreSuccess: '{count} tamu berhasil dikembalikan',
    bulkRestoreError: 'Gagal mengembalikan beberapa tamu',
    bulkDeleteSuccess: '{count} tamu berhasil dihapus permanen',
    bulkDeleteError: 'Gagal menghapus beberapa tamu',

    // Footer
    madeWith: 'Made with',
    allRightsReserved: 'All rights reserved',
    
    // Trash
    trash: {
      title: 'Tempat Sampah',
      empty: 'Tidak ada data di tempat sampah',
      restore: 'Kembalikan',
      deletePermanent: 'Hapus Permanen',
      deleteConfirmation: 'Apakah Anda yakin ingin menghapus permanen tamu ini? Tindakan ini tidak dapat dibatalkan.',
      restoreConfirmation: 'Apakah Anda yakin ingin mengembalikan tamu ini?',
      expiresToday: 'Kedaluwarsa hari ini',
      expiresInOneDay: '1 hari lagi',
      expiresInDays: '{days} hari lagi',
      deletedOn: 'Dihapus pada',
    },
    all: undefined,
    date: undefined,
    name: undefined,
    newest: undefined,
    oldest: undefined,
    status: undefined
  },
  en: {
    // Header
    appTitle: 'Guest Book',
    appSubtitle: 'Digital Guest Registration System',
    searchPlaceholder: 'Search guests...',
    addGuest: 'Add Guest',

    // Form
    fullName: 'Full Name',
    institution: 'Institution/Company',
    purpose: 'Purpose',
    phone: 'Phone Number',
    email: 'Email (Optional)',
    category: 'Guest Category',
    scheduledDate: 'Visit Date',
    scheduledTime: 'Visit Time',
    notes: 'Notes (Optional)',
    checkIn: 'Check In',
    updateData: 'Update Data',

    // Categories
    vip: 'VIP',
    regular: 'Regular',
    supplier: 'Supplier',
    intern: 'Intern',

    // Status
    checkedIn: 'Checked In',
    checkedOut: 'Checked Out',

    // Time periods
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',

    // Actions
    edit: 'Edit Data',
    delete: 'Delete',
    viewDetail: 'View Detail',
    checkOut: 'Check Out',

    // Feedback
    rating: 'Rating',
    feedback: 'Feedback',
    submitFeedback: 'Submit Feedback',

    // Stats
    todayGuests: 'Today\'s Guests',
    currentlyCheckedIn: 'Currently Checked In',
    thisMonth: 'This Month',
    thisYear: 'This Year',
    vipGuests: 'VIP Guests',
    scheduledToday: 'Scheduled Today',

    // Messages
    successCheckIn: 'Successfully checked in!',
    successCheckOut: 'has checked out',
    successUpdate: 'successfully updated!',
    successDelete: 'successfully deleted',
    restoreSuccess: 'Guest restored successfully',
    restoreError: 'Failed to restore guest',
    deleteSuccess: 'Guest permanently deleted',
    deleteError: 'Failed to delete guest',
    bulkRestoreSuccess: 'Restored {count} guests',
    bulkRestoreError: 'Failed to restore some guests',
    bulkDeleteSuccess: 'Permanently deleted {count} guests',
    bulkDeleteError: 'Failed to delete some guests',

    // Footer
    madeWith: 'Made with',
    allRightsReserved: 'All rights reserved',
    
    // Trash
    trash: {
      title: 'Trash',
      empty: 'Trash is empty',
      restore: 'Restore',
      deletePermanent: 'Delete Permanently',
      deleteConfirmation: 'Are you sure you want to permanently delete this guest? This action cannot be undone.',
      restoreConfirmation: 'Are you sure you want to restore this guest?',
      expiresToday: 'Expires today',
      expiresInOneDay: '1 day remaining',
      expiresInDays: '{days} days remaining',
      deletedOn: 'Deleted on',
    },
    all: undefined,
    date: undefined,
    name: undefined,
    newest: undefined,
    oldest: undefined,
    status: undefined
  },
};

export function useTranslation(language: Language) {
  return translations[language];
}