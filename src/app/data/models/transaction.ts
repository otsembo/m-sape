import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface Transaction {
  from: string;
  partyA: string;
  partyB: string;
  amount: number;
  date: Date|Timestamp;
  type?: TransactionType;
}

export enum TransactionType {
  DEPOSIT = 'Deposit',
  WITHDRAW = 'Withdraw',
  TRANSFER = 'Transfer',
  RECEIVE = 'Receive',
}
