import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { inject } from '@angular/core';

const notAuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  let auth = inject(AuthenticationService);
  if (auth.isAuthenticated()) {
    let router = inject(Router);
    router.navigate(['']);
    return false;
  }
  return true;
};
export default notAuthGuard;