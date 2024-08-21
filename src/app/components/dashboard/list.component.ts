import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { SigninService } from 'src/app/services/signin.service';
import { TaskListPartial } from '../task/list.partial';
import { CompletedListPartial } from '../completed/list.partial';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { TaskService } from 'src/app/services/task.service';
import { Observable, switchMap } from 'rxjs';
import { ITask } from 'src/app/models/task.model';
import { TaskState } from 'src/app/services/task.state';
import { TaskOverDuelList } from '../overDue/list.partial';
import { Router, RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MatNativeDateModule,
  NativeDateAdapter,
} from '@angular/material/core';
import { DialogFormComponent } from '../common/dialog.form';

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
  styleUrls: ['./list.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    TaskListPartial,
    CompletedListPartial,
    TaskOverDuelList,
    RouterModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class DashboardComponent {
  searchForm: FormGroup;
  userName: string;
  userId: string;
  date = new Date();
  tasks$: Observable<ITask[]>;

  constructor(
    private fb: FormBuilder,
    private signinService: SigninService,
    private dialog: MatDialog,
    private taskService: TaskService,
    private taskState: TaskState,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      item: new FormControl(''),
    });
    this.userName = this.signinService.getUserName();

    this.userId = this.signinService.getUserId();
    this.tasks$ = this.taskService
      .getTasks(this.userId)
      .pipe(switchMap((task) => this.taskState.setList(task)));
  }

  Logout() {
    this.signinService.logout();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogFormComponent, {
      width: '650px',
    });

    dialogRef.afterClosed();
  }

  Search() {
    const searchparams = this.searchForm.value;
    const searchTerm = searchparams.item;
    console.log('search: ' + JSON.stringify(searchTerm));
    this.router.navigate([`/search/`],  {queryParams: {searchTerm: searchTerm}});
  }
}
