import type { Promo } from '../produk/tipe';
import type { ItemKeranjang } from '../keranjang/tipe';
import type { RincianCheckout } from './tipe';

/**
 * HITUNG TOTAL CHECKOUT
 * 
 * Fungsi ini menghitung:
 * 1. Subtotal dari semua items
 * 2. Diskon dari promo (auto-apply jika promo aktif)
 * 3. Total akhir
 * 
 * PENTING: Promo otomatis terpasang jika isActive = true
 */
export function hitungTotalCheckout(
  items: ItemKeranjang[],
  promo: Promo | null
): RincianCheckout {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  
  let diskon = 0;
  
  if (promo && promo.isActive) {
    if (promo.discountType === 'PERCENT') {
      diskon = Math.floor((subtotal * promo.discountValue) / 100);
    } else if (promo.discountType === 'FIXED') {
      diskon = Math.min(promo.discountValue, subtotal);
    }
  }
  
  const total = Math.max(0, subtotal - diskon);
  
  return {
    items,
    subtotal,
    diskon,
    total,
    promo: promo && promo.isActive ? promo : null,
  };
}

/**
 * FORMAT PROMO SNAPSHOT
 * 
 * Simpan snapshot promo saat order dibuat
 * untuk history jika promo berubah/dihapus
 */
export function buatPromoSnapshot(promo: Promo | null) {
  if (!promo || !promo.isActive) return null;
  
  return {
    text: promo.text,
    discountType: promo.discountType,
    discountValue: promo.discountValue,
  };
}
