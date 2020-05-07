import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class MinColaboratorGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate() {
    if (!this.authService.isLogged()) {
      return false;
    }
    const role = this.authService.getRole();
    if (role === 'colaborator' || role === 'researcher' || role === 'admin') {
      return true;
    }
    return false;
  }
}
