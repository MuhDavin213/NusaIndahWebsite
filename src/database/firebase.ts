// FILE: database/firebase.ts
// INISIALISASI FIREBASE

import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

// Firebase config dari .env (Vite)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let initError: Error | null = null;

// Check if Firebase config is valid (not placeholder)
function isValidConfig(): boolean {
  return Boolean(firebaseConfig.apiKey) && Boolean(firebaseConfig.projectId);
}

// Initialize Firebase (lazy init with error handling)
export function initFirebase(): { app: FirebaseApp; db: Firestore } {
  // If already initialized, return cached instances
  if (app && db) {
    return { app, db };
  }

  // If previously failed, throw the cached error
  if (initError) {
    throw initError;
  }

  // Check if config is valid
  if (!isValidConfig()) {
    initError = new Error('Firebase not configured. Please update .env with VITE_FIREBASE_* values.');
    throw initError;
  }

  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    return { app, db };
  } catch (error: any) {
    initError = error;
    throw error;
  }
}

// Helper untuk cek apakah Firebase sudah diinisialisasi
export function isFirebaseReady(): boolean {
  try {
    initFirebase();
    return true;
  } catch (error) {
    return false;
  }
}

// Export fungsi untuk ambil db instance
export function getDb(): Firestore {
  const { db } = initFirebase();
  return db;
}
