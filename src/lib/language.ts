"use client"

export type Language = 'id' | 'en';

export interface Translations {
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
  
  // Footer
  madeWith: string;
  allRightsReserved: string;
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
    
    // Footer
    madeWith: 'Made with',
    allRightsReserved: 'All rights reserved',
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
    successCheckIn: 'successfully checked in!',
    successCheckOut: 'has checked out',
    successUpdate: 'successfully updated!',
    successDelete: 'successfully deleted',
    
    // Footer
    madeWith: 'Made with',
    allRightsReserved: 'All rights reserved',
  },
};

export function useTranslation(language: Language) {
  return translations[language];
}