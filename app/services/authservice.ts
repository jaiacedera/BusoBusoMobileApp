import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import { Alert } from 'react-native';
import { auth } from './firebaseconfig';

export const signUpUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: unknown) {
    const firebaseError = error as { code?: string; message?: string };
    const code = firebaseError.code ?? '';

    if (code === 'auth/email-already-in-use') {
      Alert.alert('Error', 'That email address is already in use!');
    } else if (code === 'auth/invalid-email') {
      Alert.alert('Error', 'That email address is invalid!');
    } else if (code === 'auth/weak-password') {
      Alert.alert('Error', 'Password is too weak. Please use at least 6 characters.');
    } else {
      Alert.alert('Sign Up Error', firebaseError.message ?? 'An unknown error occurred');
    }

    return null;
  }
};

export const signInUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: unknown) {
    const firebaseError = error as { code?: string; message?: string };
    const code = firebaseError.code ?? '';

    if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
      Alert.alert('Error', 'Invalid email or password');
    } else if (code === 'auth/invalid-email') {
      Alert.alert('Error', 'That email address is invalid!');
    } else {
      Alert.alert('Login Error', firebaseError.message ?? 'An unknown error occurred');
    }

    return null;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
  }
};
