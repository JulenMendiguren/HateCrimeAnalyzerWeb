import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginUser = { email: '', password: '' };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  login() {
    this.authService.logInUser(this.loginUser).subscribe(
      (res) => {
        localStorage.setItem('JWT', res.jwt);
      },
      (err) => console.log(err)
    );
  }
}
