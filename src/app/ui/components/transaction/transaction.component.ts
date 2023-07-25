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
  constructor() {
    console.log("Transaction", this.isNegative)
  }
}
