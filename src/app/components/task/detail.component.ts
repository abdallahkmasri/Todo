import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { ITask } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { SigninService } from 'src/app/services/signin.service';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { TaskEditComponent } from '../common/edit.partial';
import { TaskState } from 'src/app/services/task.state';

@Component({
  selector: 'dm-task-detail',
  templateUrl: './detail.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
})
export class TaskDetailComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private signinService: SigninService,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private taskState: TaskState
  ) {
    this.search = this.fb.group({
      item: new FormControl(''),
    });

    this.userName = signinService.getUserName();
  }

  task$: Observable<ITask>;
  userName: string;
  search: FormGroup;
  taskId: string;

  Logout() {
    this.signinService.logout();
  }

  ngOnInit() {
    this.task$ = this.route.paramMap.pipe(
      switchMap((params) => {
        this.taskId = params.get('id');
        return this.taskService.getTaskById(this.taskId);
      })
    );
  }

  Back() {
    this.router.navigateByUrl('/dashboard');
  }

  Delete() {
    this.taskService
      .deleteTask(this.taskId).subscribe(() => {
        this.taskState.removeItem(this.taskId);
        this.Back();
      })
  }

  markComplete() {
    this.task$ = this.taskService
      .markComplete(this.taskId)
      .pipe(tap(() => this.Back()));
  }

  openDialog(task: ITask): void {
    const dialogRef = this.dialog.open(TaskEditComponent, {
      width: '400px',
      data: { task: task }, // Pass any data you want to initialize the dialog with
    });

    dialogRef.afterClosed();
  }
}
