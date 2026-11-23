import { Injectable, signal, computed, effect } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Task, CreateTaskPayload, UpdateTaskPayload } from '../models/task.model';

const STORAGE_KEY = 'taskflow_tasks';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    // 1. The source of truth
    private readonly _tasks = signal<Task[]>([]);
    public readonly tasks = this._tasks.asReadonly();

    // 2. Computed signals
    public readonly totalTasks = computed(() => this.tasks().length);
    public readonly completedTasks = computed(() => this.tasks().filter(t => t.isCompleted).length);
    public readonly pendingTasks = computed(() => this.tasks().filter(t => !t.isCompleted).length);

    public readonly overdueTasks = computed(() => {
        const now = new Date().toISOString().split('T')[0];
        return this.tasks().filter(t => !t.isCompleted && t.dueDate && t.dueDate < now).length;
    });

    public readonly upcomingTasks = computed(() => {
        return this.tasks()
            .filter(t => !t.isCompleted && t.dueDate)
            .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
            .slice(0, 3);
    });

    public readonly completionProgress = computed(() => {
        const total = this.totalTasks();
        return total === 0 ? 0 : Math.round((this.completedTasks() / total) * 100);
    });

    constructor() {
        this.loadTasks();

        // Automatically save to storage whenever the tasks signal changes
        effect(() => {
            const currentTasks = this._tasks();
            // Skip the initial empty array save before load finishes
            if (currentTasks.length > 0 || !this.isLoading) {
                this.saveTasks(currentTasks);
            }
        });
    }

    private isLoading = true;

    private async loadTasks() {
        try {
            const { value } = await Preferences.get({ key: STORAGE_KEY });
            if (value) {
                this._tasks.set(JSON.parse(value));
            } else {
                // If no data, set mock data on first load
                this.setMockData();
            }
        } catch (e) {
            console.error('Failed to load tasks', e);
            this.setMockData();
        } finally {
            this.isLoading = false;
        }
    }

    private async saveTasks(tasks: Task[]) {
        try {
            await Preferences.set({
                key: STORAGE_KEY,
                value: JSON.stringify(tasks)
            });
        } catch (e) {
            console.error('Failed to save tasks', e);
        }
    }

    // --- CRUD METHODS ---

    addTask(payload: CreateTaskPayload) {
        const newTask: Task = {
            ...payload,
            id: crypto.randomUUID(),
            isCompleted: payload.isCompleted ?? false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this._tasks.update(tasks => [...tasks, newTask]);
    }

    updateTask(id: string, payload: UpdateTaskPayload) {
        this._tasks.update(tasks =>
            tasks.map(task =>
                task.id === id
                    ? { ...task, ...payload, updatedAt: new Date().toISOString() }
                    : task
            )
        );
    }

    deleteTask(id: string) {
        this._tasks.update(tasks => tasks.filter(task => task.id !== id));
    }

    toggleTaskCompletion(id: string) {
        this._tasks.update(tasks =>
            tasks.map(task =>
                task.id === id
                    ? { ...task, isCompleted: !task.isCompleted, updatedAt: new Date().toISOString() }
                    : task
            )
        );
    }

    // 👇 ADDED HERE 👇
    async clearAllTasks() {
        this._tasks.set([]);
        await Preferences.remove({ key: STORAGE_KEY });
    }

    private setMockData() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        this._tasks.set([
            {
                id: '1', title: 'Design Dashboard UI', description: 'Create the dark theme',
                category: 'development', priority: 'high', dueDate: tomorrow.toISOString().split('T')[0],
                isCompleted: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
            },
            {
                id: '2', title: 'Review PR', description: 'Check the new routing',
                category: 'work', priority: 'medium', dueDate: today.toISOString().split('T')[0],
                isCompleted: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
            },
            {
                id: '3', title: 'Buy Groceries', description: 'Milk, eggs, bread',
                category: 'personal', priority: 'low', dueDate: yesterday.toISOString().split('T')[0],
                isCompleted: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
            }
        ]);
    }
}