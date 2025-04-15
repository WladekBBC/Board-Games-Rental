import { initializeApp, getApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBEJG9xlU7y2idSv_KR8fIbSn1fbnGnHzE",
  authDomain: "boardgamerentalsample.firebaseapp.com",
  projectId: "boardgamerentalsample",
  storageBucket: "boardgamerentalsample.appspot.com",
  messagingSenderId: "810966980445",
  appId: "1:810966980445:web:d10ea58f0a344d17117ab4"
}

// Initialize Firebase
let app;
try {
  app = getApp();
} catch {
  app = initializeApp(firebaseConfig);
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Configure Google Auth Provider settings
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { auth, db, storage, googleProvider }
