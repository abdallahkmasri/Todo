import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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
  templateUrl: './add.partial.html',
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
  providers: [{ provide: DateAdapter, useClass: NativeDateAdapter }, {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}],
})
export class TaskAddComponent {
  taskForm: FormGroup;
  protected extreme = Priority.Extreme;
  protected moderate = Priority.Moderate;
  protected low = Priority.Low;

  constructor(
    private dialogRef: MatDialogRef<TaskAddComponent>,
    private taskService: TaskService,
    private taskState: TaskState
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
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.taskService.addTask(this.taskForm.value).subscribe((res) => {
        this.taskState.addItem(res);
      })
      this.dialogRef.close(this.taskForm.value);
    }
  }
}
