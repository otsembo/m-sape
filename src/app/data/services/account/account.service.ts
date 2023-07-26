import { Injectable } from '@angular/core';
import {AppResponse} from "../../models/AppResponse";
import {fetchLatestAccountTransaction, fetchLatestTopUp, topUpAccount, withdrawAccount} from "../../firebase/app_db";
import {TransactionType} from "../../models/transaction";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor() { }

  async updateBalance(amount: number): Promise<AppResponse>{
    return await topUpAccount(localStorage.getItem("uid")!!, amount)
    .then(_=> {
      return {
        status: 200,
        message: "success",
        body: {
          balance: "Balance updated"
        }
      }
    })
  }

  async withdrawBalance(amount: number): Promise<AppResponse>{
    return await withdrawAccount(localStorage.getItem("uid")!!, amount)
    .then(_=> {
      return {
        status: 200,
        message: "success",
        body: {
          balance: "Balance updated"
        }
      }
    })
  }

  async fetchLatestTransaction(type: TransactionType): Promise<AppResponse> {
    return await fetchLatestAccountTransaction(localStorage.getItem("uid")!!, type)
    .then(data=> {
      return {
        status: 200,
        message: "success",
        body: data.docs
      }
    })
  }

}
