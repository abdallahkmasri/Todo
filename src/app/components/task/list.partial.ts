import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { ITask } from 'src/app/models/task.model';
import { SigninService } from 'src/app/services/signin.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'dm-task-list',
  templateUrl: './list.partial.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule ,MatCardModule, MatIconModule],
})
export class TaskListPartial implements OnInit{
    tasks$: Observable<ITask[]>;

    constructor(private taskService: TaskService, private signinService: SigninService){}

    ngOnInit(): void {
        const userId = this.signinService.getUserId();
        this.tasks$ = this.taskService.getTasks(userId);
    }


  addTask(){

  }
}

//   tasks = [
//     {
//       title: "Attend Nischal's Birthday Party",
//       description: "Buy gifts on the way and pick up cake from the bakery. (6 PM | Fresh Elements)",
//       priority: "Moderate",
//       status: "Not Started",
//       createdDate: new Date(2023, 5, 20)
//     },
//     {
//       title: "Landing Page Design for TravelDays",
//       description: "Get the work done by EOD and discuss with client before leaving. (4 PM | Meeting Room)",
//       priority: "Moderate",
//       status: "In Progress",
//       createdDate: new Date(2023, 5, 20)
//     },
//     {
//       title: "Presentation on Final Product",
//       description: "Make sure everything is functioning and all the necessities are properly met. Prepare the team and get the documents ready for...",
//       priority: "Moderate",
//       status: "In Progress",
//       createdDate: new Date(2023, 5, 19)
//     }
//   ];
