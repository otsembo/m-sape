import { collection, doc, setDoc, getDoc, getDocs, addDoc, query, where, orderBy, limit } from "firebase/firestore"
import firebase from "../../../utils/firebase";
import {User} from "../models/User";
import {Transaction, TransactionType} from "../models/transaction";

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

// user
const userRef = (uid: string) => doc(firebase.db, "users", uid);
export const userSnapshot  = async (uid: string) => await getDoc(userRef(uid));


// account
export const createBankAccount = async (uid: string) => {
  await setDoc(doc(firebase.db, "accounts", uid), {
    uid: uid,
    balance: 0.00,
    createdAt: Date()
  });
}

const userAccountRef = (uid: string) => doc(firebase.db, "accounts", uid)
export const userAccountSnapshot  = async (uid: string) => await getDoc(userAccountRef(uid));

export const topUpAccount = async (uid: string, amount: number) => {
  const data = await getDoc(userAccountRef(uid));
  await setDoc(userAccountRef(uid), {
    balance: data.data()?.["balance"] + amount,
    createdAt: data.data()?.["createdAt"] ?? Date(),
    updatedAt: Date(),
    uid: uid,
  })
  await addNewTransaction({
    from: data.data()?.["email"] ?? uid,
    partyA: data.data()?.["email"] ?? uid,
    partyB: data.data()?.["email"] ?? uid,
    amount: amount,
    date: new Date(),
    type: TransactionType.DEPOSIT
  }, uid)
}


export const addNewTransaction = async (transaction: Transaction, uid: string) => {
  await addDoc(collection(firebase.db, "transactions"), {
    ...transaction,
    uid: uid
  })
}

const transactionRefs = collection(firebase.db, "transactions");
export const fetchLatestTopUp = async (uid: string) => {
  let fetchQuery =
    query(
      transactionRefs,
      where("uid", "==", uid),
      where("type", "==", TransactionType.DEPOSIT),
      orderBy("date", "desc"),
      limit(1)
    );
  return await getDocs(fetchQuery)
}
