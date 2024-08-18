import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { SigninService } from 'src/app/services/signin.service';
import { TaskListPartial } from '../task/list.partial';
import { CompletedListPartial } from '../completed/list.partial';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { TaskAddComponent } from '../task/add.partial';

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
    MatGridListModule,
    MatChipsModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatListModule,
    MatToolbarModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    TaskListPartial,
    CompletedListPartial
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  search: FormGroup;

  constructor(private fb: FormBuilder, private signinService: SigninService, public dialog: MatDialog) {
    this.search = this.fb.group({
      item: [''],
    });
  }
  // Sample data for demonstration
  userName = 'user';

  Logout() {
    this.signinService.logout();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TaskAddComponent, {
      width: '400px',
      data: { task: {} } // Pass any data you want to initialize the dialog with
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the result from the dialog (e.g., save the new task)
        console.log('Task added:', result);
      }
    });
  }
  
}
