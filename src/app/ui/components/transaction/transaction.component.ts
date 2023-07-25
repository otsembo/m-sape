import { Component, Input } from '@angular/core';
import {Transaction} from "../../../data/models/transaction";

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent {
  @Input() transaction?: Transaction;
  isNegative?: boolean = this.transaction?.from == this.transaction?.partyA;
  private headerColors: string[] = [ 'bg-red-500', 'bg-green-500', 'bg-yellow-500', 'bg-cyan-500', 'bg-teal-500', 'bg-gray-500', 'bg-blue-500' ];
  headerColor: string = this.headerColors[Math.floor(Math.random() * this.headerColors.length)]
  constructor() {
    console.log("Transaction", this.isNegative)
  }
}
