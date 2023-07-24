import {Component, Input} from '@angular/core';
import {AppResponse} from "../../../data/models/AppResponse";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent {
  @Input() success: boolean = true;
  @Input() response!: AppResponse;
}
