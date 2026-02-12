// FILE: database/pesanan.ts
// FUNGSI SIMPAN PESANAN DAN KURANGI STOK (ATOMIC)

import { collection, addDoc, writeBatch, doc, getDoc, Timestamp } from 'firebase/firestore';
import { getDb } from './firebase';

// GANTI INI: Nama koleksi di Firestore
const PESANAN_COLLECTION = 'pesanan';
const PRODUK_COLLECTION = 'produk';

// Tipe data untuk item pesanan
export type PesananItem = {
  productId: number;
  nama: string;
  harga: number;
  qty: number;
  subtotal: number;
};

// Tipe data untuk pesanan lengkap
export type PesananData = {
  items: PesananItem[];
  subtotal: number;
  diskonPersen: number;
  diskonNominal: number;
  total: number;
};

/**
 * FUNGSI UTAMA: simpanPesananDanKurangiStok
 * 
 * Fungsi ini melakukan 2 hal secara atomic:
 * 1. Simpan pesanan ke Firestore (koleksi: pesanan)
 * 2. Kurangi stok produk di Firestore (koleksi: produk)
 * 
 * PENTING: Menggunakan Firestore writeBatch untuk atomic operation
 * Jika stok tidak cukup, transaksi akan dibatalkan dan tidak ada perubahan
 * 
 * @param data - Data pesanan lengkap
 * @returns { success: true, orderId: string } atau { success: false, error: string }
 */
export async function simpanPesananDanKurangiStok(
  data: PesananData
): Promise<{ success: true; orderId: string } | { success: false; error: string }> {
  try {
    const db = getDb();
    const batch = writeBatch(db);

    // STEP 1: VALIDASI STOK
    // Cek apakah semua produk memiliki stok yang cukup
    const stokValidation = await Promise.all(
      data.items.map(async (item) => {
        const produkRef = doc(db, PRODUK_COLLECTION, item.productId.toString());
        const produkSnap = await getDoc(produkRef);

        if (!produkSnap.exists()) {
          return { valid: false, error: `Produk ${item.nama} tidak ditemukan` };
        }

        const currentStok = produkSnap.data().stok || 0;

        if (currentStok < item.qty) {
          return {
            valid: false,
            error: `Stok ${item.nama} tidak cukup. Tersedia: ${currentStok}, diminta: ${item.qty}`
          };
        }

        return { valid: true, ref: produkRef, qty: item.qty, currentStok };
      })
    );

    // Cek apakah ada validasi yang gagal
    const invalidItem = stokValidation.find((v) => !v.valid);
    if (invalidItem) {
      return { success: false, error: invalidItem.error || 'Validasi stok gagal' };
    }

    // STEP 2: SIMPAN PESANAN
    // Buat document pesanan baru
    const pesananRef = doc(collection(db, PESANAN_COLLECTION));
    const pesananData = {
      items: data.items,
      subtotal: data.subtotal,
      diskonPersen: data.diskonPersen,
      diskonNominal: data.diskonNominal,
      total: data.total,
      tanggal: Timestamp.now(),
      status: 'completed'
    };

    batch.set(pesananRef, pesananData);

    // STEP 3: KURANGI STOK PRODUK (ATOMIC)
    // Update stok untuk setiap produk dalam batch
    stokValidation.forEach((validation) => {
      if (validation.valid && validation.ref) {
        const newStok = validation.currentStok - validation.qty;
        batch.update(validation.ref, { stok: newStok });
      }
    });

    // STEP 4: COMMIT BATCH (ATOMIC)
    // Semua operasi di atas akan sukses atau gagal bersama-sama
    await batch.commit();

    return {
      success: true,
      orderId: pesananRef.id
    };

  } catch (error: any) {
    console.error('Error simpan pesanan:', error);
    
    // Better error messages for common issues
    let errorMessage = error.message || 'Gagal menyimpan pesanan';
    
    if (error.message?.includes('Firebase not configured')) {
      errorMessage = 'Firebase belum dikonfigurasi. Pesanan tidak dapat disimpan.';
    } else if (error.message?.includes('offline')) {
      errorMessage = 'Tidak dapat terhubung ke database. Periksa koneksi internet Anda.';
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
}