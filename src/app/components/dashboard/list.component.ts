import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
import { catchError, delay, Observable, of, startWith, switchMap } from 'rxjs';
import { ITask } from 'src/app/models/task.model';
import { TaskState } from 'src/app/services/task.state';
import { TaskOverDuelList } from '../overDue/list.partial';
import { Router, RouterModule } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DialogFormComponent } from '../common/dialog.form';

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
    MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit{
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

  }

  ngOnInit(): void {
    this.tasks$ = this.taskService.getTasks().pipe(
      startWith([]),
      delay(1500),
      switchMap((task) => this.taskState.setList(task)),
      catchError(() => of([]))
    );
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
    this.router.navigate([`/search/`], {
      queryParams: { searchTerm: searchTerm },
    });
  }
}
