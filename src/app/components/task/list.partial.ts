import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { ITask } from 'src/app/models/task.model';

@Component({
  selector: 'dm-task-list',
  templateUrl: './list.partial.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatCardModule, MatIconModule, RouterModule, MatPaginatorModule],
})
export class TaskListPartial {
  @Input() tasks: ITask[];

  protected pageIndex = 0;
  protected pageSize = 3;

  handlePageEvent(event: PageEvent) {
    this.pageIndex = event.pageIndex;
  }

  get sorted(): ITask[] {
    if (this.tasks) {
      return this.tasks.sort((a, b) => this.compareTasks(a, b)).filter(t => t.status !== "Completed");
    } else {
      return [];
    }
  }

  // Method to compare tasks based on priority and due date
  compareTasks(task1: ITask, task2: ITask): number {
    const priorityOrder = this.getPriorityOrder(task1.priority) - this.getPriorityOrder(task2.priority);
    if (priorityOrder !== 0) {
      return priorityOrder;
    }
    return new Date(task1.dueDate).getTime() - new Date(task2.dueDate).getTime();
  }

  // Method to assign a numeric value to each priority for comparison
  getPriorityOrder(priority: string): number {
    switch (priority) {
      case 'extreme':
        return 1;
      case 'moderate':
        return 2;
      default:
        return 3;
    }
  }

  tasksLength(): number {
    return this.sorted?.filter(task => task.status !== 'Completed').length || 0;
  }

  get paginatedTasks(): ITask[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.sorted.slice(startIndex, startIndex + this.pageSize);
  }
}
