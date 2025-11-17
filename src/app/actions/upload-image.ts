'use server';

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

export async function uploadImage(
  base64Data: string,
  fileName: string,
  type: 'logo' | 'chatbotIcon'
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Remove data URL prefix if present
    const base64String = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64String, 'base64');

    const storage = getStorage();
    const bucket = storage.bucket();
    
    const filePath = `appearance/${type}/${Date.now()}_${fileName}`;
    const file = bucket.file(filePath);

    await file.save(buffer, {
      metadata: {
        contentType: 'image/png',
      },
    });

    // Make file publicly accessible
    await file.makePublic();

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

    // Save URL to Firestore
    const db = getFirestore();
    const configRef = db.collection('config').doc('appearance');
    
    await configRef.set(
      {
        [type === 'logo' ? 'logoUrl' : 'chatbotIconUrl']: publicUrl,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { success: false, error: 'Không thể tải ảnh lên' };
  }
}
