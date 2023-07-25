export interface Transaction {
  from: string;
  partyA: string;
  partyB: string;
  amount: number;
  date: Date;
  type?: TransactionType;
}

export enum TransactionType {
  DEPOSIT = 'Deposit',
  WITHDRAW = 'Withdraw',
  TRANSFER = 'Transfer',
  RECEIVE = 'Receive',
}
