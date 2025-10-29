'use client';

import React, {
  DependencyList,
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged, IdTokenResult } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

// Custom claim structure
interface AppClaims {
  role?: 'admin' | 'user';
}

// Internal state for user authentication, now including claims
interface UserAuthState {
  user: User | null;
  claims: AppClaims | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Combined state for the Firebase context
export interface FirebaseContextState {
  areServicesAvailable: boolean;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  // User authentication state
  user: User | null;
  claims: AppClaims | null; // User's custom claims
  isUserLoading: boolean;
  userError: Error | null;
}

// Return type for useFirebase()
export interface FirebaseServicesAndUser {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  user: User | null;
  claims: AppClaims | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Return type for useUser() - now includes role
export interface UserHookResult {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
  role: 'admin' | 'user' | null; // Expose the role directly
}

// React Context
export const FirebaseContext = createContext<FirebaseContextState | undefined>(
  undefined
);

const AuthManager = ({
  auth,
  setUserAuthState,
}: {
  auth: Auth | null;
  setUserAuthState: React.Dispatch<React.SetStateAction<UserAuthState>>;
}) => {
  useEffect(() => {
    if (!auth) {
      setUserAuthState({
        user: null,
        claims: null,
        isUserLoading: false,
        userError: new Error('Auth service not provided.'),
      });
      return;
    }
    
    setUserAuthState(prevState => ({ ...prevState, isUserLoading: true }));

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const idTokenResult: IdTokenResult = await firebaseUser.getIdTokenResult(true); // Force refresh
            let userClaims = (idTokenResult.claims as AppClaims) || {};
            
            // Hardcoded admin role for specific email
            if (firebaseUser.email === 'nhan1545a@gmail.com') {
                userClaims.role = 'admin';
            } else if (!userClaims.role) {
                userClaims.role = 'user';
            }

            setUserAuthState({
              user: firebaseUser,
              claims: userClaims,
              isUserLoading: false,
              userError: null,
            });
          } catch (error) {
             console.error('FirebaseProvider: Error getting user claims:', error);
             setUserAuthState({
                user: firebaseUser, // Still set the user
                claims: null,
                isUserLoading: false,
                userError: error instanceof Error ? error : new Error('Failed to get user claims'),
             });
          }
        } else {
          // No user
          setUserAuthState({
            user: null,
            claims: null,
            isUserLoading: false,
            userError: null,
          });
        }
      },
      (error) => {
        console.error('FirebaseProvider: onAuthStateChanged error:', error);
        setUserAuthState({ user: null, claims: null, isUserLoading: false, userError: error });
      }
    );
    return () => unsubscribe();
  }, [auth, setUserAuthState]);

  return null;
};

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
}


/**
 * FirebaseProvider manages and provides Firebase services and user authentication state.
 */
export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: null,
    claims: null,
    isUserLoading: true, // Start loading until first auth event
    userError: null,
  });
  
  // Memoize the context value
  const contextValue = useMemo((): FirebaseContextState => {
    const servicesAvailable = !!(firebaseApp && firestore && auth);
    return {
      areServicesAvailable: servicesAvailable,
      firebaseApp: servicesAvailable ? firebaseApp : null,
      firestore: servicesAvailable ? firestore : null,
      auth: servicesAvailable ? auth : null,
      user: userAuthState.user,
      claims: userAuthState.claims,
      isUserLoading: userAuthState.isUserLoading,
      userError: userAuthState.userError,
    };
  }, [firebaseApp, firestore, auth, userAuthState]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      <AuthManager auth={auth} setUserAuthState={setUserAuthState} />
      {children}
    </FirebaseContext.Provider>
  );
};

/**
 * Hook to access core Firebase services and user authentication state.
 * Throws error if core services are not available or used outside provider.
 */
export const useFirebase = (): FirebaseServicesAndUser => {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }

  if (
    !context.areServicesAvailable ||
    !context.firebaseApp ||
    !context.firestore ||
    !context.auth
  ) {
    throw new Error(
      'Firebase core services not available. Check FirebaseProvider props.'
    );
  }

  return {
    firebaseApp: context.firebaseApp,
    firestore: context.firestore,
    auth: context.auth,
    user: context.user,
    claims: context.claims,
    isUserLoading: context.isUserLoading,
    userError: context.userError,
  };
};

/** Hook to access Firebase Auth instance. */
export const useAuth = (): Auth => {
  const { auth } = useFirebase();
  return auth;
};

/** Hook to access Firestore instance. */
export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  return firestore;
};

/** Hook to access Firebase App instance. */
export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  return firebaseApp;
};

type MemoFirebase<T> = T & { __memo?: boolean };

export function useMemoFirebase<T>(
  factory: () => T,
  deps: DependencyList
): T | MemoFirebase<T> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoized = useMemo(factory, deps);

  if (typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;

  return memoized;
}

/**
 * Hook specifically for accessing the authenticated user's state, including their role.
 * This provides the User object, loading status, any auth errors, and role from custom claims.
 * @returns {UserHookResult} Object with user, isUserLoading, userError, and role.
 */
export const useUser = (): UserHookResult => {
  const { user, claims, isUserLoading, userError } = useFirebase();
  
  // Logic to determine role
  let role: 'admin' | 'user' | null = null;
  if (user) {
    if (user.email === 'nhan1545a@gmail.com') {
      role = 'admin';
    } else {
      role = claims?.role || 'user'; // Default new users to 'user' role
    }
  }

  return { user, isUserLoading, userError, role };
};
