import { Component, OnInit } from '@angular/core';
import { MyProfileService, UserProfile } from '../service/my-profile-service.service';
import { CommonModule, formatCurrency } from '@angular/common';
import { HomeComponent } from '../home/home.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-profile',
  standalone:true,
  imports:[CommonModule,HomeComponent,FormsModule],
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  profile!: UserProfile;
  pinInput: string = '';
  showPopup: boolean = false;
  errorMessage: string = '';
  loading: boolean = true;

  constructor(private profileService: MyProfileService) {}

  ngOnInit(): void {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
        this.loading = false;
      }
    });
  }

  checkPIN() {
    if (this.pinInput === this.profile.accountPIN) {
      this.showPopup = true;
      this.errorMessage = '';
    } else {
      this.errorMessage = 'Incorrect PIN. Please try again.';
      this.showPopup = false;
    }
    this.pinInput = '';
  }

  closePopup() {
    this.showPopup = false;
  }
}
