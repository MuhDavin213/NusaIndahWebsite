import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where
} from 'firebase/firestore';
import { getDb } from './firebase';

const KATEGORI_COLLECTION = 'kategori';

type KategoriDoc = {
  nama?: string;
  urutan?: number;
};

type KategoriItem = {
  id: string;
  nama: string;
  urutan?: number;
};

function slugify(input: string): string {
  const slug = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return slug || `kategori-${Date.now()}`;
}

function normalizeKategori(id: string, data: KategoriDoc): KategoriItem {
  return {
    id,
    nama: (data.nama || '').trim() || id,
    urutan: typeof data.urutan === 'number' ? data.urutan : undefined
  };
}

function sortKategori(items: KategoriItem[]): string[] {
  return items
    .sort((a, b) => {
      const aHasOrder = typeof a.urutan === 'number';
      const bHasOrder = typeof b.urutan === 'number';

      if (aHasOrder && bHasOrder) {
        return (a.urutan as number) - (b.urutan as number);
      }
      if (aHasOrder !== bHasOrder) {
        return aHasOrder ? -1 : 1;
      }
      return a.nama.localeCompare(b.nama);
    })
    .map((item) => item.nama);
}

export async function getKategori(): Promise<string[]> {
  const db = getDb();
  const snapshot = await getDocs(collection(db, KATEGORI_COLLECTION));
  const items = snapshot.docs.map((docSnap) =>
    normalizeKategori(docSnap.id, docSnap.data() as KategoriDoc)
  );
  return sortKategori(items);
}

export function subscribeKategori(
  callback: (kategori: string[]) => void
): (() => void) | null {
  try {
    const db = getDb();
    const colRef = collection(db, KATEGORI_COLLECTION);

    return onSnapshot(
      colRef,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) =>
          normalizeKategori(docSnap.id, docSnap.data() as KategoriDoc)
        );
        callback(sortKategori(items));
      },
      (error) => {
        console.info('ℹ️ Firebase kategori feature disabled:', error.message);
      }
    );
  } catch (error: any) {
    if (error.message?.includes('Firebase not configured')) {
      console.info('ℹ️ Firebase kategori feature disabled: Firebase not configured yet');
    } else {
      console.info('ℹ️ Firebase kategori feature disabled:', error.message);
    }
    return null;
  }
}

export async function saveKategori(nama: string, urutan?: number): Promise<void> {
  const db = getDb();
  const colRef = collection(db, KATEGORI_COLLECTION);
  const trimmed = nama.trim();
  if (!trimmed) return;

  const existingQuery = query(colRef, where('nama', '==', trimmed));
  const existingSnap = await getDocs(existingQuery);

  if (!existingSnap.empty) {
    const existingRef = doc(db, KATEGORI_COLLECTION, existingSnap.docs[0].id);
    await setDoc(
      existingRef,
      {
        nama: trimmed,
        ...(typeof urutan === 'number' ? { urutan } : {})
      },
      { merge: true }
    );
    return;
  }

  const docId = slugify(trimmed);
  const kategoriRef = doc(db, KATEGORI_COLLECTION, docId);
  await setDoc(
    kategoriRef,
    {
      nama: trimmed,
      ...(typeof urutan === 'number' ? { urutan } : {})
    },
    { merge: true }
  );
}

export async function deleteKategori(nama: string): Promise<void> {
  const db = getDb();
  const colRef = collection(db, KATEGORI_COLLECTION);
  const trimmed = nama.trim();
  if (!trimmed) return;

  const existingQuery = query(colRef, where('nama', '==', trimmed));
  const existingSnap = await getDocs(existingQuery);
  if (existingSnap.empty) return;

  await Promise.all(
    existingSnap.docs.map((docSnap) =>
      deleteDoc(doc(db, KATEGORI_COLLECTION, docSnap.id))
    )
  );
}
