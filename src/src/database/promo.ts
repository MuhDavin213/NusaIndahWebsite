// FUNGSI INTI 2: GET PROMO AKTIF DARI FIRESTORE
import { initializeFirebase } from './firebase';

// GANTI INI: Path dokumen promo di Firestore
const DOC_PROMO = 'konfigurasi/promo';

export interface PromoFirebase {
  aktif: boolean;
  teks: string;
  persen: number; // diskon persen (contoh: 30 untuk 30%)
}

// GET promo aktif
export async function getPromoAktif(): Promise<PromoFirebase | null> {
  try {
    // Lazy init Firebase
    const { db, isConfigured } = await initializeFirebase();
    
    // Return null jika Firebase belum dikonfigurasi
    if (!db || !isConfigured) {
      return null;
    }

    // Dynamic import firestore functions
    const { doc, getDoc } = await import('firebase/firestore');
    
    const docRef = doc(db, DOC_PROMO);
    const snapshot = await getDoc(docRef);
    
    if (!snapshot.exists()) {
      return null;
    }
    
    const data = snapshot.data() as PromoFirebase;
    
    // Return hanya jika promo aktif
    if (data.aktif && data.teks) {
      return data;
    }
    
    return null;
  } catch (error) {
    console.error('Error get promo:', error);
    return null;
  }
}

// REALTIME listener promo (untuk banner auto-update)
export async function subscribePromo(callback: (promo: PromoFirebase | null) => void) {
  try {
    // Lazy init Firebase
    const { db, isConfigured } = await initializeFirebase();
    
    // Return dummy unsubscribe jika Firebase belum dikonfigurasi
    if (!db || !isConfigured) {
      callback(null);
      return () => {}; // dummy unsubscribe
    }

    // Dynamic import firestore functions
    const { doc, onSnapshot } = await import('firebase/firestore');
    
    const docRef = doc(db, DOC_PROMO);
    
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as PromoFirebase;
        if (data.aktif && data.teks) {
          callback(data);
        } else {
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  } catch (error) {
    console.error('Error subscribe promo:', error);
    callback(null);
    return () => {}; // dummy unsubscribe
  }
}
