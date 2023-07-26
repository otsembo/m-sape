import { Injectable } from '@angular/core';
import {AppResponse} from "../../models/AppResponse";
import {fetchLatestTopUp, topUpAccount} from "../../firebase/app_db";

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

  async getLatestTopUp(): Promise<AppResponse> {
    return await fetchLatestTopUp(localStorage.getItem("uid")!!)
    .then(data => {
      return {
        status: 200,
        message: "success",
        body: data.docs
      }
    })
  }

}
