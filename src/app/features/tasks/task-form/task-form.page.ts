import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonItem, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption,
  IonButton, IonDatetime
} from '@ionic/angular';
import { TaskService } from '../../../core/task.service';
import { TASK_CATEGORIES } from '../../../models/task.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.page.html',
  styleUrls: ['./task-form.page.scss'],
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, IonContent, IonHeader, IonToolbar, IonTitle,
    IonButtons, IonBackButton, IonItem, IonLabel, IonInput, IonTextarea, IonSelect,
    IonSelectOption, IonButton, IonDatetime
  ]
})
export class TaskFormPage implements OnInit {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public taskForm!: FormGroup;
  public isEditMode = false;
  public taskId: string | null = null;
  public categories = TASK_CATEGORIES;
  public minDate = new Date().toISOString(); // Prevents picking past dates

  ngOnInit() {
    this.initForm();
    this.checkEditMode();
  }

  private initForm() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      category: ['personal', Validators.required],
      priority: ['medium', Validators.required],
      dueDate: [new Date().toISOString(), Validators.required]
    });
  }

  private checkEditMode() {
    this.taskId = this.route.snapshot.paramMap.get('id');
    if (this.taskId) {
      this.isEditMode = true;
      const existingTask = this.taskService.tasks().find(t => t.id === this.taskId);
      if (existingTask) {
        this.taskForm.patchValue(existingTask);
      }
    }
  }

  saveTask() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const formValue = this.taskForm.value;
    // Format date to YYYY-MM-DD as required by our model
    const formattedDate = new Date(formValue.dueDate).toISOString().split('T')[0];

    const taskData = {
      ...formValue,
      dueDate: formattedDate
    };

    if (this.isEditMode && this.taskId) {
      this.taskService.updateTask(this.taskId, taskData);
    } else {
      this.taskService.addTask(taskData);
    }

    // Navigate back to the tasks list
    this.router.navigate(['/tabs/tasks']);
  }
}