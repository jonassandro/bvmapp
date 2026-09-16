import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  User as FirebaseUser,
  ActionCodeSettings,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  or,
  getDocs,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { FirestoreUserAccess, ValidModuleId } from '../types';


// Initialize Firebase App singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore with specific database ID from config
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export interface AppUserProfile {
  uid: string;
  email: string;
  name: string;
  photoURL: string;
  createdAt?: any;
  lastLoginAt?: any;
  active: boolean;
  fullAccess?: boolean;
}

/**
 * Sign in with Google Popup
 */
export async function loginWithGoogle(): Promise<FirebaseUser> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

/**
 * Continue URL para retorno do fluxo de login por link de e-mail.
 * Em produção/deploy: lê a variável pública VITE_APP_PUBLIC_URL se configurada.
 * Em desenvolvimento/preview: utiliza window.location.origin como fallback.
 */
export function getAuthContinueUrl(): string {
  const publicUrl = import.meta.env.VITE_APP_PUBLIC_URL;
  if (publicUrl && typeof publicUrl === 'string' && publicUrl.trim() !== '') {
    return publicUrl.trim().replace(/\/+$/, '');
  }
  return window.location.origin;
}

/**
 * Send passwordless access link to user's email
 */
export async function sendEmailAccessLink(email: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  
  // URL to redirect back to app after clicking the link in email
  const continueUrl = getAuthContinueUrl();

  const actionCodeSettings: ActionCodeSettings = {
    url: continueUrl,
    handleCodeInApp: true,
  };

  await sendSignInLinkToEmail(auth, normalizedEmail, actionCodeSettings);
  window.localStorage.setItem('emailForSignIn', normalizedEmail);
}

/**
 * Check if the current URL contains a Firebase Email Sign-In link
 */
export function checkIsEmailSignInLink(): boolean {
  return isSignInWithEmailLink(auth, window.location.href);
}

/**
 * Complete sign in using the Email Link received in email
 */
export async function completeEmailSignInLink(emailToConfirm?: string): Promise<FirebaseUser> {
  let email = (emailToConfirm || window.localStorage.getItem('emailForSignIn') || '').trim().toLowerCase();

  if (!email) {
    throw new Error('EMAIL_REQUIRED_FOR_SIGNIN');
  }

  const result = await signInWithEmailLink(auth, email, window.location.href);
  window.localStorage.removeItem('emailForSignIn');

  // Clean URL query parameters cleanly from browser address bar
  if (window.history && window.history.replaceState) {
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  return result.user;
}

/**
 * Sign out current user
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Synchronize user document in Firestore 'users' collection
 * Guarantees that the document ID matches Firebase UID,
 * email is stored normalized (lowercase/trimmed),
 * and existing profiles are not duplicated.
 * Every registered user automatically receives fullAccess: true.
 */
export async function syncUserProfile(firebaseUser: FirebaseUser): Promise<AppUserProfile> {
  const userRef = doc(db, 'users', firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  const email = (firebaseUser.email || '').trim().toLowerCase();
  const fallbackName = firebaseUser.displayName || (email ? email.split('@')[0] : 'Usuário');
  const photoURL = firebaseUser.photoURL || '';

  if (!userSnap.exists()) {
    // First time login/signup - create new user document with full access
    const newProfile: AppUserProfile = {
      uid: firebaseUser.uid,
      email,
      name: fallbackName,
      photoURL,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      active: true,
      fullAccess: true,
    };

    await setDoc(userRef, newProfile);
    return newProfile;
  } else {
    // Existing user - update lastLoginAt, ensure active and fullAccess are true
    const existingData = userSnap.data() as AppUserProfile;
    const updates: Partial<AppUserProfile> = {
      lastLoginAt: serverTimestamp(),
      active: true,
      fullAccess: true,
    };

    if (fallbackName && (!existingData.name || existingData.name === 'Usuário')) {
      updates.name = fallbackName;
    }
    if (email && email !== existingData.email) {
      updates.email = email;
    }
    if (photoURL && photoURL !== existingData.photoURL) {
      updates.photoURL = photoURL;
    }

    await updateDoc(userRef, updates);

    return {
      ...existingData,
      ...updates,
      uid: firebaseUser.uid,
      email: email || existingData.email,
      name: existingData.name || fallbackName,
      photoURL: photoURL || existingData.photoURL,
    };
  }
}

/**
 * Fetch all module accesses for a specific user from Firestore.
 * Supports querying both by userId and verified email.
 */
export async function getUserAccesses(
  userId: string,
  userEmail?: string | null
): Promise<FirestoreUserAccess[]> {
  const normalizedEmail = userEmail ? userEmail.trim().toLowerCase() : null;
  const q = normalizedEmail
    ? query(
        collection(db, 'user_access'),
        or(where('userId', '==', userId), where('email', '==', normalizedEmail))
      )
    : query(collection(db, 'user_access'), where('userId', '==', userId));

  const snap = await getDocs(q);
  const accessesMap = new Map<string, FirestoreUserAccess>();
  snap.forEach((docSnap) => {
    const data = { id: docSnap.id, ...(docSnap.data() as FirestoreUserAccess) };
    const modKey = (data.moduleId || '').toUpperCase().trim();
    if (modKey) {
      const existing = accessesMap.get(modKey);
      if (!existing || (!existing.active && data.active)) {
        accessesMap.set(modKey, data);
      }
    }
  });
  return Array.from(accessesMap.values());
}

/**
 * Real-time listener for user module permissions in Firestore 'user_access' collection.
 * Supports querying both by userId and verified email.
 */
export function subscribeUserAccesses(
  userId: string,
  userEmail: string | null | undefined,
  onUpdate: (accesses: FirestoreUserAccess[]) => void,
  onError?: (error: Error) => void
): () => void {
  const normalizedEmail = userEmail ? userEmail.trim().toLowerCase() : null;
  const q = normalizedEmail
    ? query(
        collection(db, 'user_access'),
        or(where('userId', '==', userId), where('email', '==', normalizedEmail))
      )
    : query(collection(db, 'user_access'), where('userId', '==', userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const accessesMap = new Map<string, FirestoreUserAccess>();
      snapshot.forEach((docSnap) => {
        const data = { id: docSnap.id, ...(docSnap.data() as FirestoreUserAccess) };
        const modKey = (data.moduleId || '').toUpperCase().trim();
        if (modKey) {
          const existing = accessesMap.get(modKey);
          if (!existing || (!existing.active && data.active)) {
            accessesMap.set(modKey, data);
          }
        }
      });
      onUpdate(Array.from(accessesMap.values()));
    },
    (err) => {
      console.error('Erro ao escutar permissões em tempo real:', err);
      if (onError) onError(err);
    }
  );
}


