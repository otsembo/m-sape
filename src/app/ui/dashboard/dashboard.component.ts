import { Component } from '@angular/core';
import {Transaction} from "../../data/models/transaction";
import {getUser} from "../../../utils/auth";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  selectedItem: number = 1
  toggleSelection(item: number): void { this.selectedItem = item; }

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
      this.router.navigate(['/auth']).then(_r => null)
    }
  }

}
