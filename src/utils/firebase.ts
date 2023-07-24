import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, initializeFirestore } from "firebase/firestore"

const config = {
  apiKey: "AIzaSyBeZ49SSild84zSpUaaO5RkK-uWnQQPQCw",
  authDomain: "m-sape.firebaseapp.com",
  projectId: "m-sape",
  storageBucket: "m-sape.appspot.com",
  messagingSenderId: "980094794480",
  appId: "1:980094794480:web:61940c4d1d328c7d4aa035",
  measurementId: "G-KLD9F1XSPJ"
};

const app = initializeApp(config);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export default {
  app, analytics, db
}
