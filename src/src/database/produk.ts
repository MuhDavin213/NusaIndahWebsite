// FUNGSI INTI 1: GET PRODUK DARI FIRESTORE
import { collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

// GANTI INI: Nama koleksi di Firestore
const KOLEKSI_PRODUK = 'produk';

export interface ProdukFirebase {
  id: string;
  nama: string;
  harga: number;
  stok: number;
  kategori: string;
  gambar: string;
  deskripsi?: string;
}

// GET produk dari Firestore
export async function getProduk(): Promise<ProdukFirebase[]> {
  try {
    const q = query(collection(db, KOLEKSI_PRODUK), where('aktif', '==', true));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<ProdukFirebase, 'id'>
    }));
  } catch (error) {
    console.error('Error get produk:', error);
    return [];
  }
}

// REALTIME listener produk (opsional, untuk auto-update)
export function subscribeProduk(callback: (produk: ProdukFirebase[]) => void) {
  const q = query(collection(db, KOLEKSI_PRODUK), where('aktif', '==', true));
  
  return onSnapshot(q, (snapshot) => {
    const produk = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<ProdukFirebase, 'id'>
    }));
    callback(produk);
  });
}
