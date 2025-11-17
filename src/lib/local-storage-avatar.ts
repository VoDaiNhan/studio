/**
 * Local storage for user avatars (no Firebase needed)
 */

// IndexedDB for storing large images
const DB_NAME = 'UserAvatarDB';
const STORE_NAME = 'avatars';
const DB_VERSION = 1;

/**
 * Initialize IndexedDB
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

/**
 * Save avatar to IndexedDB
 */
export async function saveAvatarLocal(userId: string, base64Image: string): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    await new Promise((resolve, reject) => {
      const request = store.put(base64Image, userId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    
    db.close();
    
    // Also save to localStorage as backup (smaller version)
    try {
      localStorage.setItem(`avatar_${userId}`, base64Image.substring(0, 1000)); // Preview only
    } catch (e) {
      console.warn('localStorage full, using IndexedDB only');
    }
  } catch (error) {
    console.error('Error saving avatar:', error);
    throw error;
  }
}

/**
 * Get avatar from IndexedDB
 */
export async function getAvatarLocal(userId: string): Promise<string | null> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    const result = await new Promise<string | null>((resolve, reject) => {
      const request = store.get(userId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
    
    db.close();
    return result;
  } catch (error) {
    console.error('Error getting avatar:', error);
    // Fallback to localStorage
    return localStorage.getItem(`avatar_${userId}`);
  }
}

/**
 * Delete avatar from IndexedDB
 */
export async function deleteAvatarLocal(userId: string): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    await new Promise((resolve, reject) => {
      const request = store.delete(userId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    
    db.close();
    localStorage.removeItem(`avatar_${userId}`);
  } catch (error) {
    console.error('Error deleting avatar:', error);
  }
}

/**
 * Save user profile to localStorage
 */
export function saveProfileLocal(userId: string, profile: {
  displayName?: string;
  email?: string;
  phone?: string;
  bio?: string;
  location?: string;
  occupation?: string;
}): void {
  const key = `profile_${userId}`;
  localStorage.setItem(key, JSON.stringify(profile));
}

/**
 * Get user profile from localStorage
 */
export function getProfileLocal(userId: string): any {
  const key = `profile_${userId}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

/**
 * Compress image before saving
 */
export async function compressImage(file: File, maxWidth: number = 500): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Resize if too large
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with compression
        const compressed = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressed);
      };
      
      img.onerror = reject;
    };
    
    reader.onerror = reject;
  });
}
