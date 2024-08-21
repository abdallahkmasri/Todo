import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MatNativeDateModule,
  NativeDateAdapter,
} from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';
import { TaskState } from 'src/app/services/task.state';
import { Router } from '@angular/router';
import { ITask } from 'src/app/models/task.model';

enum Priority {
  Extreme = 'extreme',
  Moderate = 'moderate',
  Low = 'low',
}

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
  selector: 'dm-task-dialog',
  templateUrl: './edit.partial.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatInputModule,
    MatButtonModule,
    MatNativeDateModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class TaskEditComponent {
  taskForm: FormGroup;
  protected extreme = Priority.Extreme;
  protected moderate = Priority.Moderate;
  protected low = Priority.Low;
  taskId: string;

  constructor(
    private dialogRef: MatDialogRef<TaskEditComponent>,
    private taskService: TaskService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private taskState: TaskState,
    private router: Router
  ) {
    this.taskForm = new FormGroup({
      title: new FormControl(''),
      dueDate: new FormControl(''),
      priority: new FormControl(''),
      description: new FormControl(''),
      status: new FormControl('Not Started'),
      isComplete: new FormControl(false),
      createdDate: new FormControl(new Date()),
    });

    this.taskId = this.data.task.id;

    this.taskForm.patchValue({
      title: data.task.title,
      dueDate: data.task.dueDate,
      priority: data.task.priority,
      description: data.task.description,
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const id = this.taskId;
      const form: ITask = {
        title: this.taskForm.value.title,
        dueDate: this.taskForm.value.dueDate,
        priority: this.taskForm.value.priority,
        description: this.taskForm.value.description,
        status: this.taskForm.value.status,
        isComplete: this.taskForm.value.isComplete,
        createdDate: this.taskForm.value.createdDate,
        id: Number(id),
      }
      this.taskService.editTask(id, form).subscribe((res) => {
        this.taskState.editItem(res);
        this.dialogRef.close(res);
        this.router.navigateByUrl('/dashboard');
      });
    }
  }
}
