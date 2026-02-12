import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import type { PromoBannerData } from '../types';
import { getDb } from './firebase';

type PromoBannerDoc = Omit<PromoBannerData, 'id' | 'createdAt'> & {
  createdAt?: any;
};

const PROMO_BANNER_COLLECTION = 'promo_banner';

function normalizePromo(id: string, data: PromoBannerDoc): PromoBannerData {
  return {
    id,
    text: data.text || '',
    backgroundColor: data.backgroundColor || '#10b981',
    textColor: data.textColor || '#ffffff',
    isActive: Boolean(data.isActive),
    createdAt: data.createdAt?.toDate?.() || undefined
  };
}

export function subscribePromoBanners(
  callback: (promos: PromoBannerData[]) => void
): (() => void) | null {
  try {
    const db = getDb();
    const colRef = collection(db, PROMO_BANNER_COLLECTION);
    const q = query(colRef);

    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) =>
          normalizePromo(docSnap.id, docSnap.data() as PromoBannerDoc)
        );
        callback(items);
      },
      (error) => {
        console.info('ℹ️ Firebase promo banner feature disabled:', error.message);
      }
    );
  } catch (error: any) {
    if (error.message?.includes('Firebase not configured')) {
      console.info('ℹ️ Firebase promo banner feature disabled: Firebase not configured yet');
    } else {
      console.info('ℹ️ Firebase promo banner feature disabled:', error.message);
    }
    return null;
  }
}

export async function savePromoBanner(
  data: Omit<PromoBannerData, 'id' | 'createdAt'>,
  id?: string
): Promise<void> {
  const db = getDb();
  const payload: PromoBannerDoc = {
    text: data.text,
    backgroundColor: data.backgroundColor,
    textColor: data.textColor,
    isActive: data.isActive,
    createdAt: serverTimestamp()
  };

  if (id) {
    await setDoc(doc(db, PROMO_BANNER_COLLECTION, id), payload, { merge: true });
    return;
  }

  await addDoc(collection(db, PROMO_BANNER_COLLECTION), payload);
}

export async function deletePromoBanner(id: string): Promise<void> {
  const db = getDb();
  await deleteDoc(doc(db, PROMO_BANNER_COLLECTION, id));
}
