import { Component } from '@angular/core';
import {Transaction} from "../../data/models/transaction";
import {getUser, removeUser} from "../../../utils/auth";
import {Router} from "@angular/router";
import {delay, logout} from "../../../utils/app";
import {userSnapshot} from "../../data/firebase/app_db";
import {User} from "../../data/models/User";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  selectedItem: number = 1
  user?: User = undefined

  async toggleSelection(item: number): Promise<void> {
    this.selectedItem = item;
    await delay();
    removeUser();
    await logout(this.router)
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

  constructor(private router: Router,) {
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
      })
  }

}
