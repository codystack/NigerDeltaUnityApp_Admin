// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import {
  addDoc,
  collection,
  getFirestore,
  getDocs,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  onSnapshot,
  updateDoc,
  deleteDoc,
  arrayUnion,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyDfJON4SG_vyKRZIMeDdhs6yHywfDev0as",
//   authDomain: "ndua-b15fc.firebaseapp.com",
//   projectId: "ndua-b15fc",
//   storageBucket: "ndua-b15fc.appspot.com",
//   messagingSenderId: "327501807065",
//   appId: "1:327501807065:web:9f588cfb326bf323b2adc8",
//   measurementId: "G-H7JNHH73EG",
// };

const firebaseConfig = {
  apiKey: "AIzaSyB9GzDQHns2tzC3zzjMdhuVuQzurGd8VpY",
  authDomain: "ndua-f0c12.firebaseapp.com",
  projectId: "ndua-f0c12",
  storageBucket: "ndua-f0c12.appspot.com",
  messagingSenderId: "479086665205",
  appId: "1:479086665205:web:8c583aac13ec4a0dd214bc",
  measurementId: "G-QFE0P53ZL0",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
var db = getFirestore(app);
const storage = getStorage(app);

export {
  app,
  analytics,
  auth,
  addDoc,
  getDocs,
  collection,
  db,
  ref,
  doc,
  getDoc,
  setDoc,
  storage,
  query,
  where,
  deleteDoc,
  updateDoc,
  onSnapshot,
  uploadBytes,
  deleteObject,
  arrayUnion,
  setPersistence,
  getDownloadURL,
  uploadBytesResumable,
  browserSessionPersistence,
};
