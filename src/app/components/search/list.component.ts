import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { delay, Observable, switchMap } from 'rxjs';
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MatNativeDateModule,
  NativeDateAdapter,
} from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY', // This is the format you want to display the date in
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

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
    TaskListPartial,
    RouterModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class SearchListComponent implements OnInit {
  tasks$: Observable<ITask[]>;
  searchForm: FormGroup;

  constructor(
    private taskService: TaskService,
    private signinService: SigninService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      item: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.tasks$ = this.route.queryParamMap.pipe(
      delay(1000),
      switchMap((params) => {
        const term = params.get('searchTerm');

        return this.taskService.searchTasks(
          this.signinService.getUserId(),
          term
        );
      })
    );
  }

  Logout() {
    this.signinService.logout();
  }

  Search() {
    const searchparams = this.searchForm.value;
    const searchTerm = searchparams.item;
    this.tasks$ = this.taskService.searchTasks(this.signinService.getUserId(), searchTerm);
  }
}
