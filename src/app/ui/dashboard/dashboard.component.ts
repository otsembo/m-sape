import {Component} from '@angular/core';
import {Transaction, TransactionType} from "../../data/models/transaction";
import {getUser, removeUser} from "../../../utils/auth";
import {Router} from "@angular/router";
import {appError, delay, logout} from "../../../utils/app";
import {userAccountSnapshot, userSnapshot} from "../../data/firebase/app_db";
import {User} from "../../data/models/User";
import {AccountService} from "../../data/services/account/account.service";
import {AppResponse} from "../../data/models/AppResponse";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  selectedItem: number = 1
  user?: User = undefined
  accountBalance?: number = undefined
  commonErrors: { min: AppResponse, max: AppResponse, balance: AppResponse} = {
    min: {
      ...appError,
      body: 'You can not transact less than Ksh. 5'
    },
    max: {
      ...appError,
      body: 'You can not transact more than Ksh. 100,000'
    },
    balance: {
      ...appError,
      body: 'You do not have sufficient balance'
    },
  }

  topUpShown: boolean = false
  topUpLoading: boolean = false
  topUpAmount: number|null = null
  topUpLatest: number = 0
  topUpLatestBalance: number = 0
  topUpError?: AppResponse = undefined

  withdrawShown: boolean = false
  withdrawLoading: boolean = false
  withdrawAmount: number|null = null
  withdrawLatest: number = 0
  withdrawLatestBalance: number = 0
  withdrawError?: AppResponse = undefined

  sendMoneyShown: boolean = false
  sendMoneyLoading: boolean = false
  sendMoneyAmount: number = 0.0
  sendMoneyRecipient: string = ''
  sendMoneyError?: AppResponse = undefined


  async toggleSelection(item: number): Promise<void> {
    this.selectedItem = item;
    await delay();
    removeUser();
    if(item == 4) await logout(this.router)
  }

  latestTransfers: Transaction[] = []

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

    this.accountService.fetchLatestTransaction(TransactionType.DEPOSIT)
      .then(docsData => {
        let transaction =  docsData.body[0].data()
        this.topUpLatest = transaction.amount
        this.topUpLatestBalance = transaction.balance
      })

    this.accountService.fetchLatestTransaction(TransactionType.WITHDRAW)
    .then(docsData => {
        let transaction =  docsData.body[0].data()
        this.withdrawLatest = transaction.amount
        this.withdrawLatestBalance = transaction.balance
      })

    this.accountService.fetchLatestTransfers()
      .then(async query => {
        if(query.docs.length > 0){
          this.latestTransfers = query.docs.map(doc => {
            let transaction = doc.data()
            return {
              from: transaction['from'],
              partyA: transaction['partyA'],
              partyB: transaction['partyB'],
              amount: transaction['amount'],
              date: transaction['date'],
              type: transaction['type']
            }
          })
        }
      })

  }

  toggleTopUp = () => this.topUpShown = !this.topUpShown
  toggleSendMoney = () => this.sendMoneyShown =!this.sendMoneyShown
  toggleWithdraw = () => this.withdrawShown = !this.withdrawShown


  onTopUp = (amount: string) => this.topUpAmount = parseFloat(amount)
  onWithdraw = (amount: string) => this.withdrawAmount = parseFloat(amount)
  onSendMoney = (amount: string, email: string) => {
    this.sendMoneyRecipient = email
    this.sendMoneyAmount = parseFloat(amount)
  }


  topUpAccount = async (e: SubmitEvent) => {
    e.preventDefault()
    this.topUpLoading = true
    const stopLoading = () => {
      this.topUpLoading = false
    }

    if(this.topUpAmount!! < 5){
      this.topUpError = this.commonErrors.min
      stopLoading()
      return
    }

    if(this.topUpAmount!! > 100000){
      this.topUpError = this.commonErrors.max
      stopLoading()
      return
    }

    await this.accountService.updateBalance(this.topUpAmount!!)
    await delay()
    this.fetchUserData()
    this.topUpLoading = false
    this.toggleTopUp()
  }

  withdrawAccount = async (e: SubmitEvent) => {
    e.preventDefault()
    this.withdrawLoading = true
    const stopLoading = () => {
      this.withdrawLoading = false
    }
    if(this.withdrawAmount!! < 5){
      this.withdrawError = this.commonErrors.min
      stopLoading()
      return
    }

    if(this.withdrawAmount!! > 100000){
      this.withdrawError = this.commonErrors.max
      stopLoading()
      return
    }

    if (this.withdrawAmount!! > (this.accountBalance ?? 0)){
      this.withdrawError = this.commonErrors.balance
      stopLoading()
      return
    }
    await this.accountService.withdrawBalance(this.withdrawAmount!!)
    await delay()
    this.fetchUserData()
    this.withdrawLoading = false
    this.toggleWithdraw()
  }

  sendMoney = async (e: SubmitEvent) => {
    e.preventDefault()
    const stopLoading = () => {
      this.sendMoneyLoading = false
    }

    this.sendMoneyLoading = true

    if(this.sendMoneyAmount < 5){
      this.sendMoneyError = this.commonErrors.min
      stopLoading()
      return
    }

    if(this.sendMoneyAmount > 100000){
      this.sendMoneyError = this.commonErrors.max
      stopLoading()
      return
    }

    if (this.sendMoneyAmount > (this.accountBalance ?? 0)){
      this.sendMoneyError = this.commonErrors.balance
      stopLoading()
      return
    }

    await this.accountService
      .sendMoney(this.sendMoneyAmount, this.sendMoneyRecipient)
        .then(() => {
          this.sendMoneyLoading = false
          delay()
          this.toggleSendMoney()
          this.fetchUserData()
        })
        .catch(reason => {
          this.sendMoneyLoading = false
          this.sendMoneyError = {
            status: 500,
            message: 'failed',
            body: reason
          }}
        );
  }



}
