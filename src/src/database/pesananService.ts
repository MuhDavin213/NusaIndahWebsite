// ============================================
// PESANAN SERVICE - SIMPAN ORDER + UPDATE STOK
// ============================================
// Service untuk simpan pesanan dan update stok secara ATOMIC
// GANTI INI: Jika struktur pesanan berbeda, sesuaikan di type Order

import {
  addDoc,
  doc,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { pesananCollection, produkCollection } from './koleksi';
import type { Order } from './koleksi';

// ============================================
// SIMPAN PESANAN + UPDATE STOK (ATOMIC)
// ============================================
// GANTI INI: Fungsi ini dipanggil saat Print Kuitansi
// - Simpan order ke koleksi "pesanan"
// - Kurangi stok produk secara atomic (transaction)
// - Jika stok tidak cukup, rollback otomatis

export async function simpanPesananDanUpdateStok(
  orderData: Omit<Order, 'id' | 'dibuatPada'>
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    // Gunakan Firestore Transaction untuk atomic operation
    const result = await runTransaction(db, async (transaction) => {
      // 1. Validasi stok untuk semua item
      const stokChecks = [];
      
      for (const item of orderData.items) {
        const produkRef = doc(produkCollection, item.productId);
        const produkDoc = await transaction.get(produkRef);
        
        if (!produkDoc.exists()) {
          throw new Error(`Produk ${item.nama} tidak ditemukan`);
        }
        
        const stokSekarang = produkDoc.data().stok;
        
        if (stokSekarang < item.qty) {
          throw new Error(
            `Stok ${item.nama} tidak cukup! Tersedia: ${stokSekarang}, Diminta: ${item.qty}`
          );
        }
        
        stokChecks.push({
          ref: produkRef,
          stokBaru: stokSekarang - item.qty,
        });
      }
      
      // 2. Jika semua stok cukup, update stok
      for (const check of stokChecks) {
        transaction.update(check.ref, {
          stok: check.stokBaru,
          diubahPada: serverTimestamp(),
        });
      }
      
      // 3. Simpan order
      const orderRef = doc(pesananCollection);
      transaction.set(orderRef, {
        ...orderData,
        dibuatPada: serverTimestamp(),
      });
      
      return orderRef.id;
    });
    
    return {
      success: true,
      orderId: result,
    };
  } catch (error: any) {
    console.error('Error simpan pesanan:', error);
    return {
      success: false,
      error: error.message || 'Terjadi kesalahan saat menyimpan pesanan',
    };
  }
}

// ============================================
// SIMPAN PESANAN SAJA (TANPA UPDATE STOK)
// ============================================
// GANTI INI: Fungsi ini untuk draft order (opsional)
export async function simpanPesananDraft(
  orderData: Omit<Order, 'id' | 'dibuatPada'>
): Promise<string> {
  try {
    const docRef = await addDoc(pesananCollection, {
      ...orderData,
      dibuatPada: serverTimestamp(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error simpan pesanan draft:', error);
    throw error;
  }
}
