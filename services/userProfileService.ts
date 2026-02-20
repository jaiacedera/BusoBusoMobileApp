import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from './firebaseconfig';

export interface UserProfileInput {
  firstName: string;
  lastName: string;
  middleInitial: string;
  address: string;
  contactNumber: string;
  emergencyContact: string;
}

export async function saveUserProfile(profile: UserProfileInput): Promise<void> {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error('No authenticated user found. Please log in again.');
  }

  await setDoc(
    doc(db, 'users', currentUser.uid),
    {
      uid: currentUser.uid,
      email: currentUser.email ?? null,
      ...profile,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
}
