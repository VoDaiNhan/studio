'use server';

import { getAdminFirestore } from '@/lib/firebase-admin';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  phone?: string;
  bio?: string;
  location?: string;
  occupation?: string;
  avatarPath?: string; // Storage path for cleanup
  createdAt: string;
  updatedAt: string;
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const firestore = getAdminFirestore();
    const userDoc = firestore.collection('users').doc(userId);
    const snapshot = await userDoc.get();
    
    if (snapshot.exists) {
      return snapshot.data() as UserProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

/**
 * Create or update user profile in Firestore
 */
export async function saveUserProfile(
  userId: string,
  data: Partial<UserProfile>
): Promise<{ success: boolean; error?: string }> {
  try {
    const firestore = getAdminFirestore();
    const userDoc = firestore.collection('users').doc(userId);
    
    // Check if profile exists
    const snapshot = await userDoc.get();
    
    if (snapshot.exists) {
      // Update existing profile
      await userDoc.update({
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } else {
      // Create new profile
      await userDoc.set({
        uid: userId,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error saving user profile:', error);
    return {
      success: false,
      error: error.message || 'Không thể lưu thông tin',
    };
  }
}

/**
 * Update user avatar URL
 */
export async function updateUserAvatar(
  userId: string,
  photoURL: string,
  avatarPath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const firestore = getAdminFirestore();
    const userDoc = firestore.collection('users').doc(userId);
    
    await userDoc.update({
      photoURL,
      avatarPath,
      updatedAt: new Date().toISOString(),
    });
    
    return { success: true };
  } catch (error: any) {
    console.error('Error updating avatar:', error);
    return {
      success: false,
      error: error.message || 'Không thể cập nhật avatar',
    };
  }
}
