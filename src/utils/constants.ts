// Application Constants
export const APP_NAME = 'Toko Nusa Indah';
export const APP_TAGLINE = 'Belanja Mudah, Harga Terjangkau';
export const ADMIN_PASSWORD = 'nusaindah123';

// Theme Colors
export const THEME_COLORS = {
  primary: 'emerald',
  primaryHex: '#10b981'
};

// LocalStorage Keys
export const STORAGE_KEYS = {
  PRODUCTS: 'toko_nusa_products',
  CART: 'toko_nusa_cart',
  PROMO_BANNERS: 'toko_nusa_promo_banners'
};

// Default Promo Banners
export const DEFAULT_PROMO_BANNERS = [
  {
    id: 1,
    text: '🎉 Selamat Datang di Toko Nusa Indah - Belanja Hemat Setiap Hari!',
    backgroundColor: '#10b981',
    textColor: '#ffffff',
    isActive: true
  },
  {
    id: 2,
    text: '⚡ Promo Spesial! Diskon hingga 20% untuk pembelian minimal Rp 100.000',
    backgroundColor: '#f59e0b',
    textColor: '#ffffff',
    isActive: true
  }
];

// Pagination
export const ITEMS_PER_PAGE = 12;

// Format Currency
export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};