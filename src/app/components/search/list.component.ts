import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { ITask } from 'src/app/models/task.model';
import { SigninService } from 'src/app/services/signin.service';
import { TaskService } from 'src/app/services/task.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { TaskListPartial } from '../task/list.partial';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  templateUrl: './list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatCardModule,
    TaskListPartial
  ],
})
export class SearchListComponent implements OnInit {
  tasks$: Observable<ITask[]>;
  search: FormGroup;

  constructor(
    private taskService: TaskService,
    private signinService: SigninService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.search = this.fb.group({
      item: new FormControl(''),
    });
  }

  searchTasks(title?: string, startDate?: Date, endDate?: Date): void {
    const userId = this.signinService.getUserId();
    const formattedStartDate = startDate ? startDate.toISOString() : undefined;
    const formattedEndDate = endDate ? endDate.toISOString() : undefined;

    this.tasks$ = this.taskService.searchTasks(
      userId,
      title,
      formattedStartDate,
      formattedEndDate
    );
  }

  ngOnInit(): void {
    this.tasks$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const term = params.get('searchparams');

        if (this.isDate(term)) {
          // If the term is a date, search for tasks with the given start date and no end date
          return this.taskService.searchTasks(
            this.signinService.getUserId(),
            undefined,
            term,
            undefined
          );
        } else {
          // If the term is not a date, search for tasks with the given title and no start/end dates
          return this.taskService.searchTasks(
            this.signinService.getUserId(),
            term,
            undefined,
            undefined
          );
        }
      })
    );
  }

  isDate(value: any): boolean {
    const parsedDate = Date.parse(value);
    return !isNaN(parsedDate);
  }

  Logout() {
    this.signinService.logout();
  }
}
