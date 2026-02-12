// FUNGSI INTI 3: SIMPAN PESANAN + KURANGI STOK (ATOMIC)
import { initializeFirebase } from './firebase';

// GANTI INI: Nama koleksi di Firestore
const KOLEKSI_PESANAN = 'pesanan';
const KOLEKSI_PRODUK = 'produk';

export interface ItemPesanan {
  productId: string;
  nama: string;
  harga: number;
  qty: number;
  subtotal: number;
}

export interface DataPesanan {
  items: ItemPesanan[];
  subtotal: number;
  diskon: number;
  total: number;
  promoTeks?: string;
  promoPersen?: number;
}

// FUNGSI UTAMA: Simpan pesanan + kurangi stok (ATOMIC)
export async function simpanPesananDanKurangiStok(
  data: DataPesanan
): Promise<{ success: boolean; error?: string; orderId?: string }> {
  try {
    // Lazy init Firebase
    const { db, isConfigured } = await initializeFirebase();
    
    // Return error jika Firebase belum dikonfigurasi
    if (!db || !isConfigured) {
      return {
        success: false,
        error: 'Firebase belum dikonfigurasi. Silakan setup Firebase terlebih dahulu.',
      };
    }

    // Dynamic import firestore functions
    const { collection, doc, runTransaction, serverTimestamp } = await import('firebase/firestore');
    
    const result = await runTransaction(db, async (transaction) => {
      // 1. VALIDASI STOK untuk semua item
      const validasiStok = [];
      
      for (const item of data.items) {
        const produkRef = doc(db, KOLEKSI_PRODUK, item.productId);
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
        
        validasiStok.push({
          ref: produkRef,
          stokBaru: stokSekarang - item.qty,
        });
      }
      
      // 2. KURANGI STOK semua item (atomic)
      for (const v of validasiStok) {
        transaction.update(v.ref, { stok: v.stokBaru });
      }
      
      // 3. SIMPAN PESANAN
      const pesananRef = doc(collection(db, KOLEKSI_PESANAN));
      transaction.set(pesananRef, {
        ...data,
        timestamp: serverTimestamp(),
        status: 'selesai',
      });
      
      return pesananRef.id;
    });
    
    return { success: true, orderId: result };
  } catch (error: any) {
    console.error('Error simpan pesanan:', error);
    return { 
      success: false, 
      error: error.message || 'Gagal menyimpan pesanan' 
    };
  }
}
