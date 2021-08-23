import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class MinResearcherGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    if (!this.authService.isLogged()) {
      this.router.navigate(['/login']);
      return false;
    }
    const role = this.authService.getRole();
    if (role === 'researcher' || role === 'admin') {
      return true;
    }
    this.router.navigate(['/incidents']);
    return false;
  }
}
