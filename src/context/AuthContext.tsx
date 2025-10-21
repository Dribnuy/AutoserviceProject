'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../config/firebase'; // Імпорт з вашого firebase.js

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signInWithGoogle: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  updateUserProfile: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);

      
      if (user) {
        
        const updateUserDocument = async () => {
          try {
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
            
              await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || '',
                photoURL: user.photoURL || '',
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
              });
            } else {
              
              await setDoc(
                userRef,
                {
                  lastLogin: serverTimestamp(),
                },
                { merge: true }
              );
            }
          } catch (error) {
            console.error('Error updating user document:', error);
          
          }
        };

       
        updateUserDocument();
      }
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
    
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: displayName,
        });
      }

    
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: displayName || '',
        photoURL: '',
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });
    } catch (error: any) {
      console.error('Error signing up:', error);
      throw new Error(error.message || 'Failed to create account');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Error signing in:', error);
      throw new Error(error.message || 'Failed to sign in');
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      throw new Error(error.message || 'Failed to sign in with Google');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Error logging out:', error);
      throw new Error(error.message || 'Failed to log out');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error('Error resetting password:', error);
      throw new Error(error.message || 'Failed to reset password');
    }
  };

  const updateUserProfile = async (displayName: string, photoURL?: string) => {
    try {
      if (user) {
        await updateProfile(user, {
          displayName,
          photoURL: photoURL || user.photoURL,
        });

        
        await setDoc(
          doc(db, 'users', user.uid),
          {
            displayName,
            photoURL: photoURL || user.photoURL,
          },
          { merge: true }
        );
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw new Error(error.message || 'Failed to update profile');
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};