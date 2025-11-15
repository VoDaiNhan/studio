'use client';

import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import React, { ReactNode, useMemo } from 'react';
import { firebaseConfig } from './config';
import { FirebaseProvider } from './provider';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
function initializeFirebaseClient(): { firebaseApp: FirebaseApp; auth: Auth; firestore: Firestore; } {
  if (getApps().length) {
    const firebaseApp = getApp();
    return getSdks(firebaseApp);
  } else {
    // Important! initializeApp() is called without any arguments because Firebase App Hosting
    // integrates with the initializeApp() function to provide the environment variables needed to
    // populate the FirebaseOptions in production. It is critical that we attempt to call initializeApp()
    // without arguments.
    let firebaseApp;
    try {
      // Attempt to initialize via Firebase App Hosting environment variables
      firebaseApp = initializeApp();
    } catch (e) {
      // Only warn in production because it's normal to use the firebaseConfig to initialize
      // during development
      if (process.env.NODE_ENV === "production") {
        console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
      }
      firebaseApp = initializeApp(firebaseConfig);
    }
    return getSdks(firebaseApp);
  }
}

function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
  };
}

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({
  children,
}: FirebaseClientProviderProps) {
  const firebase = useMemo(initializeFirebaseClient, []);
  
  return <FirebaseProvider {...firebase}>{children}</FirebaseProvider>;
}
