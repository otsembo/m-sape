import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-nav',
  templateUrl: './dashboard-nav.component.html',
  styleUrls: ['./dashboard-nav.component.css']
})
export class DashboardNavComponent {
  @Input() email?: string
  @Input() toggleSendMoney?: () => void
}
