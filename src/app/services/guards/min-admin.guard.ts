import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class MinAdminGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate() {
    if (!this.authService.isLogged()) {
      return false;
    }
    const role = this.authService.getRole();
    if (role === 'admin') {
      return true;
    }
    return false;
  }
}
