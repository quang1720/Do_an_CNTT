import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAZ8wOYB4su32nY6UiX7pTNsrWxPMQt0fM",
  authDomain: "teacher-management-admin.firebaseapp.com",
  projectId: "teacher-management-admin",
  storageBucket: "teacher-management-admin.appspot.com",
  messagingSenderId: "285301999270",
  appId: "1:285301999270:web:91fd0fd908d951f7635667",
};

const app = firebase.initializeApp(firebaseConfig);
const storage = getStorage(app);
export default storage;
