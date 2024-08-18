import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dm-completed-list',
  templateUrl: './list.partial.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, MatCardModule]
})
export class CompletedListPartial {
  completedTasks = [
    {
      title: "Walk the dog",
      description: "Take the dog to the park and bring treats as well.",
      status: "Completed",
      completedDate: new Date(2023, 5, 18)
    },
    {
      title: "Conduct meeting",
      description: "Meet with the client and finalize requirements.",
      status: "Completed",
      completedDate: new Date(2023, 5, 18)
    }
  ];
}
