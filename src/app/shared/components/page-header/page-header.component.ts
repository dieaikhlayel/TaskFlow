import { Component, Input } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle } from '@ionic/angular';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle]
})
export class PageHeaderComponent {
  @Input() title: string = '';
}