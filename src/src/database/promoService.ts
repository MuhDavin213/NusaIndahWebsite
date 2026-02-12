// ============================================
// PROMO SERVICE - CRUD FIRESTORE
// ============================================
// Service untuk operasi promo di Firestore
// GANTI INI: Jika struktur promo berbeda, sesuaikan di type PromoConfig

import {
  getDoc,
  setDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { konfigurasiDoc } from './koleksi';
import type { PromoConfig } from './koleksi';

// ============================================
// READ - Ambil konfigurasi promo
// ============================================
export async function ambilPromo(): Promise<PromoConfig> {
  try {
    const snapshot = await getDoc(konfigurasiDoc);
    
    if (!snapshot.exists()) {
      return {
        aktif: false,
        teks: '',
        persenDefault: 10,
      };
    }
    
    return snapshot.data() as PromoConfig;
  } catch (error) {
    console.error('Error ambil promo:', error);
    throw error;
  }
}

// ============================================
// REALTIME - Subscribe promo (onSnapshot)
// ============================================
// GANTI INI: Untuk realtime update promo di banner
export function subscribePromo(callback: (promo: PromoConfig) => void) {
  return onSnapshot(
    konfigurasiDoc,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as PromoConfig);
      } else {
        callback({
          aktif: false,
          teks: '',
          persenDefault: 10,
        });
      }
    },
    (error) => {
      console.error('Error subscribe promo:', error);
    }
  );
}

// ============================================
// UPDATE - Update promo
// ============================================
export async function updatePromo(data: Omit<PromoConfig, 'diubahPada'>) {
  try {
    await setDoc(konfigurasiDoc, {
      ...data,
      diubahPada: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error update promo:', error);
    throw error;
  }
}

// ============================================
// HELPER - Extract persen dari teks promo
// ============================================
// Contoh: "Diskon 30% hari ini!" → 30
// Jika tidak ada angka → gunakan persenDefault
export function extractPersenFromTeks(teks: string, persenDefault: number): number {
  const match = teks.match(/(\d+)%/);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  return persenDefault;
}
