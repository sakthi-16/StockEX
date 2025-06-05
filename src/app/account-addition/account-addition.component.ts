import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountAdditionService } from '../service/account-addition-service.service';
import { Router } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';


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

  constructor(
    private fb: FormBuilder,
    private accountService: AccountAdditionService,
    private router: Router
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
        next: (res) => {
          this.popupMessage = res;
          this.popupSuccess = true;
          setTimeout(() => {
            this.popupMessage = '';
            this.router.navigate(['/app-show-stocks']); // Change to actual route
          }, 2000);
        },
        error: (err) => {
          this.popupMessage = err.error;
          this.popupSuccess = false;
          setTimeout(() => {
            this.popupMessage = '';
          }, 3000);
        }
      });
    }
  }
}
