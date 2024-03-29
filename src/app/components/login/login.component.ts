import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginUser = { email: '', password: '' };
  failedLogin = false;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.logInUser(this.loginUser).subscribe(
      (res) => {
        localStorage.setItem('JWT', res.jwt);
        this.router.navigate(['/incidents']);
      },
      (err) => {
        this.failedLogin = true;
        console.log(err);
      }
    );
  }
}
