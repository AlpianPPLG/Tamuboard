import { Metadata } from 'next';
import { SettingsContent } from './settings-content';

export const metadata: Metadata = {
  title: 'Pengaturan - Buku Tamu Digital',
  description: 'Kelola preferensi tampilan dan pengaturan aplikasi',
};

export default function SettingsPage() {
  return <SettingsContent />;
}
