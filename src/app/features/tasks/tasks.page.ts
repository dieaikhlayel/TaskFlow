import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonFab, IonFabButton, IonIcon, IonList, IonItem, IonLabel,
  IonCheckbox, IonSearchbar, IonSegment, IonSegmentButton, IonSelect,
  IonSelectOption, IonItemSliding, IonItemOptions, IonItemOption, IonBadge
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add, trash, flag } from 'ionicons/icons';
import { TaskService } from '../../core/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule, IonContent, IonFab, IonFabButton,
    IonIcon, IonList, IonItem, IonLabel, IonCheckbox, IonSearchbar, IonSegment,
    IonSegmentButton, IonSelect, IonSelectOption, IonItemSliding, IonItemOptions,
    IonItemOption, IonBadge
  ]
})
export class TasksPage {
  public taskService = inject(TaskService);

  // Filter States
  public searchQuery = signal<string>('');
  public statusFilter = signal<string>('all'); // 'all' | 'pending' | 'completed'
  public priorityFilter = signal<string>('all'); // 'all' | 'low' | 'medium' | 'high'

  // Derived state for the UI
  public filteredTasks = computed(() => {
    let tasks = this.taskService.tasks();
    const query = this.searchQuery().toLowerCase().trim();
    const status = this.statusFilter();
    const priority = this.priorityFilter();

    // 1. Search by title
    if (query) {
      tasks = tasks.filter(t => t.title.toLowerCase().includes(query));
    }

    // 2. Filter by status
    if (status === 'pending') {
      tasks = tasks.filter(t => !t.isCompleted);
    } else if (status === 'completed') {
      tasks = tasks.filter(t => t.isCompleted);
    }

    // 3. Filter by priority
    if (priority !== 'all') {
      tasks = tasks.filter(t => t.priority === priority);
    }

    // 4. Sort by due date (ascending)
    return tasks.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  });

  constructor() {
    addIcons({ add, trash, flag });
  }

  toggleTask(id: string) {
    this.taskService.toggleTaskCompletion(id);
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id);
  }
}