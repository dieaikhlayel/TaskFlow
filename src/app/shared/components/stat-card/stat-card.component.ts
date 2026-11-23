import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardContent, IonIcon } from '@ionic/angular';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss'],
  standalone: true,
  // Add CommonModule here
  imports: [CommonModule, IonCard, IonCardContent, IonIcon]
})
export class StatCardComponent {
  @Input() label: string = '';
  @Input() value: number = 0;
  @Input() icon: string = '';
  @Input() color: string = 'primary';
}