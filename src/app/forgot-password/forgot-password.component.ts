import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../service/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  imports:[FormsModule,CommonModule,ReactiveFormsModule],
  standalone:true,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  emailForm: FormGroup;
  otpForm: FormGroup;
showEmailBox: boolean = true;
showOtpBox: boolean = false;
showTimer: boolean = false;
  timer = 180; 
  timerInterval: any;
  attemptsLeft = 2;
  successMessage: string = '';
errorMessage: string = '';


  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router) {
    this.emailForm = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
    this.otpForm = this.fb.group({ otp: ['', [Validators.required]] });
  }
sendOtp() {
  const email = this.emailForm.value.email;
  this.loginService.sendOtp(email).subscribe({
    next: (res) => {
      if (res.success) {
        this.successMessage = res.message;    
        this.errorMessage = '';
        this.showEmailBox = false;
        this.showOtpBox = true;
        this.showTimer = true;
        this.startTimer();
      } else {
        this.errorMessage = res.message;      
        this.successMessage = '';              
      }
    },
    error: (err) => {
      console.error('Error sending OTP:', err);
      alert('Failed to send OTP. Please try again.');  
    }
  });
}




intervalId: any;

startTimer() {
  this.timer = 180;
  this.showTimer = true;
  this.intervalId = setInterval(() => {
    this.timer--;
    if (this.timer <= 0) {
      clearInterval(this.intervalId);
      this.showTimer = false;
      this.showOtpBox = false;
      this.showEmailBox = true;
      alert("OTP expired. Please request a new one.");
    }
  }, 1000);
}


  handleOtpTimeout() {
    this.showOtpBox = false;
    this.showEmailBox = true;
    this.attemptsLeft--;
    alert('OTP expired. You have ' + this.attemptsLeft + ' attempt(s) left.');
    if (this.attemptsLeft < 0) {
      alert('No more attempts left. Please try again after 15minutes.');
      this.router.navigate(['/app-login']);
    }
  }

verifyOtp() {
  const email = this.emailForm.value.email;
  const otp = this.otpForm.value.otp;

  this.loginService.verifyOtp({ email, otp }).subscribe({
    next: (res: any) => {
      if (res.success) {
        clearInterval(this.intervalId);
        this.router.navigate(['/reset-password'], { queryParams: { email } });
      } else {
        this.errorMessage = res.message; 
      }
    },
    error: () => {
      this.errorMessage = "Server error. Please try again.";
    }
  });
}

}