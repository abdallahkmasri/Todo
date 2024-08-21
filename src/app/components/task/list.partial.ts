import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ITask } from 'src/app/models/task.model';

@Component({
  selector: 'dm-task-list',
  templateUrl: './list.partial.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatCardModule, MatIconModule, RouterModule],
})
export class TaskListPartial {
  @Input() tasks: ITask[];

  get sorted(): ITask[] {
    if (this.tasks) {
      return this.tasks.sort((a, b) => this.compareTasks(a, b));
    } else {
      return null;
    }
  }

  // Method to compare tasks based on priority and due date
  compareTasks(task1: ITask, task2: ITask): number {
    const priorityOrder =
      this.getPriorityOrder(task1.priority) -
      this.getPriorityOrder(task2.priority);
    if (priorityOrder !== 0) {
      return priorityOrder;
    }
    return (
      new Date(task1.dueDate).getTime() - new Date(task2.dueDate).getTime()
    );
  }

  // Method to assign a numeric value to each priority for comparison
  getPriorityOrder(priority: string): number {
    switch (priority) {
      case 'extreme':
        return 1;
      case 'moderate':
        return 2;
      case 'low':
        return 3;
      default:
        return 4;
    }
  }
}
