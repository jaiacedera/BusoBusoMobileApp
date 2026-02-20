import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import * as FirebaseAuth from 'firebase/auth';
import {
  getAuth,
  initializeAuth,
  type Auth,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
//hingin kay llyne say ang config 
const firebaseConfig = {
  apiKey: "AIzaSyAV7FH2jNOxemo_gHqzI1rOSZkvOi9PE9Q",
  authDomain: "busobusomobileapp.firebaseapp.com",
  projectId: "busobusomobileapp",
  storageBucket: "busobusomobileapp.firebasestorage.app",
  messagingSenderId: "333917618521",
  appId: "1:333917618521:web:c8b71ffe547f8dca1c0c48",
  measurementId: "G-0DRQ6TS3XQ"
};

// Initialize Firebase once
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Initialize Firebase Auth with persisted state in React Native
let authInstance: Auth;
const getReactNativePersistence = (
  FirebaseAuth as unknown as {
    getReactNativePersistence?: (storage: typeof AsyncStorage) => unknown;
  }
).getReactNativePersistence;

try {
  if (getReactNativePersistence) {
    authInstance = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage) as any,
    });
  } else {
    authInstance = getAuth(app);
  }
} catch {
  authInstance = getAuth(app);
}

export const auth = authInstance;