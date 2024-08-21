import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ITask } from 'src/app/models/task.model';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'dm-overdue-list',
  templateUrl: './list.partial.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatCardModule, MatIconModule],
})
export class TaskOverDuelList {
  @Input() tasks: ITask[];

  get sorted(): ITask[] {
    if (this.tasks) {
      return this.tasks.sort((a, b) => {
        return <any>new Date(a.dueDate) - <any>new Date(b.dueDate);
      });
    } else {
      return null;
    }
  }

  isOverDue(date: Date): boolean {
    const today = new Date();
    return new Date(date) < today;
  }
}
