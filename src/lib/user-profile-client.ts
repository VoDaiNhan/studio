/**
 * Client-side user profile operations
 */

import { initializeFirebase } from '@/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  phone?: string;
  bio?: string;
  location?: string;
  occupation?: string;
  avatarPath?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get user profile from Firestore (client-side)
 */
export async function getUserProfileClient(userId: string): Promise<UserProfile | null> {
  try {
    const { firestore } = initializeFirebase();
    const userDoc = doc(firestore, 'users', userId);
    const snapshot = await getDoc(userDoc);
    
    if (snapshot.exists()) {
      return snapshot.data() as UserProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

/**
 * Save user profile to Firestore (client-side)
 */
export async function saveUserProfileClient(
  userId: string,
  data: Partial<UserProfile>
): Promise<{ success: boolean; error?: string }> {
  try {
    const { firestore } = initializeFirebase();
    const userDoc = doc(firestore, 'users', userId);
    
    // Check if profile exists
    const snapshot = await getDoc(userDoc);
    
    if (snapshot.exists()) {
      // Update existing profile
      await updateDoc(userDoc, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } else {
      // Create new profile
      await setDoc(userDoc, {
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
 * Update user avatar (client-side)
 */
export async function updateUserAvatarClient(
  userId: string,
  photoURL: string,
  avatarPath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { firestore } = initializeFirebase();
    const userDoc = doc(firestore, 'users', userId);
    
    await updateDoc(userDoc, {
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
