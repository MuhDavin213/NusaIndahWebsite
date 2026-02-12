// ============================================
// PRODUK SERVICE - CRUD FIRESTORE
// ============================================
// Service untuk operasi CRUD produk di Firestore
// GANTI INI: Jika struktur field produk berbeda, sesuaikan di type Produk

import {
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { produkCollection } from './koleksi';
import type { Produk } from './koleksi';

// ============================================
// READ - Ambil semua produk aktif
// ============================================
export async function ambilSemuaProduk(): Promise<Produk[]> {
  try {
    const q = query(
      produkCollection,
      where('aktif', '==', true),
      orderBy('nama', 'asc')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Produk[];
  } catch (error) {
    console.error('Error ambil produk:', error);
    throw error;
  }
}

// ============================================
// READ - Ambil produk by ID
// ============================================
export async function ambilProdukById(id: string): Promise<Produk | null> {
  try {
    const docRef = doc(produkCollection, id);
    const snapshot = await getDoc(docRef);
    
    if (!snapshot.exists()) return null;
    
    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Produk;
  } catch (error) {
    console.error('Error ambil produk by ID:', error);
    throw error;
  }
}

// ============================================
// REALTIME - Subscribe produk (onSnapshot)
// ============================================
// GANTI INI: Untuk realtime update produk di UI
export function subscribeProduk(callback: (produk: Produk[]) => void) {
  const q = query(
    produkCollection,
    where('aktif', '==', true),
    orderBy('nama', 'asc')
  );
  
  return onSnapshot(
    q,
    (snapshot) => {
      const produk = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Produk[];
      callback(produk);
    },
    (error) => {
      console.error('Error subscribe produk:', error);
    }
  );
}

// ============================================
// CREATE - Tambah produk baru
// ============================================
export async function tambahProduk(data: Omit<Produk, 'id' | 'dibuatPada' | 'diubahPada'>) {
  try {
    const docRef = await addDoc(produkCollection, {
      ...data,
      aktif: true,
      dibuatPada: serverTimestamp(),
      diubahPada: serverTimestamp(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error tambah produk:', error);
    throw error;
  }
}

// ============================================
// UPDATE - Update produk
// ============================================
export async function updateProduk(id: string, data: Partial<Produk>) {
  try {
    const docRef = doc(produkCollection, id);
    await updateDoc(docRef, {
      ...data,
      diubahPada: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error update produk:', error);
    throw error;
  }
}

// ============================================
// DELETE - Hapus produk (soft delete)
// ============================================
export async function hapusProduk(id: string) {
  try {
    const docRef = doc(produkCollection, id);
    await updateDoc(docRef, {
      aktif: false,
      diubahPada: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error hapus produk:', error);
    throw error;
  }
}

// ============================================
// DELETE - Hapus produk permanen (hard delete)
// ============================================
export async function hapusProdukPermanen(id: string) {
  try {
    const docRef = doc(produkCollection, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error hapus produk permanen:', error);
    throw error;
  }
}
