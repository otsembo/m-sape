import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, initializeFirestore } from "firebase/firestore"
import { environment } from "../environments/environment"

const app = initializeApp(environment.config);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export default {
  app, analytics, db
}
