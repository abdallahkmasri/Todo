import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';

enum Priority {
    Extreme = 'extreme',
    Moderate = 'moderate',
    Low = 'low'
  }

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
    ReactiveFormsModule
  ],
})

export class TaskAddComponent {
    taskForm: FormGroup;
    protected extreme = Priority.Extreme;
    protected moderate = Priority.Moderate;
    protected low = Priority.Low;

    constructor(private dialogRef: MatDialogRef<TaskAddComponent>, private taskService: TaskService) {
      this.taskForm = new FormGroup({
        title: new FormControl(''),
        dueDate: new FormControl(new Date()),
        priority: new FormControl(''),
        description: new FormControl(''),
        status: new FormControl('Not Started'),
        isComplete: new FormControl(false),
      });
    }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
    onSubmit(): void {
        debugger
      if (this.taskForm.valid) {
        this.taskService.addTask(this.taskForm.value).subscribe({
            next: (res) => {
                console.log(res);
            }
        });
        this.dialogRef.close(this.taskForm.value);
      }
    }
}
