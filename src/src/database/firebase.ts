// FIREBASE CONFIG - LAZY LOADED
// File ini tidak akan crash jika Firebase belum diinstall

let db: any = null;
let isFirebaseConfigured = false;

// Lazy initialization - hanya dijalankan saat dibutuhkan
export async function initializeFirebase() {
  // Jika sudah initialized, return
  if (db !== null || isFirebaseConfigured === true) {
    return { db, isConfigured: isFirebaseConfigured };
  }

  try {
    // Dynamic import - tidak akan crash jika firebase belum diinstall
    const { initializeApp } = await import('firebase/app');
    const { getFirestore } = await import('firebase/firestore');

    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    };

    // Check if configured
    if (firebaseConfig.apiKey && firebaseConfig.projectId) {
      const app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      isFirebaseConfigured = true;
      console.log('✅ Firebase initialized successfully');
    } else {
      console.warn('⚠️ Firebase not configured. Create .env file with Firebase config.');
      db = null;
      isFirebaseConfigured = false;
    }
  } catch (error: any) {
    // Firebase package belum diinstall atau ada error lain
    if (error.message?.includes('Cannot find module') || error.message?.includes('Failed to fetch')) {
      console.warn('⚠️ Firebase package not installed. Run: npm install firebase');
    } else {
      console.error('Firebase initialization error:', error);
    }
    db = null;
    isFirebaseConfigured = false;
  }

  return { db, isConfigured: isFirebaseConfigured };
}

// Export db getter
export function getDb() {
  return db;
}

export { db, isFirebaseConfigured };
