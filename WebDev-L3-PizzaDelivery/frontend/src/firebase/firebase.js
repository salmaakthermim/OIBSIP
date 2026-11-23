import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAkF1ryeMTHsXdDo2f1RKMFtHUHSPk9Zo8",
  authDomain: "pizza-app-bc064.firebaseapp.com",
  projectId: "pizza-app-bc064",
  storageBucket: "pizza-app-bc064.firebasestorage.app",
  messagingSenderId: "438394295235",
  appId: "1:438394295235:web:80976bc8ea57c6c9afa376"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
