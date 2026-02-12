import { runTransaction, doc } from 'firebase/firestore';
import { db } from './firebase';
import { KOLEKSI } from './koleksi';
import type { ItemKeranjang } from '../fitur/keranjang/tipe';

export interface HasilTransaksiStok {
  sukses: boolean;
  pesan: string;
  itemGagal?: {
    nama: string;
    diminta: number;
    tersedia: number;
  }[];
}

/**
 * TRANSAKSI FIRESTORE UNTUK KURANGI STOK
 * 
 * Fungsi ini menggunakan Firestore Transaction untuk memastikan:
 * 1. Read stok terbaru (atomic)
 * 2. Validasi stok mencukupi
 * 3. Update stok jika semua valid
 * 4. Rollback otomatis jika ada yang gagal
 * 
 * PENTING: Fungsi ini dipanggil HANYA saat tombol "Print Kuitansi" diklik,
 * BUKAN saat checkout pertama kali.
 */
export async function kurangiStokProduk(items: ItemKeranjang[]): Promise<HasilTransaksiStok> {
  try {
    const hasil = await runTransaction(db, async (transaction) => {
      const itemGagal: HasilTransaksiStok['itemGagal'] = [];

      // FASE 1: Read semua produk (atomic read)
      const produkRefs = items.map((item) => doc(db, KOLEKSI.PRODUK, item.productId));
      const produkDocs = await Promise.all(produkRefs.map((ref) => transaction.get(ref)));

      // FASE 2: Validasi stok
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const produkDoc = produkDocs[i];

        if (!produkDoc.exists()) {
          itemGagal.push({
            nama: item.nama,
            diminta: item.qty,
            tersedia: 0,
          });
          continue;
        }

        const stokSekarang = produkDoc.data().stok as number;

        if (stokSekarang < item.qty) {
          itemGagal.push({
            nama: item.nama,
            diminta: item.qty,
            tersedia: stokSekarang,
          });
        }
      }

      // Jika ada yang gagal, abort transaksi
      if (itemGagal.length > 0) {
        return {
          sukses: false,
          pesan: 'Stok tidak mencukupi',
          itemGagal,
        };
      }

      // FASE 3: Update stok (atomic write)
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const produkRef = produkRefs[i];
        const produkDoc = produkDocs[i];
        const stokSekarang = produkDoc.data().stok as number;
        const stokBaru = stokSekarang - item.qty;

        transaction.update(produkRef, {
          stok: stokBaru,
          updatedAt: new Date(),
        });
      }

      return {
        sukses: true,
        pesan: 'Stok berhasil dikurangi',
      };
    });

    return hasil;
  } catch (error: any) {
    console.error('❌ Error transaksi stok:', error);
    return {
      sukses: false,
      pesan: error.message || 'Terjadi kesalahan saat update stok',
    };
  }
}

/**
 * TRANSAKSI UNTUK BATALKAN ORDER (KEMBALIKAN STOK)
 * 
 * Fungsi ini digunakan jika user membatalkan order draft
 * yang sudah mengurangi stok (edge case)
 */
export async function kembalikanStokProduk(items: ItemKeranjang[]): Promise<HasilTransaksiStok> {
  try {
    await runTransaction(db, async (transaction) => {
      const produkRefs = items.map((item) => doc(db, KOLEKSI.PRODUK, item.productId));
      const produkDocs = await Promise.all(produkRefs.map((ref) => transaction.get(ref)));

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const produkRef = produkRefs[i];
        const produkDoc = produkDocs[i];

        if (!produkDoc.exists()) continue;

        const stokSekarang = produkDoc.data().stok as number;
        const stokBaru = stokSekarang + item.qty;

        transaction.update(produkRef, {
          stok: stokBaru,
          updatedAt: new Date(),
        });
      }
    });

    return {
      sukses: true,
      pesan: 'Stok berhasil dikembalikan',
    };
  } catch (error: any) {
    console.error('❌ Error kembalikan stok:', error);
    return {
      sukses: false,
      pesan: error.message || 'Terjadi kesalahan',
    };
  }
}
