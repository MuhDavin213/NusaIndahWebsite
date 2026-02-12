// FILE: database/promo.ts
// FUNGSI UNTUK AMBIL PROMO CONFIG DARI FIREBASE

import { doc, getDoc } from 'firebase/firestore';
import { getDb } from './firebase';

// GANTI INI: Nama koleksi dan document ID di Firestore
const PROMO_COLLECTION = 'konfigurasi';
const PROMO_DOC_ID = 'promo';

// Tipe data promo
export type PromoConfig = {
  aktif: boolean;
  discountPercent: number; // 0-100
};

/**
 * FUNGSI: getPromoConfig
 * Ambil konfigurasi promo dari Firestore
 * Return: PromoConfig jika aktif, atau null jika tidak aktif / error
 */
export async function getPromoConfig(): Promise<PromoConfig | null> {
  try {
    const db = getDb();
    const promoRef = doc(db, PROMO_COLLECTION, PROMO_DOC_ID);
    const promoSnap = await getDoc(promoRef);

    if (!promoSnap.exists()) {
      console.warn('Promo config tidak ditemukan di Firestore');
      return null;
    }

    const data = promoSnap.data() as PromoConfig;

    // Jika promo tidak aktif, return null
    if (!data.aktif) {
      return null;
    }

    // Validasi discountPercent
    if (typeof data.discountPercent !== 'number' || data.discountPercent < 0 || data.discountPercent > 100) {
      console.warn('Invalid discountPercent:', data.discountPercent);
      return null;
    }

    return data;
  } catch (error: any) {
    // Graceful degradation: return null instead of throwing
    // Only log to console, don't show error to user
    if (error.message?.includes('Firebase not configured')) {
      console.info('ℹ️ Firebase promo feature disabled: Firebase not configured yet');
    } else {
      console.info('ℹ️ Firebase promo feature disabled:', error.message);
    }
    return null;
  }
}

/**
 * FUNGSI: buildDiscountOptions
 * Generate opsi dropdown discount dari 0% sampai maxPercent
 * @param maxPercent - nilai maksimum discount (dari promo)
 * @returns array of { value: number, label: string }
 */
export function buildDiscountOptions(maxPercent: number): { value: number; label: string }[] {
  const options: { value: number; label: string }[] = [];
  
  for (let i = 0; i <= maxPercent; i++) {
    options.push({
      value: i,
      label: `${i}%`
    });
  }
  
  return options;
}

/**
 * FUNGSI: hitungDiskon
 * Hitung diskon berdasarkan subtotal dan discount percent yang dipilih
 * @param subtotal - total harga sebelum diskon
 * @param discountPercent - persentase diskon yang dipilih (0-100)
 * @returns { diskonNominal: number, totalAkhir: number }
 */
export function hitungDiskon(subtotal: number, discountPercent: number): {
  diskonNominal: number;
  totalAkhir: number;
} {
  const diskonNominal = Math.round(subtotal * (discountPercent / 100));
  const totalAkhir = Math.max(0, subtotal - diskonNominal);

  return {
    diskonNominal,
    totalAkhir
  };
}
