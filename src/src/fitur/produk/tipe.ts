import { Timestamp } from 'firebase/firestore';

export interface Produk {
  id: string;
  nama: string;
  deskripsi: string;
  kategori: string;
  harga: number;
  stok: number;
  imageUrl: string;
  aktif: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Promo {
  id: string;
  isActive: boolean;
  text: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  updatedAt?: Timestamp;
}

export interface Order {
  id: string;
  status: 'draft' | 'paid' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  promoSnapshot: {
    text: string;
    discountType: 'PERCENT' | 'FIXED';
    discountValue: number;
  } | null;
  createdAt?: Timestamp;
  paidAt?: Timestamp | null;
}

export interface OrderItem {
  productId: string;
  nama: string;
  harga: number;
  qty: number;
  subtotal: number;
}

export type Page = 'beranda' | 'cart' | 'checkout' | 'kelola' | 'tentang' | 'kontak';
