import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-dashboard-menu-item',
  templateUrl: './dashboard-menu-item.component.html',
  styleUrls: ['./dashboard-menu-item.component.css']
})
export class DashboardMenuItemComponent {
  @Input() selected: boolean = false;
  @Input() icon?: string;
  @Input() title?: string;
}
