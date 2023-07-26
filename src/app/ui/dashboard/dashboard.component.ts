import { Component } from '@angular/core';
import {Transaction} from "../../data/models/transaction";
import {getUser, removeUser} from "../../../utils/auth";
import {Router} from "@angular/router";
import {delay, logout} from "../../../utils/app";
import {userAccountSnapshot, userSnapshot} from "../../data/firebase/app_db";
import {User} from "../../data/models/User";
import {AccountService} from "../../data/services/account/account.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  selectedItem: number = 1
  user?: User = undefined
  accountBalance?: number = undefined

  topUpShown: boolean = false
  topUpLoading: boolean = false
  topUpAmount: number|null = null
  topUpLatest: number = 0

  withdrawShown: boolean = false
  withdrawLoading: boolean = false
  withdrawAmount: number|null = null

  sendMoneyShown: boolean = false
  sendMoneyLoading: boolean = false
  sendMoneyAmount: number = 0.0


  async toggleSelection(item: number): Promise<void> {
    this.selectedItem = item;
    await delay();
    removeUser();
    if(item == 4) await logout(this.router)
  }

  sampleTransaction: Transaction = {
    from: "bingo@mail.com",
    partyA: "bingo@mail.com",
    partyB: "okumu.otsembo@gmail.com",
    amount: 1000019,
    date: new Date()
  }

  sampleTransaction2: Transaction = {
    from: "mail@mail.com",
    partyA: "a",
    partyB: "mail@mail.com",
    amount: 290890,
    date: new Date()
  }

  constructor(private router: Router, private accountService: AccountService) {
    if(!getUser()){
      logout(this.router).then(_ => {});
    }
    this.fetchUserData()
  }

  private fetchUserData(){
    userSnapshot(getUser()!!)
      .then(snap => {
        if (snap.exists()){
          let userSnap = snap.data()
          this.user = {
            name: userSnap["name"],
            email: userSnap["email"],
            uid: userSnap["uid"],
            createdAt: userSnap["createdAt"],
            phone: userSnap["phone"]
          };
        }
      });

    userAccountSnapshot(getUser()!!)
      .then(snap => {
        if (snap.exists()){
          let userSnap = snap.data()
          this.accountBalance = userSnap["balance"]
        }
      });

    this.accountService.getLatestTopUp()
    .then(docsData => {
      let transaction =  docsData.body[0].data()
      this.topUpLatest = transaction.amount
    })

  }

  toggleTopUp = () => this.topUpShown = !this.topUpShown
  toggleSendMoney = () => this.sendMoneyShown =!this.sendMoneyShown
  toggleWithdraw = () => {
    this.withdrawShown = !this.withdrawShown
  }

  onTopUp = (amount: string) => this.topUpAmount = parseFloat(amount)
  onWithdraw = (amount: string) => this.withdrawAmount = parseFloat(amount)


  updateAccountBalance = async (e: SubmitEvent) => {
    e.preventDefault()
    this.topUpLoading = true
    await this.accountService.updateBalance(this.topUpAmount!!)
    await delay()
    this.fetchUserData()
    this.topUpLoading = false
    this.toggleTopUp()
  }

  withdrawAccount = async (e: SubmitEvent) => {
    e.preventDefault()
    this.withdrawLoading = true
    await delay()
    this.fetchUserData()
    this.withdrawLoading = false
    this.toggleWithdraw()
  }

}
