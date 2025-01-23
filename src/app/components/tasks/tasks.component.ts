import { Component } from '@angular/core';
import { Task } from '../task/task.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent {
  showMessage = false;
  todo: Task[] = [
    { title: 'Buy milk', description: 'Go to the store and buy milk' },
    { title: 'Drawing on canvas', description: 'Buy 3 canvas and pens!' },
  ];
  inProgress: Task[] = [];
  done: Task[] = [];

  addTaskForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(5)]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
  });

  get title() {
    return this.addTaskForm.get('title')!;
  }

  get description() {
    return this.addTaskForm.get('description')!;
  }

  addTask(): void {
    if (this.addTaskForm.valid) {
      const newTask: Task = {
        title: this.addTaskForm.value.title!,
        description: this.addTaskForm.value.description!,
      };
      this.todo.push(newTask);
      this.addTaskForm.reset();
      this.showTemporaryMessage('Task added!');
    }
  }

  showTemporaryMessage(message: string): void {
    this.showMessage = true;
    setTimeout(() => (this.showMessage = false), 3000);
  }

  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) return;
    transferArrayItem(
      event.previousContainer.data!,
      event.container.data!,
      event.previousIndex,
      event.currentIndex
    );
  }

  editTask(list: string, task: Task): void {
    // Find the task in the respective list and populate the form with its data
    this.addTaskForm.patchValue({
      title: task.title,
      description: task.description,
    });

    // Remove the task from its current list
    if (list === 'todo') {
      this.todo = this.todo.filter((t) => t !== task);
    } else if (list === 'inProgress') {
      this.inProgress = this.inProgress.filter((t) => t !== task);
    } else if (list === 'done') {
      this.done = this.done.filter((t) => t !== task);
    }
  }

  deleteIt(list: string, task: Task) {
    if (list === 'todo') {
      const index = this.todo.indexOf(task);
      if (index > -1) {
        this.todo.splice(index, 1);
      }
    } else if (list === 'inProgress') {
      const index = this.inProgress.indexOf(task);
      if (index > -1) {
        this.inProgress.splice(index, 1);
      }
    } else if (list === 'done') {
      const index = this.done.indexOf(task);
      if (index > -1) {
        this.done.splice(index, 1);
      }
    }
  }
}
