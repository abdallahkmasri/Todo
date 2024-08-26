import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SigninService } from './signin.service';

export const AuthGuard: CanActivateFn = () => {
  const signinService = inject(SigninService);
  const router = inject(Router);

  if (signinService.isAuthenticated()) {
    return true;
  } else {
    router.navigateByUrl('/');
    return false;
  }
};
