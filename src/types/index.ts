// Product Types
export type Barang = {
  id_barang: number;
  id_user: number;
  nama_barang: string;
  deskripsi: string;
  harga: number;
  stok: number;
  gambar: string;
  kategori: string;
};

// Cart Types
export type DetailKeranjang = {
  id_detail: number;
  id_barang: number;
  nama_barang: string; // Added for CheckoutModal
  harga: number; // Added for CheckoutModal
  jumlah: number;
  subtotal: number;
};

export type Keranjang = {
  id_keranjang: number;
  id_user: number;
  tanggal_dibuat: string;
  items: DetailKeranjang[];
};

// Page Types
export type Page = 'beranda' | 'kelola' | 'cart' | 'tentang' | 'kontak';

// Promo Banner Types
export type PromoBannerData = {
  id: string;
  text: string;
  backgroundColor: string;
  textColor: string;
  isActive: boolean;
  createdAt?: Date;
};
