import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountAdditionService } from '../service/account-addition-service.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NotyfService } from '../service/notyf.service';

@Component({
  selector: 'app-user-account',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './account-addition.component.html',
  styleUrls: ['./account-addition.component.css']
})
export class AccountAdditionComponent implements OnInit {

  accountForm!: FormGroup;
  popupMessage: string = '';
  popupSuccess: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private accountService: AccountAdditionService,
    private router: Router,
    private notyf: NotyfService
  ) {}

  ngOnInit(): void {
    this.accountForm = this.fb.group({
      userMail: ['', [Validators.required, Validators.email]],
      userBankAccount: ['', Validators.required],
      userAccountBalance: ['', [Validators.required, Validators.min(0)]],
      accountPassword: ['', Validators.required]
    });
  }

  submitAccountForm(): void {
    const formData = this.accountForm.value;
    const allFieldsEmpty = Object.values(formData).every(
      value => typeof value === 'string' ? value.trim() === '' : !value
    );

    if (allFieldsEmpty) {
      this.popupMessage = 'Please fill all the above fields.';
      this.popupSuccess = false;
      this.accountForm.markAllAsTouched();
      return;
    }

    if (this.accountForm.invalid) {
      this.popupMessage = 'Please fill the highlighted fields correctly.';
      this.popupSuccess = false;
      this.accountForm.markAllAsTouched();
      return;
    }

    this.accountService.addAccount(formData).subscribe({
      next: (res: any) => {
        let msg = 'Account added successfully.';
        try {
          if (typeof res === 'string') {
            const parsed = JSON.parse(res);
            msg = parsed.message || msg;
          } else if (res?.message) {
            msg = res.message;
          } else if (res?.body && typeof res.body === 'string') {
            const parsed = JSON.parse(res.body);
            msg = parsed.message || msg;
          } else if (res?.error?.message) {
            msg = res.error.message;
          }
        } catch (e) {
          console.error("Failed to parse backend response", e);
        }

        this.notyf.success(msg);
        this.popupMessage = msg;
        this.popupSuccess = true;

        setTimeout(() => {
          this.popupMessage = '';
          this.router.navigate(['/app-show-stocks']);
        }, 2000);
      },
      error: (err: any) => {
        let msg = 'Something went wrong.';
        try {
          const parsed = JSON.parse(err.error);
          msg = parsed.message || msg;
        } catch (e) {
          console.error("Failed to parse error JSON", e);
        }

        this.notyf.error(msg);
        this.popupMessage = msg;
        this.popupSuccess = false;

        setTimeout(() => {
          this.popupMessage = '';
        }, 3000);
      }
    });
  }
}
