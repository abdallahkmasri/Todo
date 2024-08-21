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
import { TaskAddComponent } from '../common/add.partial';
import { TaskService } from 'src/app/services/task.service';
import { Observable, switchMap } from 'rxjs';
import { ITask } from 'src/app/models/task.model';
import { TaskState } from 'src/app/services/task.state';
import { TaskOverDuelList } from '../overDue/list.partial';
import { Router } from '@angular/router';

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    const dialogRef = this.dialog.open(TaskAddComponent, {
      width: '400px',
      data: { task: {} }, // Pass any data you want to initialize the dialog with
    });

    dialogRef.afterClosed();
  }

  Search() {
    const searchparams = this.searchForm.value;
    this.router.navigateByUrl(`/search/${searchparams}`);
  }
}
