// FILE: database/produk.ts
// FUNGSI HELPER UNTUK UPDATE STOK PRODUK DI FIREBASE

import { collection, getDocs, onSnapshot, doc, setDoc, deleteDoc, updateDoc, increment, query, orderBy } from 'firebase/firestore';
import { getDb } from './firebase';
import type { Barang } from '../types';

// Nama koleksi produk di Firestore
const PRODUK_COLLECTION = 'produk';

function normalizeProduk(id: string, data: Partial<Barang>): Barang {
  return {
    id_barang: typeof data.id_barang === 'number' ? data.id_barang : Number(id),
    id_user: typeof data.id_user === 'number' ? data.id_user : 1,
    nama_barang: data.nama_barang || 'Produk',
    deskripsi: data.deskripsi || '',
    harga: typeof data.harga === 'number' ? data.harga : Number(data.harga || 0),
    stok: typeof data.stok === 'number' ? data.stok : Number(data.stok || 0),
    gambar: data.gambar || 'noodles',
    kategori: data.kategori || 'Lainnya'
  };
}

export async function getProduk(): Promise<Barang[]> {
  const db = getDb();
  const produkQuery = query(collection(db, PRODUK_COLLECTION), orderBy('id_barang', 'asc'));
  const snapshot = await getDocs(produkQuery);
  const items = snapshot.docs.map((docSnap) => normalizeProduk(docSnap.id, docSnap.data() as Partial<Barang>));
  return items;
}

export function subscribeProduk(callback: (produk: Barang[]) => void): (() => void) | null {
  try {
    const db = getDb();
    const produkQuery = query(collection(db, PRODUK_COLLECTION), orderBy('id_barang', 'asc'));

    return onSnapshot(
      produkQuery,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => normalizeProduk(docSnap.id, docSnap.data() as Partial<Barang>));
        callback(items);
      },
      (error) => {
        console.info('ℹ️ Firebase produk feature disabled:', error.message);
      }
    );
  } catch (error: any) {
    if (error.message?.includes('Firebase not configured')) {
      console.info('ℹ️ Firebase produk feature disabled: Firebase not configured yet');
    } else {
      console.info('ℹ️ Firebase produk feature disabled:', error.message);
    }
    return null;
  }
}

export async function saveProduk(product: Barang): Promise<void> {
  const db = getDb();
  const produkRef = doc(db, PRODUK_COLLECTION, product.id_barang.toString());
  await setDoc(produkRef, product, { merge: true });
}

export async function deleteProduk(productId: number): Promise<void> {
  const db = getDb();
  const produkRef = doc(db, PRODUK_COLLECTION, productId.toString());
  await deleteDoc(produkRef);
}

/**
 * FUNGSI: kurangiStokProduk
 * Kurangi stok produk di Firestore
 * PENTING: Fungsi ini harus dipanggil dalam Firestore transaction untuk atomic update
 * 
 * @param productId - ID produk
 * @param qty - jumlah yang akan dikurangi
 */
export async function kurangiStokProduk(productId: number, qty: number): Promise<void> {
  try {
    const db = getDb();
    const produkRef = doc(db, PRODUK_COLLECTION, productId.toString());
    
    // Gunakan increment dengan nilai negatif untuk kurangi stok
    await updateDoc(produkRef, {
      stok: increment(-qty)
    });
  } catch (error: any) {
    console.error('Error kurangi stok:', error.message);
    throw new Error(`Gagal mengurangi stok produk ID ${productId}`);
  }
}
