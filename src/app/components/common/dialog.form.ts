import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';
import { TaskState } from 'src/app/services/task.state';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MAT_DATE_FORMATS, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';

enum Priority {
    Extreme = 'Extreme',
    Moderate = 'Moderate',
    Low = 'Low',
  }
  
  const MY_DATE_FORMATS = {
    parse: {
      dateInput: 'yyyy/MM/dd',
    },
    display: {
      dateInput: 'yyyy/MM/dd',
      monthYearLabel: 'MMM yyyy',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM yyyy',
    },
  };

@Component({
  selector: 'app-task-dialog',
  templateUrl: './dialog.form.html',
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
    MatIconModule,
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [{ provide: DateAdapter, useClass: NativeDateAdapter }, {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}],
})
export class DialogFormComponent {
  taskForm: FormGroup;
  isEditMode: boolean;
  protected extreme = Priority.Extreme;
  protected moderate = Priority.Moderate;
  protected low = Priority.Low;

  constructor(
    private dialogRef: MatDialogRef<DialogFormComponent>,
    private taskService: TaskService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskState: TaskState,
    private router: Router,
  ) {
    this.isEditMode = !!data?.task;
    this.taskForm = new FormGroup({
      title: new FormControl(this.isEditMode ? data.task.title : '', Validators.required),
      dueDate: new FormControl(this.isEditMode ? data.task.dueDate : '', Validators.required),
      priority: new FormControl(this.isEditMode ? data.task.priority : '', Validators.required),
      description: new FormControl(this.isEditMode ? data.task.description : '', Validators.required),
      status: new FormControl(this.isEditMode ? data.task.status : 'Not Started'),
      createdDate: new FormControl(this.isEditMode ? data.task.createdDate : new Date()),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      if (this.isEditMode) {
        const id = this.data.task.id;
        this.taskService.editTask(id, this.taskForm.value).subscribe(() => {
          this.taskState.editItem(this.taskForm.value);
          this.router.navigateByUrl('/dashboard');
        });
      } else {
        this.taskService.addTask(this.taskForm.value).subscribe((res) => {
          this.taskState.addItem(res);
        });
      }
      this.dialogRef.close(this.taskForm.value);
    }
  }
}
