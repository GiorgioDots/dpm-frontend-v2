import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { inject } from '@angular/core';

const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  let auth = inject(AuthenticationService);
  if (!auth.isAuthenticated()) {
    let router = inject(Router);
    router.navigate(['auth','login']);
    return false;
  }
  return true;
};
export default authGuard;
