import { Component, inject } from '@angular/core';
import { AlertService } from '../services/alert-service';

@Component({
  selector: 'app-alert-service-component',
  imports: [],
  templateUrl: './alert-service-component.html',
  styleUrl: './alert-service-component.css',
})
export class AlertServiceComponent {
  service = inject(AlertService);
  alert = this.service.state;

}
