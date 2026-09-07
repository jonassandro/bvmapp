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
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { FirestoreUserAccess } from '../types';
import firebaseConfigData from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId,
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = firebaseConfigData.firestoreDatabaseId
  ? getFirestore(app, firebaseConfigData.firestoreDatabaseId)
  : getFirestore(app);

export interface AppUserProfile {
  uid: string;
  email: string;
  name: string;
  photoURL?: string;
  active?: boolean;
  createdAt?: any;
  lastLoginAt?: any;
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const res = await signInWithPopup(auth, provider);
  return res.user;
}

export async function logoutUser() {
  return signOut(auth);
}

export async function sendEmailAccessLink(email: string) {
  const actionCodeSettings = {
    url: window.location.origin,
    handleCodeInApp: true,
  };
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  window.localStorage.setItem('emailForSignIn', email);
}

export function checkIsEmailSignInLink() {
  return isSignInWithEmailLink(auth, window.location.href);
}

export async function completeEmailSignInLink(email: string) {
  const result = await signInWithEmailLink(auth, email, window.location.href);
  window.localStorage.removeItem('emailForSignIn');
  return result.user;
}

export async function syncUserProfile(user: FirebaseUser): Promise<AppUserProfile> {
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);

  const profileData: AppUserProfile = {
    uid: user.uid,
    email: (user.email || '').trim().toLowerCase(),
    name: user.displayName || user.email?.split('@')[0] || 'Usuário',
    photoURL: user.photoURL || '',
    active: true,
    lastLoginAt: serverTimestamp(),
  };

  if (!snap.exists()) {
    profileData.createdAt = serverTimestamp();
    await setDoc(userRef, profileData, { merge: true });
  } else {
    await setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true });
    const existing = snap.data();
    if (existing) {
      if (existing.name) profileData.name = existing.name;
      if (existing.active !== undefined) profileData.active = existing.active;
      if (existing.createdAt) profileData.createdAt = existing.createdAt;
    }
  }

  return profileData;
}

export function subscribeUserAccesses(
  uid: string,
  email: string,
  onData: (accesses: FirestoreUserAccess[]) => void,
  onError?: (error: any) => void
) {
  const accessRef = collection(db, 'user_access');
  const qUid = query(accessRef, where('userId', '==', uid));

  const unsubscribe = onSnapshot(
    qUid,
    (snapshot) => {
      const accesses: FirestoreUserAccess[] = [];
      snapshot.forEach((d) => {
        accesses.push({ id: d.id, ...(d.data() as any) });
      });

      if (email) {
        const qEmail = query(accessRef, where('email', '==', email.toLowerCase().trim()));
        getDocs(qEmail)
          .then((emailSnap) => {
            emailSnap.forEach((d) => {
              if (!accesses.some((a) => a.id === d.id)) {
                accesses.push({ id: d.id, ...(d.data() as any) });
              }
            });
            onData(accesses);
          })
          .catch(() => {
            onData(accesses);
          });
      } else {
        onData(accesses);
      }
    },
    (err) => {
      if (onError) onError(err);
    }
  );

  return unsubscribe;
}

export async function getUserAccesses(uid: string, email: string): Promise<FirestoreUserAccess[]> {
  const accessRef = collection(db, 'user_access');
  const accesses: FirestoreUserAccess[] = [];

  try {
    const qUid = query(accessRef, where('userId', '==', uid));
    const snapUid = await getDocs(qUid);
    snapUid.forEach((d) => {
      accesses.push({ id: d.id, ...(d.data() as any) });
    });

    if (email) {
      const qEmail = query(accessRef, where('email', '==', email.toLowerCase().trim()));
      const snapEmail = await getDocs(qEmail);
      snapEmail.forEach((d) => {
        if (!accesses.some((a) => a.id === d.id)) {
          accesses.push({ id: d.id, ...(d.data() as any) });
        }
      });
    }
  } catch (err) {
    console.error('Erro ao buscar acessos no Firestore:', err);
  }

  return accesses;
}
