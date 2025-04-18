import { auth, db, storage } from "./firebase";
import {
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  DocumentReference,
  DocumentData
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Auth functions
/**
 * Logs out the user from Firebase
 */
export const logoutUser = () => signOut(auth);

/**
 * Logs in the user with Google account
 * @returns {Promise<UserCredential>} User data after login
 */
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

// Firestore functions
/**
 * Adds a new document to the Firestore collection
 * @param {string} collectionName - Collection name
 * @param {any} data - Data to save
 * @returns {Promise<DocumentReference<DocumentData>>} Reference to the new document
 */
export const addDocument = async (collectionName: string, data: any): Promise<DocumentReference<DocumentData>> => {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: new Date().toISOString()
  });
  return docRef;
};

/**
 * Gets all documents from the Firestore collection
 * @param {string} collectionName - Collection name
 * @returns {Promise<any[]>} Array of documents
 */
export const getDocuments = async (collectionName: string) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

/**
 * Updates a document in the Firestore collection
 * @param {string} collectionName - Collection name
 * @param {string} id - Document ID
 * @param {any} data - New data
 */
export const updateDocument = async (collectionName: string, id: string, data: any) => {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString()
  });
};

/**
 * Deletes a document from the Firestore collection
 * @param {string} collectionName - Collection name
 * @param {string} id - Document ID
 */
export const deleteDocument = async (collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
};

// Storage functions
/**
 * Uploads a file to Firebase Storage
 * @param {File} file - File to upload
 * @param {string} path - Path in Storage
 * @returns {Promise<string>} URL of the uploaded file
 **/
export const uploadFile = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};
