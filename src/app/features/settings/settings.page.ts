import { Component, inject } from '@angular/core';
import { IonContent, IonList, IonItem, IonLabel, IonToggle, IonIcon, IonNote, AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { moonOutline, sunnyOutline, trashOutline, informationCircleOutline } from 'ionicons/icons';
import { SettingsService } from '../../core/settings.service';
import { TaskService } from '../../core/task.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonList, IonItem, IonLabel, IonToggle, IonIcon, IonNote,
    PageHeaderComponent
  ]
})
export class SettingsPage {
  public settingsService = inject(SettingsService);
  private taskService = inject(TaskService);
  private alertController = inject(AlertController);

  constructor() {
    addIcons({ moonOutline, sunnyOutline, trashOutline, informationCircleOutline });
  }

  async confirmClearData() {
    const alert = await this.alertController.create({
      header: 'Clear All Data',
      message: 'Are you sure you want to delete all tasks? This cannot be undone.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.taskService.clearAllTasks();
          }
        }
      ]
    });
    await alert.present();
  }
}