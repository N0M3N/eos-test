import { Component, inject } from '@angular/core';
import { NotificationsService } from '../../services';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [AsyncPipe, CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {
  notificationsSvc = inject(NotificationsService);
  notifications$ = this.notificationsSvc.notifications$;

  constructor() {
  }
}
