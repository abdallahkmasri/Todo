import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { ITask } from 'src/app/models/task.model';

@Component({
  selector: 'dm-completed-list',
  templateUrl: './list.partial.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, MatCardModule]
})
export class CompletedListPartial {
  @Input() tasks: ITask[];

  get Completed() {
    if(this.tasks){
      return this.tasks.filter((s) => s.status === 'Completed');
    }
    else{
      return null;
    }
  }
}
