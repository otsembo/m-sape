import { Injectable } from '@angular/core';
import {AppResponse} from "../../models/AppResponse";
import {topUpAccount} from "../../firebase/app_db";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor() { }

  async updateBalance(amount: number): Promise<AppResponse>{
    console.log("amount", amount);
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

}
