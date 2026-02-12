// ============================================
// HITUNG PROMO - AUTO APPLY
// ============================================
// Logic untuk menghitung promo otomatis tanpa input manual dari user

import type { PromoConfig } from '../../database/koleksi';
import { extractPersenFromTeks } from '../../database/promoService';

export interface RincianBelanja {
  subtotal: number;
  promo: {
    aktif: boolean;
    teks: string;
    persen: number;
    discountNominal: number;
  } | null;
  total: number;
}

// ============================================
// HITUNG TOTAL DENGAN PROMO AUTO-APPLY
// ============================================
// GANTI INI: Jika aturan diskon berbeda, sesuaikan di sini
export function hitungTotalDenganPromo(
  subtotal: number,
  promoConfig: PromoConfig | null
): RincianBelanja {
  // Jika promo tidak aktif, tidak ada diskon
  if (!promoConfig || !promoConfig.aktif || !promoConfig.teks) {
    return {
      subtotal,
      promo: null,
      total: subtotal,
    };
  }
  
  // Extract persen dari teks promo
  // Contoh: "Diskon 30% hari ini!" → 30%
  // Jika tidak ada angka → pakai persenDefault
  const persen = extractPersenFromTeks(promoConfig.teks, promoConfig.persenDefault);
  
  // Hitung diskon
  const discountNominal = Math.floor((subtotal * persen) / 100);
  const total = subtotal - discountNominal;
  
  return {
    subtotal,
    promo: {
      aktif: true,
      teks: promoConfig.teks,
      persen,
      discountNominal,
    },
    total: Math.max(0, total), // Pastikan tidak negatif
  };
}
