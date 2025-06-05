import { Component } from '@angular/core';
import { LoginService } from '../service/login.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

 onSubmit() {
  if (this.email && this.password) {
    this.loginService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        const token = response?.token;

        if (token) {
          this.loginService.saveToken(token);

          const isNewUser = localStorage.getItem('isNewUser');
          if (isNewUser === 'true') {
           
            localStorage.removeItem('isNewUser'); 
            this.router.navigate(['/app-account-addition']);
          } else {
           
            this.router.navigate(['/app-show-stocks']); 
          }
        } else {
          console.warn("No token received in response.");
        }
      },
      error: (error) => {
        console.error("Login failed:", error);
        alert("Invalid credentials or server error.");
      }
    });
  } else {
    alert("Please enter both email and password.");
  }
}

}
