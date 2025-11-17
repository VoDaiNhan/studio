/**
 * Firebase Admin SDK for server-side operations
 */

import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

let adminApp: App | undefined;

export function getFirebaseAdmin() {
  if (adminApp) {
    return adminApp;
  }

  // Check if already initialized
  const apps = getApps();
  if (apps.length > 0) {
    adminApp = apps[0];
    return adminApp;
  }

  // Initialize with service account (for production)
  // For development, we'll use the default credentials
  try {
    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    // Fallback to default initialization
    adminApp = initializeApp();
  }

  return adminApp;
}

export function getAdminFirestore() {
  const app = getFirebaseAdmin();
  return getFirestore(app);
}

export function getAdminStorage() {
  const app = getFirebaseAdmin();
  return getStorage(app);
}
