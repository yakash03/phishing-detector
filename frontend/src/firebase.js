import{initializeApp}from"firebase/app"
import { signInWithPopup, signInWithPhoneNumber, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, RecaptchaVerifier, signInAnonymously } from "firebase/auth"

const firebaseConfig={
  apiKey:"AIzaSyCRb6mY7lQd7pt7mqpezD1zVUpqMHx4t6I",
  authDomain:"phishing-detector-dd6e9.firebaseapp.com",
  projectId:"phishing-detector-dd6e9",
  storageBucket:"phishing-detector-dd6e9.firebasestorage.app",
  messagingSenderId:"867294567957",
  appId:"1:867294567957:web:44e4e45554150facbe781c"
}

const app=initializeApp(firebaseConfig)
export const auth=getAuth(app)
export const googleProvider=new GoogleAuthProvider()
eexport { auth, googleProvider, signInWithPopup, signInWithPhoneNumber, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, RecaptchaVerifier, signInAnonymously }
