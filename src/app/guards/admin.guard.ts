import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = () => {
  const isAuth = localStorage.getItem('admin-auth') === 'true';
  if (!isAuth) {
    inject(Router).navigate(['/admin/login']);
    return false;
  }
  return true;
};
