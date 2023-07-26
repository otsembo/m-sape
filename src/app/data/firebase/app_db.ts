import { collection, doc, setDoc, getDoc, getDocs, addDoc, query, where, orderBy, limit, or, and } from "firebase/firestore"
import firebase from "../../../utils/firebase";
import {User} from "../models/User";
import {Transaction, TransactionType} from "../models/transaction";
import {getUser} from "../../../utils/auth";

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
const emailAccRef = collection(firebase.db, "users")

const findEmail = async (email: string) => {
  let fetchQuery =
    query(
      emailAccRef,
      where("email", "==", email),
      where("uid", "!=", localStorage.getItem("uid"))
    );
  return await getDocs(fetchQuery)
}

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
const userDataRef = (uid: string) => doc(firebase.db, "users", uid)
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
    type: TransactionType.DEPOSIT,
    balance: (data.data()?.["balance"] + amount) ?? amount
  }, uid)
}

export const withdrawAccount = async (uid: string, amount: number) => {
  const data = await getDoc(userAccountRef(uid));
  await setDoc(userAccountRef(uid), {
    balance: data.data()?.["balance"] - amount,
    createdAt: data.data()?.["createdAt"]?? Date(),
    updatedAt: Date(),
    uid: uid,
  })
  await addNewTransaction({
    from: data.data()?.["email"]?? uid,
    partyA: data.data()?.["email"]?? uid,
    partyB: data.data()?.["email"]?? uid,
    amount: amount,
    date: new Date(),
    type: TransactionType.WITHDRAW,
    balance: (data.data()?.["balance"] - amount)?? amount
  }, uid)
}

export const addNewTransaction = async (transaction: any, uid: string) => {
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

export const fetchLatestAccountTransaction = async (uid: string, type: TransactionType) => {
  let fetchQuery =
    query(
      transactionRefs,
      where("uid", "==", uid),
      where("type", "==", type),
      orderBy("date", "desc"),
      limit(1)
    );
  return await getDocs(fetchQuery)
}

export async function sendMoneyToUser(uid: string, sendMoneyAmount: number, email: string) {
  const partyB = await findEmail(email)
  const partyA= await userAccountSnapshot(uid)
  const partyAData = await getDoc(userDataRef(uid));
  const partyBAccount = await userAccountSnapshot(partyB.docs[0].data()?.["uid"])

  if(partyB.docs.length == 0) {
    throw new Error(`You cannot send money to ${email}! Please try again with a different email`)
  }

  const sendAmount = parseFloat(String(sendMoneyAmount))

  // deduct amount
  await setDoc(userAccountRef(uid), {
    balance: partyA.data()?.["balance"] - sendAmount,
    createdAt: partyA.data()?.["createdAt"]?? Date(),
    updatedAt: Date(),
    uid: uid,
  })

  // add transaction
  await addNewTransaction({
    from: uid,
    partyA: uid,
    partyB: partyB.docs[0].data()?.["email"],
    amount: sendAmount,
    date: new Date(),
    type: TransactionType.TRANSFER,
    balance: partyA.data()?.["balance"] - sendAmount,
  }, uid)

  // add amount
  await setDoc(userAccountRef(partyB.docs[0].data()?.["uid"]), {
    balance: partyBAccount.data()?.["balance"] + sendAmount,
    createdAt: partyB.docs[0].data()?.["createdAt"]?? Date(),
    updatedAt: Date(),
    uid: partyB.docs[0].data()?.["uid"],
  })

  // add transaction
  await addNewTransaction({
    from: uid,
    partyA: partyB.docs[0].data()?.["uid"],
    partyB: partyAData.data()?.["email"],
    amount: sendAmount,
    date: new Date(),
    type: TransactionType.RECEIVE,
    balance: partyBAccount.data()?.["balance"] + sendAmount
  }, partyB.docs[0].data()?.["uid"]!!)

}

// money exchanges
export const fetchMoneyExchanges = async (uid: string) => {
  let fetchQuery =
    query(
      transactionRefs,
      and(
        where("uid", "==", uid),
        or(
          where("type", "==", TransactionType.RECEIVE),
          where("type", "==", TransactionType.TRANSFER),
          ),
      ),
      orderBy("date", "desc"),
      limit(3)
    );
  return await getDocs(fetchQuery)
}
