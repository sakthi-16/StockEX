import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../service/login.service';
import { CommonModule } from '@angular/common';

import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('newPassword')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordsMismatch: true };
};

@Component({
  selector: 'app-reset-password',
  standalone:true,
  imports:[FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  email: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService
  ) {
this.resetForm = this.fb.group({
  email: [{ value: '', disabled: true }, Validators.required],
  newPassword: ['', [
    Validators.required,
    Validators.minLength(8),
    Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
  ]],
  confirmPassword: [''] 
}, { validators: passwordMatchValidator });


    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.resetForm.patchValue({ email: this.email });
    });
  }

 resetPassword() {
  if (this.resetForm.invalid) return;

  const { newPassword } = this.resetForm.getRawValue();
  const { confirmPassword } = this.resetForm.getRawValue();  // includes disabled email
  this.loginService.resetPassword(this.email, newPassword,confirmPassword).subscribe({
    next: () => {
      alert('Password reset successful');
      this.router.navigate(['/app-login']);
    },
    error: () => {
      alert('Reset failed. Try again.');
      this.router.navigate(['/app-forgot-password']);
    }
  });
}

}
