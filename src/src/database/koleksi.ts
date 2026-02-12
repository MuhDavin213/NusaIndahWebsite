// ============================================
// FIRESTORE COLLECTION REFERENCES
// ============================================
// GANTI INI: Jika ingin ganti nama koleksi, ubah di sini

import { collection, doc } from 'firebase/firestore';
import { db } from './firebase';

// GANTI INI: Nama koleksi di Firestore (sesuaikan dengan preferensi Anda)
export const NAMA_KOLEKSI = {
  PRODUK: 'produk',
  PESANAN: 'pesanan',
  KONFIGURASI: 'konfigurasi',
} as const;

// Collection references
export const produkCollection = collection(db, NAMA_KOLEKSI.PRODUK);
export const pesananCollection = collection(db, NAMA_KOLEKSI.PESANAN);
export const konfigurasiDoc = doc(db, NAMA_KOLEKSI.KONFIGURASI, 'promo');

// Types untuk TypeScript
export interface Produk {
  id: string;
  nama: string;
  deskripsi: string;
  harga: number;
  stok: number;
  kategori: string;
  gambar: string;
  aktif: boolean;
  dibuatPada?: any;
  diubahPada?: any;
}

export interface PromoConfig {
  aktif: boolean;
  teks: string;
  persenDefault: number;
  diubahPada?: any;
}

export interface OrderItem {
  productId: string;
  nama: string;
  harga: number;
  qty: number;
  subtotal: number;
}

export interface Order {
  id?: string;
  items: OrderItem[];
  subtotal: number;
  promo: {
    aktif: boolean;
    teks: string;
    persen: number;
    discountNominal: number;
  } | null;
  total: number;
  dibuatPada: any;
}
