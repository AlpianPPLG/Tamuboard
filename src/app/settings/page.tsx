import { Metadata } from 'next';
import { PageHeader } from '@/components/navigation/page-header';

export const metadata: Metadata = {
  title: 'Settings - Buku Tamu Digital',
  description: 'Manage your account settings and preferences',
};

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <PageHeader showForwardButton={false} showSettingsButton={false} />
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Settings</h1>
        <p className="text-muted-foreground">Kelola pengaturan akun Anda</p>
      </div>

      <div className="space-y-8">
        {/* Account Settings */}
        <section className="bg-card p-6 rounded-lg shadow-sm border">
          <h2 className="text-2xl font-semibold mb-6">Akun</h2>
          
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-medium">Nama</h3>
                <p className="text-sm text-muted-foreground">Ubah nama yang ditampilkan</p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/90 transition-colors">
                Ubah
              </button>
            </div>

            <div className="h-px bg-border w-full"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-sm text-muted-foreground">user@example.com</p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/90 transition-colors">
                Ubah
              </button>
            </div>
          </div>
        </section>

        {/* Notification Settings */}
        <section className="bg-card p-6 rounded-lg shadow-sm border">
          <h2 className="text-2xl font-semibold mb-6">Notifikasi</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-muted-foreground">Dapatkan pemberitahuan melalui email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Push Notifications</h3>
                <p className="text-sm text-muted-foreground">Aktifkan notifikasi browser</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Theme Settings */}
        <section className="bg-card p-6 rounded-lg shadow-sm border">
          <h2 className="text-2xl font-semibold mb-6">Tema</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Mode Gelap</h3>
                <p className="text-sm text-muted-foreground">Ubah tampilan ke mode gelap</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="border border-destructive/30 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-destructive">Zona Berbahaya</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Hapus Akun</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Menghapus akun Anda akan menghapus semua data yang terkait dengan akun ini. Tindakan ini tidak dapat dibatalkan.
              </p>
              <button className="px-4 py-2 text-sm font-medium text-destructive border border-destructive/30 rounded-md hover:bg-destructive/10 transition-colors">
                Hapus Akun Saya
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
