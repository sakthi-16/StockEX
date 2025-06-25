import { Component } from '@angular/core';
import { LoginService } from '../service/login.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotyfService } from '../service/notyf.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private loginService: LoginService,
    private router: Router,
    private notyf: NotyfService
  ) {}

 onSubmit() {
  if (this.email && this.password) {
    this.loginService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        const token = response?.token;
        const isLinkedAccount = response?.isLinkedAccount;

        if (token) {
          this.loginService.saveToken(token);

          // Optionally store this if needed later
          localStorage.setItem('isLinkedAccount', isLinkedAccount ? 'true' : 'false');

          if (this.email === 'snsakthi16@gmail.com') {
            this.router.navigate(['/app-update-stock']);
          } else {
            const isNewUser = localStorage.getItem('isNewUser');

            if (isNewUser === 'true') {
              localStorage.removeItem('isNewUser');
              this.router.navigate(['/app-account-addition']);
            } else if (!isLinkedAccount) {
              // Not linked yet, force account addition
              this.router.navigate(['/app-account-addition']);
            } else {
              // Normal flow
              this.router.navigate(['/app-show-stocks']);
            }
          }
        } else {
          console.warn("No token received in response.");
        }
      },
      error: (error: any) => {
        this.notyf.error(error.error.error);
        console.error("Login failed:", error);
      }
    });
  } else {
    this.notyf.error("Please enter both email and password.");
  }
}

}
