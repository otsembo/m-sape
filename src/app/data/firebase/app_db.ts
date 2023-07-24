import { doc, setDoc } from "firebase/firestore"
import firebase from "../../../utils/firebase";
import {User} from "../models/User";

// auth
export const createAccount = async (user: User)=> {
  await setDoc(doc(firebase.db, "users", user.uid), {
    name: user.name,
    email: user.email,
    uid: user.uid,
    createdAt: Date(),
    phone: user.phone
  });
}

