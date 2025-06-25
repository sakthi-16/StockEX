import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupService } from '../service/signup-service.service';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NotyfService } from '../service/notyf.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private signupService: SignupService,
    private router: Router,
    private notyf: NotyfService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      pan: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      dob: ['', [Validators.required, this.pastDateValidator()]],
      password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  get passwordPattern(): RegExp {
    // Minimum 8 characters, at least one uppercase, one lowercase, one number, and one special character
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@\[\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@\[\]^_`{|}~]{8,}$/;
  }

  pastDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const inputDate = new Date(control.value);
      const today = new Date();
      return inputDate > today ? { futureDate: true } : null;
    };
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    const formData = this.signupForm.value;
const allFieldsEmpty = Object.values(formData).every(value =>
  typeof value === 'string' ? value.trim() === '' : !value
);

    if (allFieldsEmpty) {
      this.errorMessage = 'Please fill all the fields above.';
      this.successMessage = '';
      this.signupForm.markAllAsTouched();
      return;
    }

    if (this.signupForm.invalid) {
      this.errorMessage = 'Please fill the highlighted fields correctly.';
      this.successMessage = '';
      this.signupForm.markAllAsTouched();
      return;
    }

    this.signupService.registerUser(formData).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.errorMessage = '';
        localStorage.setItem('isNewUser', 'true');
        setTimeout(() => {
          this.router.navigate(['/app-login']);
        }, 2000);
      },
      error: (error: any) => {
        console.log(error.error.message);
        this.errorMessage = error.error.message || 'An error occurred during signup.';
        this.successMessage = '';
      }
    });
  }
}
