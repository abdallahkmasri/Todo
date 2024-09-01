import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { ITask } from 'src/app/models/task.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'dm-completed-list',
  templateUrl: './list.partial.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    RouterModule,
    MatPaginatorModule,
  ],
})
export class CompletedListPartial {
  @Input() tasks: ITask[];
  protected pageIndex = 0;
  protected pageSize = 2;

  handlePageEvent(event: PageEvent) {
    this.pageIndex = event.pageIndex;
  }

  get Completed() {
    if (this.tasks) {
      return this.tasks.filter((s) => s.status === 'Completed');
    } else {
      return null;
    }
  }

  tasksLength(): number {
    return (
      this.Completed?.filter((task) => task.status === 'Completed').length || 0
    );
  }

  get paginatedTasks(): ITask[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.Completed.slice(startIndex, startIndex + this.pageSize);
  }

  getCategory(category: string): string {
    return category ? category : 'No Category';
  }
}
