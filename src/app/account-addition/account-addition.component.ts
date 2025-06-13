import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountAdditionService } from '../service/account-addition-service.service';
import { Router } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NotyfService } from '../service/notyf.service';


@Component({
  selector: 'app-user-account',
  standalone:true,
  imports:[ReactiveFormsModule,HttpClientModule,CommonModule],
  templateUrl: './account-addition.component.html',
  styleUrls: ['./account-addition.component.css']
})
export class AccountAdditionComponent implements OnInit {

  accountForm!: FormGroup;
  popupMessage: string = '';
  popupSuccess: boolean = false;
  errorMessage: string ='';

  constructor(
    private fb: FormBuilder,
    private accountService: AccountAdditionService,
    private router: Router,
    private notyf:NotyfService
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
    if (this.accountForm.valid) {
      this.accountService.addAccount(this.accountForm.value).subscribe({
     next: (res: any) => {
  console.log("Response received in next():", res); // 🔍 check structure

  let msg = 'Something went wrong.';
  try {
    // Case 1: Backend sent message as part of a nested body
    if (typeof res === 'string') {
      // If the response is a string, try to parse it
      const parsed = JSON.parse(res);
      msg = parsed.message || msg;
    } else if (res?.message) {
      // If response already has message field
      msg = res.message;
    } else if (res?.body && typeof res.body === 'string') {
      // Maybe the body is a stringified JSON
      const parsed = JSON.parse(res.body);
      msg = parsed.message || msg;
    } else if (res?.error?.message) {
      // Some backend frameworks return { error: { message: '...' } }
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
}

,
error: (err: any) => {
  console.log("ERROR OBJECT:", err);
  console.log("ERROR ERROR:", err.error);

  let msg = 'Something went wrong.';
  try {
    const parsed = JSON.parse(err.error);
    msg = parsed.message || msg;
  } catch (e) {
    console.error("Failed to parse error JSON", e);
  }

  console.log("FINAL MESSAGE TO SHOW:", msg);

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
}
