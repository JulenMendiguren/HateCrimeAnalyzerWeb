import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginUser = { email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  login() {
    this.authService.logInUser(this.loginUser).subscribe(
      (res) => {
        localStorage.setItem('JWT', res.jwt);
        this.router.navigate(['/incidents']);
      },
      (err) => console.log(err)
    );
  }
}
