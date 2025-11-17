/**
 * Storage utilities for handling file uploads
 */

import { initializeFirebase } from '@/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export interface UploadResult {
  url: string;
  path: string;
}

/**
 * Upload user avatar to Firebase Storage
 */
export async function uploadUserAvatar(
  userId: string,
  file: File
): Promise<UploadResult> {
  const { storage } = initializeFirebase();
  
  // Create unique filename
  const timestamp = Date.now();
  const extension = file.name.split('.').pop();
  const filename = `avatar_${timestamp}.${extension}`;
  const path = `users/${userId}/avatar/${filename}`;
  
  // Create storage reference
  const storageRef = ref(storage, path);
  
  // Upload file
  await uploadBytes(storageRef, file);
  
  // Get download URL
  const url = await getDownloadURL(storageRef);
  
  return { url, path };
}

/**
 * Delete user avatar from Firebase Storage
 */
export async function deleteUserAvatar(path: string): Promise<void> {
  const { storage } = initializeFirebase();
  const storageRef = ref(storage, path);
  
  try {
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting avatar:', error);
  }
}

/**
 * Convert file to base64 (for preview)
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP)',
    };
  }
  
  // Check file size (max 2MB)
  const maxSize = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Kích thước file không được vượt quá 2MB',
    };
  }
  
  return { valid: true };
}
