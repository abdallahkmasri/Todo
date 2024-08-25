import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { SigninService } from 'src/app/services/signin.service';

@Component({
  templateUrl: './list.component.html',
  standalone: true,
  imports: [
    RouterModule,
    MatGridListModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class SignInComponent {
  signinForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private signinService: SigninService
  ) {
    this.signinForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  Submit() {
    if (this.signinForm.valid) {
      this.signinService.signin(this.signinForm.value).subscribe({
        next: () => {
          this.router.navigateByUrl('/dashboard');
        },
        error: (error) => {
          // Handle sign-in errors
          console.error('Sign-in error', error);
        },
      });
    }
  }
}
