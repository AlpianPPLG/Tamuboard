import { Metadata } from "next";
import PanduanPengguna from "@/components/PanduanPengguna";

export const metadata: Metadata = {
  title: "Panduan Pengguna | TamuBoard",
  description: "Panduan lengkap penggunaan aplikasi TamuBoard",
};

export default function PanduanPenggunaPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Panduan Pengguna</h1>
        <PanduanPengguna />
      </div>
    </div>
  );
}
