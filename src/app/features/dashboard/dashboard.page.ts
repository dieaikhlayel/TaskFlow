import { Component, inject } from '@angular/core';
import { IonContent, IonProgressBar, IonList, IonItem, IonLabel, IonNote } from '@ionic/angular';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { TaskService } from '../../core/task.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonProgressBar,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    PageHeaderComponent,
    StatCardComponent
  ],
})
export class DashboardPage {
  // Inject the service publicly so the template can access its signals
  public taskService = inject(TaskService);
}