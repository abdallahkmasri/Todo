import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
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
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { TaskState } from 'src/app/services/task.state';
import { DialogFormComponent } from '../common/dialog.form';

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
    RouterModule,
  ],
})
export class TaskDetailComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private signinService: SigninService,
    private taskService: TaskService,
    private router: Router,
    private dialog: MatDialog,
    private taskState: TaskState
  ) {
    this.searchForm = this.fb.group({
      item: new FormControl(''),
    });
  }

  task$: Observable<ITask>;
  userName: string;
  searchForm: FormGroup;
  @Input() id: string;

  Logout() {
    this.signinService.logout();
  }

  ngOnInit() {
    this.task$ = this.taskService.getTaskById(this.id);
  }

  Back() {
    this.router.navigateByUrl('/dashboard');
  }

  Delete() {
    this.taskService.deleteTask(this.id).subscribe({
      next: () => {
        this.taskState.removeItem(this.id);
        this.Back();
      },
    });
  }

  markComplete() {
    this.taskService.markComplete(this.id).subscribe({
      next: () => {
        this.Back();
      },
    });
  }

  openDialog(task: ITask): void {
    this.dialog.open(DialogFormComponent, {
      width: '650px',
      data: { task: task }, // Pass any data you want to initialize the dialog with
    });
  }

  Search() {
    const searchparams = this.searchForm.value;
    const searchTerm = searchparams.item;
    this.router.navigate([`/search/`], {
      queryParams: { searchTerm: searchTerm },
    });
  }

  getCategory(category: string): string {
    return category ? category : 'No Category';
  }
}
