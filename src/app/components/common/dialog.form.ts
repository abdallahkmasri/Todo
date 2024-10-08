import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';
import { TaskState } from 'src/app/services/task.state';
import { CommonModule } from '@angular/common';
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
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class DialogFormComponent {
  taskForm: FormGroup;
  isEditMode: boolean;
  protected extreme = Priority.Extreme;
  protected moderate = Priority.Moderate;
  protected low = Priority.Low;

  categories: string[] = ['Work', 'Family', 'Health', 'Financial', 'Other'];

  constructor(
    private dialogRef: MatDialogRef<DialogFormComponent>,
    private taskService: TaskService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskState: TaskState,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.isEditMode = !!data?.task;
    this.taskForm = this.fb.group({
      title: new FormControl(
        this.isEditMode ? data.task.title : '',
        Validators.required
      ),
      dueDate: new FormControl(
        this.isEditMode ? data.task.dueDate : '',
        Validators.required
      ),
      priority: new FormControl(
        this.isEditMode ? data.task.priority : '',
        Validators.required
      ),
      description: new FormControl(
        this.isEditMode ? data.task.description : '',
        Validators.required
      ),
      status: new FormControl(
        this.isEditMode ? data.task.status : 'NotStarted'
      ),
      createdDate: new FormControl(
        this.isEditMode ? data.task.createdDate : new Date()
      ),
      taskCategories: this.fb.array(
        this.categories.map(() => this.fb.control(false))
      ),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    debugger;
    if (this.taskForm.valid) {
      const selectedCategories = this.taskForm.value.taskCategories
        .map((checked, i) => (checked ? this.categories[i] : null))
        .filter((value) => value !== null);

      const taskData = {
        ...this.taskForm.value,
        taskCategories: selectedCategories, // Save the selected categories
      };

      if (this.isEditMode) {
        const id = this.data.task.id;
        this.taskService.editTask(id, taskData).subscribe({
          next: () => {
            this.taskState.editItem(taskData);
            this.router.navigateByUrl('/dashboard');
          },
        });
      } else {
        this.taskService.addTask(taskData).subscribe({
          next: (res) => {
            debugger;
            this.taskState.addItem(res);
            console.log(res);
            console.log(taskData);
          },
        });
      }
      this.dialogRef.close();
    }
  }

  onCategoryChange(event: any, category: any) {
    const categories = this.taskForm.get('category') as FormArray;

    if (event.checked) {
      categories.push(new FormControl(category.id));
    } else {
      const index = categories.controls.findIndex(
        (x) => x.value === category.id
      );
      categories.removeAt(index);
    }
  }
}
